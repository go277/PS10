import os
import glob
import numpy as np

# POINT DIRECTLY TO THE FACTORY DATA
data_dir = r"D:\PROJECTS\PS10\ml_pipeline\data\production_dataset"
files = glob.glob(os.path.join(data_dir, "*.npy"))

if not files:
    print("❌ No data found in the production_dataset folder!")
else:
    # Let's check the very first file our factory made
    sample_path = files[0]
    data = np.load(sample_path)
    
    print("====================================================")
    print(f"🔍 INSPECTING TILE: {os.path.basename(sample_path)}")
    print(f"📊 Full Array Shape: {data.shape}")
    print("====================================================")
    
    if len(data.shape) == 3:
        thermal_channel = data[0]
        rgb_channels = data[1:4]
        
        print(f"🌡️ THERMAL CHANNEL (Input - Band 0)")
        print(f"   • Min Value: {thermal_channel.min():.2f}")
        print(f"   • Max Value: {thermal_channel.max():.2f}")
        print("----------------------------------------------------")
        print(f"🎨 RGB CHANNELS (Target - Bands 1, 2, 3)")
        print(f"   • Min Value: {rgb_channels.min():.2f}")
        print(f"   • Max Value: {rgb_channels.max():.2f}")
        print("====================================================")
    else:
        print("⚠️ ERROR: This tile is not 3D! Something is wrong.")