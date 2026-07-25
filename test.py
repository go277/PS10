import numpy as np
import glob
import os

data_dir = r"D:\PROJECTS\PS10\ml_pipeline\data\production_dataset"
sample_file = glob.glob(os.path.join(data_dir, "*.npy"))[0]
tile = np.load(sample_file)

print(f"File: {os.path.basename(sample_file)}")
print(f"Shape: {tile.shape}")
print(f"Raw Min Value: {tile.min()}")
print(f"Raw Max Value: {tile.max()}")
print(f"Raw Mean Value: {tile.mean()}")