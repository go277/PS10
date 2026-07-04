import os
import rasterio
from rasterio.windows import Window
import numpy as np

def process_production_geotiff(thermal_path, rgb_path, qa_path, output_dir="data/production_dataset", patch_size=256):
    """
    Production Ingestion: Processes Thermal, RGB, and QA bands.
    Filters out noisy/cloudy patches based on the Quality Assessment (QA) band.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    print(f"📡 Ingesting: {os.path.basename(thermal_path)} + {os.path.basename(rgb_path)}")

    with rasterio.open(thermal_path) as src_t, \
         rasterio.open(rgb_path) as src_r, \
         rasterio.open(qa_path) as src_q:
        
        patch_count = 0
        total_skipped = 0

        for row_off in range(0, src_t.height, patch_size):
            for col_off in range(0, src_t.width, patch_size):
                if row_off + patch_size > src_t.height or col_off + patch_size > src_t.width:
                    continue

                window = Window(col_off, row_off, patch_size, patch_size)
                
                # 1. Read the QA band (Quality Assessment)
                # Typically 0 means "Clear", > 0 often indicates clouds/shadows
                qa_data = src_q.read(1, window=window)
                
                # CRITICAL: Skip patches that are heavily obscured (e.g., > 10% clouds/shadows)
                # Adjust threshold based on your specific satellite dataset
                if np.sum(qa_data > 0) > (patch_size * patch_size * 0.1):
                    total_skipped += 1
                    continue

                # 2. Read Thermal (Input)
                thermal_data = src_t.read(1, window=window).astype(np.float32) / 65535.0
                
                # 3. Read RGB (Target)
                rgb_data = src_r.read([1, 2, 3], window=window).astype(np.float32) / 65535.0

                # 4. Save as a 4-channel tensor (Thermal + RGB)
                combined = np.concatenate([thermal_data[np.newaxis, :, :], rgb_data], axis=0)
                
                np.save(os.path.join(output_dir, f"patch_{patch_count:04d}.npy"), combined)
                patch_count += 1

        print(f"✅ Production dataset generated: {patch_count} clean patches.")
        print(f"⚠️ Skipped {total_skipped} patches due to clouds/artifacts.")

if __name__ == "__main__":
    # Point to your files inside the raw_maps folder
    # We use os.path.join to ensure it works on any operating system
    thermal = os.path.join("raw_maps", "thermal.tif")
    rgb = os.path.join("raw_maps", "reflective_color.tif")
    qa = os.path.join("raw_maps", "quality.tif")
    
    if all(os.path.exists(f) for f in [thermal, rgb, qa]):
        process_production_geotiff(thermal, rgb, qa)
    else:
        # Let's print exactly which file is missing to help you debug
        for f in [thermal, rgb, qa]:
            if not os.path.exists(f):
                print(f"❌ Error: Missing file -> {f}")