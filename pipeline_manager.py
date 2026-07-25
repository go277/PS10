import ee
import geemap
import os
import numpy as np
import rasterio

# 1. Initialize GEE
try:
    ee.Initialize(project='ps10-satellite-project')
except Exception:
    ee.Initialize()

# 2. Paths
raw_dir = r"D:\PROJECTS\PS10\ml_pipeline\data\raw_tifs"
proc_dir = r"D:\PROJECTS\PS10\ml_pipeline\data\production_dataset"
os.makedirs(raw_dir, exist_ok=True)
os.makedirs(proc_dir, exist_ok=True)

# 3. List of Regions to Automate
regions = [
    [77.05, 28.50, 77.30, 28.70], # Delhi
    [72.75, 18.85, 73.00, 19.20], # Mumbai
    [88.50, 21.60, 89.10, 22.10], # Sundarbans
]

patch_size = 256

for i, coords in enumerate(regions):
    print(f"🚀 Processing region {i+1}/{len(regions)}: {coords}")
    
    # Fetch
    roi = ee.Geometry.BBox(*coords)
    dataset = (ee.ImageCollection("LANDSAT/LC08/C02/T1_TOA")
               .filterBounds(roi)
               .filter(ee.Filter.lt('CLOUD_COVER', 5))
               .sort('CLOUD_COVER'))
    
    img = dataset.first().select(['B10', 'B4', 'B3', 'B2'])
    out_tif = os.path.join(raw_dir, f"region_{i}.tif")
    
    geemap.ee_export_image(img, filename=out_tif, scale=90, region=roi, file_per_band=False)
    
    # Slice
    with rasterio.open(out_tif) as src:
        data = src.read()
        _, h, w = data.shape
        count = 0
        for y in range(0, h - patch_size, patch_size):
            for x in range(0, w - patch_size, patch_size):
                patch = data[:, y:y+patch_size, x:x+patch_size]
                if np.sum(patch) > 0:
                    np.save(os.path.join(proc_dir, f"reg{i}_tile_{count}.npy"), patch)
                    count += 1
    print(f"✅ Finished region {i+1}. Created {count} tiles.")

print("🎉 PIPELINE COMPLETE. Dataset is ready for training!")