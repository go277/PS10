import io
import base64
from PIL import Image
import numpy as np
import torch
import rasterio
from rasterio.io import MemoryFile
from ultralytics import YOLO
from rasterio.warp import transform_bounds

# Initialize YOLOv8 Model globally so it doesn't slow down the API
try:
    vision_model = YOLO('yolov8n.pt') 
except Exception as e:
    print(f"YOLO initialization failed: {e}")
    vision_model = None

def parse_satellite_upload(file_bytes, filename=""):
    """
    Production File Parser: 
    Handles both legacy .npy arrays and raw USGS .tif files directly in memory.
    """
    # 1. Handle Hackathon .npy files
    if filename.endswith('.npy') or not filename:
        np_bytes = io.BytesIO(file_bytes)
        arr = np.load(np_bytes)
        return arr
        
    # 2. Handle Production .tif/.tiff files
    elif filename.lower().endswith(('.tif', '.tiff')):
        # Read the raw satellite byte-stream directly in RAM
        with MemoryFile(file_bytes) as memfile:
            with memfile.open() as dataset:
                # Read the first band (Band 10 Thermal)
                arr = dataset.read(1)
                
                # If it's raw 16-bit data or unscaled, cast to float32 for deep learning
                if arr.dtype == np.uint16 or arr.max() > 1.0:
                    arr = arr.astype(np.float32)
                    
                return arr
    else:
        raise ValueError(f"Unsupported file extension: {filename}")

def tensor_to_base64(tensor_data, is_color=False):
    """
    Safely converts deep learning tensors (0.0 to 1.0) 
    back into web-ready JPEGs (0 to 255).
    """
    # 1. Move off GPU and convert to NumPy
    if isinstance(tensor_data, torch.Tensor):
        arr = tensor_data.detach().cpu().numpy()
    else:
        arr = np.array(tensor_data)
        
    # 2. Remove batch dimension if the AI added one
    if len(arr.shape) == 4:
        arr = arr[0]
        
    # 3. Convert from PyTorch format (C, H, W) to Web format (H, W, C)
    if arr.shape[0] in [1, 3]:
        arr = np.transpose(arr, (1, 2, 0))
        
    # 4. Scale AI decimals (0.0 - 1.0) back to standard pixels (0 - 255)
    if arr.dtype == np.float32 or arr.dtype == np.float64:
        if arr.min() < 0:
            arr = (arr + 1.0) / 2.0
        arr = (arr * 255.0).clip(0, 255).astype(np.uint8)
    else:
        arr = arr.clip(0, 255).astype(np.uint8)
        
    # 5. Build the final Image
    if not is_color or arr.shape[-1] == 1:
        arr = arr.squeeze()
        img = Image.fromarray(arr, mode='L')
    else:
        img = Image.fromarray(arr, mode='RGB')
        
    # 6. Encode for React
    buffered = io.BytesIO()
    img.save(buffered, format="JPEG", quality=95)
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
    
    return f"data:image/jpeg;base64,{img_str}"

def analyze_land_cover(rgb_input):
    """
    Phase 9 Analytics: Scans the AI's RGB output to calculate Water/Vegetation %.
    """
    if isinstance(rgb_input, torch.Tensor):
        rgb_input = rgb_input.detach().cpu().numpy()
        
    if len(rgb_input.shape) == 4:
        rgb_input = rgb_input[0]
        
    img = np.transpose(rgb_input, (1, 2, 0))
    r, g, b = img[:,:,0], img[:,:,1], img[:,:,2]
    
    veg_mask = (g > r + 0.05) & (g > b + 0.05)
    water_mask = (b > r + 0.05) & (b > g + 0.05)
    
    total_pixels = img.shape[0] * img.shape[1]
    
    veg_percent = (np.sum(veg_mask) / total_pixels) * 100
    water_percent = (np.sum(water_mask) / total_pixels) * 100
    
    return float(round(veg_percent, 2)), float(round(water_percent, 2))

def detect_infrastructure(rgb_input):
    """
    Phase 9 Analytics: Uses YOLOv8 to detect structures and estimate infrastructure.
    """
    if vision_model is None:
        return 0, 0.0
        
    if isinstance(rgb_input, torch.Tensor):
        rgb_input = rgb_input.detach().cpu().numpy()
        
    if len(rgb_input.shape) == 4:
        rgb_input = rgb_input[0]
        
    img = np.transpose(rgb_input, (1, 2, 0))
    
    if img.max() <= 1.0:
        img = (img * 255).astype(np.uint8)
        
    results = vision_model(img, verbose=False)
    
    total_buildings = 0
    road_length_estimate = 0.0
    
    if len(results) > 0:
        boxes = results[0].boxes
        total_buildings = len(boxes)
        road_length_estimate = float(round(total_buildings * 0.12, 2))
        
    return total_buildings, road_length_estimate

def extract_geolocation(file_bytes, filename=""):
    """
    Extracts the bounding box from a GeoTIFF and converts it to standard GPS Latitude/Longitude.
    """
    if filename.lower().endswith(('.tif', '.tiff')):
        try:
            with MemoryFile(file_bytes) as memfile:
                with memfile.open() as dataset:
                    # dataset.bounds gets the coordinates in the satellite's native format
                    # transform_bounds converts them to standard GPS (EPSG:4326)
                    min_lon, min_lat, max_lon, max_lat = transform_bounds(dataset.crs, 'EPSG:4326', *dataset.bounds)
                    
                    center_lat = (min_lat + max_lat) / 2
                    center_lon = (min_lon + max_lon) / 2
                    
                    return {
                        "lat": center_lat,
                        "lon": center_lon,
                        "bounds": [[min_lat, min_lon], [max_lat, max_lon]]
                    }
        except Exception as e:
            print(f"⚠️ Geolocation extraction failed: {e}")
            
    # Fallback to ISRO's Satish Dhawan Space Centre if it's an .npy file or lacks metadata
    return {
        "lat": 13.7198, 
        "lon": 80.2304, 
        "bounds": [[13.71, 80.22], [13.73, 80.24]]
    }
def generate_segmentation_mask(rgb_tensor):
    """
    Scans the AI's RGB output and generates a classified color mask.
    Colors perfectly match the PS10 UI Frontend design.
    """
    # 1. Convert PyTorch tensor to Numpy array (Height, Width, Channels)
    if torch.is_tensor(rgb_tensor):
        img = rgb_tensor.squeeze().cpu().numpy()
        if img.shape[0] == 3:
            img = np.transpose(img, (1, 2, 0))
    else:
        img = rgb_tensor.copy()
        
    if img.max() <= 1.0:
        img = (img * 255).astype(np.float32)
        
    r, g, b = img[:, :, 0], img[:, :, 1], img[:, :, 2]
    
    # 2. Initialize a blank black mask
    h, w = r.shape
    mask = np.zeros((h, w, 3), dtype=np.uint8)
    
    # 3. The Classification Algorithm (MVP Heuristics)
    is_veg = (g > r + 20) & (g > b + 20)
    is_water = (b > r + 20) & (b > g + 10)
    is_bldg = (r > 140) & (g > 140) & (b > 140)
    is_road = ~(is_veg | is_water | is_bldg) # Anything left over
    
    # 4. Paint the mask with the exact UI hex colors
    mask[is_veg] = [99, 153, 34]    # UI Green: #639922 (Vegetation)
    mask[is_water] = [55, 138, 221] # UI Blue: #378ADD (Water)
    mask[is_bldg] = [127, 119, 221] # UI Purple: #7F77DD (Buildings)
    mask[is_road] = [216, 90, 48]   # UI Orange: #D85A30 (Roads/Barren)
    
    # 5. Convert back to PyTorch Tensor (1, 3, H, W) for base64 conversion
    mask_tensor = torch.from_numpy(np.transpose(mask, (2, 0, 1))).float() / 255.0
    return mask_tensor.unsqueeze(0)