import numpy as np
import glob

# Point this to your actual sliced dataset folder
files = glob.glob(r"D:\PROJECTS\PS10\ml_pipeline\data\production_dataset\*.npy")

t_min, t_max = float('inf'), float('-inf')
r_max = float('-inf')

print("🔍 Scanning dataset to find true global bounds (this takes a few seconds)...")

# Scanning the first 1000 tiles is usually enough to find the extremes
for f in files[:1000]: 
    data = np.load(f)
    t = data[0:1]  # Thermal channel
    r = data[1:4]  # RGB channels
    
    if t.min() < t_min: t_min = t.min()
    if t.max() > t_max: t_max = t.max()
    if r.max() > r_max: r_max = r.max()

print("="*40)
print(f"🔥 Thermal MIN to plug in: {t_min:.2f}")
print(f"🔥 Thermal MAX to plug in: {t_max:.2f}")
print(f"🌍 RGB MAX to plug in: {r_max:.4f}")
print("="*40)