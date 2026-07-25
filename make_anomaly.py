import numpy as np

# Create an empty 256x256 array (assuming your AI expects 1 channel)
# If your AI expects a specific shape like (1, 256, 256), adjust accordingly.
anomaly_tile = np.zeros((1, 256, 256), dtype=np.float32)

# 1. Add some pure random static (TV noise)
noise = np.random.uniform(270.0, 310.0, (256, 256)) # Random Kelvin temperatures
anomaly_tile[0] = noise

# 2. Draw a massive, unnatural geometric heat square in the middle
# Nature doesn't make perfect squares, so this is a true "foreign element"
anomaly_tile[0, 100:150, 100:150] = 350.0 # Extremely hot anomaly

# Save it as an .npy file
np.save("alien_test_tile.npy", anomaly_tile)
print("✅ alien_test_tile.npy created! Drag and drop this into your website.")