import os
import torch
import torch.nn.functional as F  # NEW: We need this for the auto-resizer
import numpy as np
import torchvision.transforms.functional as TF
from ml_pipeline.gan import GeneratorUNet

class InferenceEngine:
    def __init__(self):
        # 1. Connect to the GPU
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = GeneratorUNet().to(self.device)
        
        current_dir = os.path.dirname(os.path.abspath(__file__))
        weights_path = os.path.join(current_dir, "weights", "generator_final.pth")
        
        try:
            self.model.load_state_dict(torch.load(weights_path, weights_only=True))
            self.model.eval() 
            print(f"✅ SUCCESS: Production GAN loaded from {weights_path}")
        except Exception as e:
            print(f"⚠️ ERROR: Could not load GAN weights. Details: {e}")

    def predict(self, numpy_tile):
        """
        Takes raw thermal data, extracts a true 1:1 scale patch,
        normalizes the contrast perfectly, and generates the RGB.
        """
        if len(numpy_tile.shape) == 2:
            tensor_input = torch.tensor(numpy_tile, dtype=torch.float32).unsqueeze(0).unsqueeze(0)
        else:
            tensor_input = torch.tensor(numpy_tile, dtype=torch.float32).unsqueeze(0)
        
        # 1. THE SMART CROP: 
        # Instead of squashing the image, we extract a 256x256 window.
        # We grab it slightly off-center to ensure we hit actual land, not the black space borders.
        _, _, h, w = tensor_input.shape
        if h >= 512 and w >= 512:
            # Grab a patch from the top-left quadrant of the data
            tensor_input = TF.crop(tensor_input, top=h//4, left=w//4, height=256, width=256)
        else:
            # Fallback for smaller images
            tensor_input = TF.center_crop(tensor_input, [256, 256])

        # 2. AUTO-CONTRAST NORMALIZATION:
        # This fixes the "Solid White Square" bug by stretching the min/max 
        # values of this specific crop perfectly between 0.0 and 1.0.
        t_min = tensor_input.min()
        t_max = tensor_input.max()
        if t_max > t_min:
            tensor_input = (tensor_input - t_min) / (t_max - t_min)
            
        tensor_input = tensor_input.to(self.device)

        with torch.no_grad():
            # Generate the RGB image
            rgb_output = self.model(tensor_input)

        return tensor_input.cpu(), rgb_output.cpu()