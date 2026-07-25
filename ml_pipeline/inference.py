import os
import sys
import torch
import numpy as np
import matplotlib.pyplot as plt

# Tell Python to always include this specific folder in its search path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

from gan import GeneratorUNet

class InferenceEngine:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = GeneratorUNet().to(self.device)
        
        current_dir = os.path.dirname(os.path.abspath(__file__))
        weights_path = os.path.join(current_dir, "weights", "best_isro_model.pth")
        
        print(f"🔄 Loading 12.5-Hour Master Weights from: {weights_path}")
        try:
            self.model.load_state_dict(torch.load(weights_path, map_location=self.device, weights_only=True))
            # Keeping in train() mode to bypass static BatchNorm traps
            self.model.train() 
            print(f"✅ SUCCESS: Loaded ultimate VGG-Enhanced model!")
        except Exception as e:
            print(f"⚠️ ERROR: Could not load weights. Details: {e}")
            sys.exit(1)

    def predict(self, numpy_tile):
        # 1. Extract just the thermal channel
        if numpy_tile.shape[0] == 4:
            thermal_channel = numpy_tile[0:1, :, :]
        else:
            thermal_channel = numpy_tile
            
        # 2. Match train.py global scaling
        normalized_tile = (thermal_channel - 243.20) / (337.79 - 243.20)
        normalized_tile = np.clip(normalized_tile, 0.0, 1.0)

        # 3. Predict
        tensor_input = torch.tensor(normalized_tile, dtype=torch.float32).unsqueeze(0).to(self.device)
        tensor_input = (tensor_input * 2.0) - 1.0
        
        with torch.no_grad():
            fake_rgb = self.model(tensor_input)
            
        # 4. Denormalize GAN output from [-1, 1] back to Image RGB [0, 1]
        fake_rgb = (fake_rgb.squeeze(0).cpu().numpy() + 1.0) / 2.0
        
        # ==========================================
        # 🚨 THE FLASHLIGHT PATCH 🚨
        # The AI drew the image perfectly, but compressed the brightness to the bottom 5%
        # We stretch the lighting back out so human eyes can see it.
        # ==========================================
        p2, p98 = np.percentile(fake_rgb, (2, 98))
        if p98 > p2:
            fake_rgb = (fake_rgb - p2) / (p98 - p2)
            
        # Add a slight gamma correction to make the greens and blues pop
        fake_rgb = np.power(fake_rgb, 0.8)
        
        fake_rgb = np.clip(fake_rgb, 0.0, 1.0)
        
        # Transpose to (H, W, C)
        fake_rgb = np.transpose(fake_rgb, (1, 2, 0))
        
        return normalized_tile[0], fake_rgb

if __name__ == "__main__":
    import glob
    import random 
    
    engine = InferenceEngine()
    data_dir = r"D:\PROJECTS\PS10\ml_pipeline\data\production_dataset"
    
    all_tiles = glob.glob(os.path.join(data_dir, "*.npy"))
    
    if not all_tiles:
        print(f"❌ ERROR: No tiles found in {data_dir}. Check your path!")
        sys.exit(1)
        
    best_path = random.choice(all_tiles)
    best_tile = np.load(best_path)
    
    print(f"🏆 Selected: {os.path.basename(best_path)}")
    
    thermal_in, rgb_out = engine.predict(best_tile)
    
    # Plotting
    plt.figure(figsize=(10, 5))
    plt.subplot(1, 2, 1)
    # vmin/vmax stops matplotlib from hallucinating blank colors
    plt.imshow(thermal_in, cmap='gray', vmin=0.0, vmax=1.0) 
    plt.title("Input Thermal (True Global Scale)")
    
    plt.subplot(1, 2, 2)
    plt.imshow(rgb_out)
    plt.title("VGG-Enhanced AI Generated RGB")
    
    plt.savefig("inference_result.png")
    print("✅ Saved result to 'inference_result.png'. Open it up!")