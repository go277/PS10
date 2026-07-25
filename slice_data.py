import numpy as np
import rasterio
import os
import sys

region_index = os.environ.get("REGION_INDEX", "0")
input_tif = rf"D:\PROJECTS\PS10\ml_pipeline\data\raw_tifs\region_{region_index}.tif"
output_dir = r"D:\PROJECTS\PS10\ml_pipeline\data\production_dataset"
os.makedirs(output_dir, exist_ok=True)

if not os.path.exists(input_tif):
    print(f"❌ Error: {input_tif} not found!")
    sys.exit(1)

with rasterio.open(input_tif) as src:
    img = src.read() 
    print(f"DEBUG: Processing region_{region_index}.tif | Shape: {img.shape}")

patch_size = 256
stride = 64 

_, height, width = img.shape

if height < patch_size or width < patch_size:
    pad_h = max(0, patch_size - height)
    pad_w = max(0, patch_size - width)
    img = np.pad(img, ((0, 0), (0, pad_h), (0, pad_w)), mode='constant')

count = 0
for i in range(0, img.shape[1] - patch_size + 1, stride):
    for j in range(0, img.shape[2] - patch_size + 1, stride):
        patch = img[:, i:i+patch_size, j:j+patch_size]
        
        # ==========================================\
        # 🛡️ THE CORRECTED "NO BLACK WALL" SHIELD
        # ==========================================\
        
        # We only reject if more than 5% of the tile is pure black NoData.
        # This allows tiny edge artifacts but destroys actual black walls.
        zero_ratio = np.sum(patch == 0) / patch.size
        if zero_ratio > 0.05: 
            continue
            
        # The flawed 0.8 mean filter has been removed!
            
        # Save the perfect tile
        out_name = os.path.join(output_dir, f"r{region_index}_tile_{count}.npy")
        np.save(out_name, patch)
        count += 1

print(f"✅ Success! Created {count} high-quality, perfectly clean AI-ready tiles for region {region_index}.")

# ==========================================
# 🧹 DISK MANAGEMENT: CLEAN UP RAW DATA
# ==========================================
try:
    os.remove(input_tif)
    print(f"🗑️ Cleaned up: Deleted heavy raw file {input_tif} to save disk space.")
except Exception as e:
    print(f"⚠️ Warning: Could not delete {input_tif}. Error: {e}")