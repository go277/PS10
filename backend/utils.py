import numpy as np
import torch
from transformers import SegformerImageProcessor, SegformerForSemanticSegmentation
from PIL import Image
import warnings

# Suppress HuggingFace warnings for cleaner logs
warnings.filterwarnings("ignore")

print("⏳ Downloading/Loading Pre-Trained Analyst AI (SegFormer)...")
processor = SegformerImageProcessor.from_pretrained("nvidia/segformer-b0-finetuned-ade-512-512")
model = SegformerForSemanticSegmentation.from_pretrained("nvidia/segformer-b0-finetuned-ade-512-512")
print("✅ Analyst AI Ready!")

def analyze_terrain(rgb_array):
    # 1. Ensure the array is formatted as (Height, Width, Channels)
    if rgb_array.shape[0] == 3:
        rgb_array = rgb_array.transpose(1, 2, 0)
        
    # ==========================================
    # 2. THE NIGHT VISION FILTER (Auto-Contrast)
    # SegFormer expects bright, daytime photos. 
    # We stretch the contrast so it can see the textures clearly.
    # ==========================================
    p2, p98 = np.percentile(rgb_array, (2, 98))
    if p98 > p2:
        # Stretch lighting between the 2nd and 98th percentile to drop dark noise
        rgb_array = np.clip((rgb_array - p2) / (p98 - p2), 0.0, 1.0)
        
    # 3. Convert to uint8 format [0 - 255]
    if rgb_array.dtype != np.uint8:
        img_uint8 = (rgb_array * 255).astype(np.uint8)
    else:
        img_uint8 = rgb_array
        
    image = Image.fromarray(img_uint8)

    # 4. Pass the enhanced image to the SegFormer AI
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
        
    # 5. Resize predictions back to 256x256
    logits = torch.nn.functional.interpolate(
        outputs.logits,
        size=image.size[::-1],
        mode="bilinear",
        align_corners=False,
    )
    
    predicted_mask = logits.argmax(dim=1).squeeze().numpy()
    total_pixels = predicted_mask.size
    
    # ==========================================
    # 6. FIXED ADE20K CLASS MAPPING
    # Added expanded classes to catch everything accurately
    # ==========================================
    
    # Buildings: 1 (building), 25 (house), 79 (tent)
    building_mask = (predicted_mask == 1) | (predicted_mask == 25) | (predicted_mask == 79)
    
    # Vegetation: 4 (tree), 9 (grass), 17 (plant), 72 (field)
    veg_mask = (predicted_mask == 4) | (predicted_mask == 9) | (predicted_mask == 17) | (predicted_mask == 72)
    
    # Water: 21 (water), 26 (sea), 60 (river), 109 (pool), 128 (lake)
    water_mask = (predicted_mask == 21) | (predicted_mask == 26) | (predicted_mask == 60) | (predicted_mask == 109) | (predicted_mask == 128)
    
    # Count the pixels
    veg_count = np.sum(veg_mask)
    water_count = np.sum(water_mask)
    building_count = np.sum(building_mask)
    
    # Everything else gets categorized as Roads / Open Earth
    other_count = max(0, total_pixels - (veg_count + water_count + building_count))

    return {
        "vegetation": float(round((veg_count / total_pixels) * 100, 1)),
        "water": float(round((water_count / total_pixels) * 100, 1)),
        "buildings": float(round((building_count / total_pixels) * 100, 1)),
        "roads_other": float(round((other_count / total_pixels) * 50, 1)) 
    }