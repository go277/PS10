import ee
import geemap
import os
import sys

# The Bulletproof Import
venv_site_packages = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.venv', 'Lib', 'site-packages')
if venv_site_packages not in sys.path:
    sys.path.insert(0, venv_site_packages)

# Initialize
try:
    ee.Initialize(project='ps10-satellite-project')
except Exception:
    ee.Initialize()

coords = os.environ.get("REGION_COORDS", "77.05, 28.50, 77.30, 28.70").split(",")
coords = [float(x) for x in coords]
roi = ee.Geometry.BBox(*coords)
region_index = os.environ.get("REGION_INDEX", "0")

output_dir = r"D:\PROJECTS\PS10\ml_pipeline\data\raw_tifs"
os.makedirs(output_dir, exist_ok=True)
out_tif = os.path.join(output_dir, f"region_{region_index}.tif")

print(f"🌍 Fetching HIGH-RES data for Region {region_index}...")

# Filter by recent years and use .mosaic() to fill the bounding box completely
dataset = (ee.ImageCollection("LANDSAT/LC08/C02/T1_TOA")
           .filterBounds(roi)
           .filterDate('2023-01-01', '2024-01-01') 
           .filter(ee.Filter.lt('CLOUD_COVER', 15))
           .sort('CLOUD_COVER'))

# Select standard bands (Thermal, Red, Green, Blue)
best_image = dataset.mosaic().clip(roi).select(['B10', 'B4', 'B3', 'B2'])

print(f"📥 Downloading heavy 30m-scale stitched image for Region {region_index}... (This takes time)")

# --- THE FACTORY UPGRADE ---
# scale=30 pulls the raw, high-resolution 30-meter pixels instead of thumbnails!
geemap.ee_export_image(
    best_image,
    filename=out_tif,
    scale=30, 
    region=roi,
    file_per_band=False
)

print(f"✅ Download Complete! Saved to {out_tif}")