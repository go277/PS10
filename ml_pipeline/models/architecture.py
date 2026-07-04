import torch
import torch.nn as nn
import torch.nn.functional as F

class ResidualBlock(nn.Module):
    """
    Standard Residual Block to learn spatial features without vanishing gradients.
    Essential for preserving heat-signature boundaries and fine structural details.
    """
    def __init__(self, channels):
        super(ResidualBlock, self).__init__()
        self.conv1 = nn.Conv2d(channels, channels, kernel_size=3, padding=1, bias=False)
        self.bn1 = nn.BatchNorm2d(channels)
        self.relu = nn.PReLU()
        self.conv2 = nn.Conv2d(channels, channels, kernel_size=3, padding=1, bias=False)
        self.bn2 = nn.BatchNorm2d(channels)

    def forward(self, x):
        residual = x
        out = self.relu(self.bn1(self.conv1(x)))
        out = self.bn2(self.conv2(out))
        return out + residual


class SharedEncoder(nn.Module):
    """
    Extracts shared deep semantic features from the low-res thermal input (B10).
    Input shape: [Batch, 1, H, W] (e.g., 256x256 at 200m resolution)
    Output shape: [Batch, feature_channels, H, W]
    """
    def __init__(self, in_channels=1, feature_channels=64, num_res_blocks=4):
        super(SharedEncoder, self).__init__()
        # Initial feature extraction
        self.head = nn.Sequential(
            nn.Conv2d(in_channels, feature_channels, kernel_size=3, padding=1),
            nn.PReLU()
        )
        
        # Deep feature extraction via shared residual blocks
        self.body = nn.Sequential(
            *[ResidualBlock(feature_channels) for _ in range(num_res_blocks)]
        )

    def forward(self, x):
        x = self.head(x)
        features = self.body(x)
        return features


class SuperResolutionBranch(nn.Module):
    """
    Upsamples shared features by 2x (200m -> 100m resolution) and reconstructs 
    a sharpened single-channel thermal image (B10).
    """
    def __init__(self, feature_channels=64, num_res_blocks=2):
        super(SuperResolutionBranch, self).__init__()
        self.body = nn.Sequential(
            *[ResidualBlock(feature_channels) for _ in range(num_res_blocks)]
        )
        
        # Upsampling Block using sub-pixel convolution (PixelShuffle) for efficient 2x upscale
        self.upsample = nn.Sequential(
            nn.Conv2d(feature_channels, feature_channels * 4, kernel_size=3, padding=1),
            nn.PixelShuffle(2),
            nn.PReLU()
        )
        
        # Final reconstruction layer to output 1 channel thermal
        self.tail = nn.Conv2d(feature_channels, 1, kernel_size=3, padding=1)

    def forward(self, x):
        x = self.body(x)
        x = self.upsample(x)
        sr_thermal = self.tail(x)
        return sr_thermal


class ColorizationBranch(nn.Module):
    """
    Translates thermal heat representations into photorealistic 3-channel RGB imagery
    at 100m resolution, incorporating texture enhancement layers.
    """
    def __init__(self, feature_channels=64, num_res_blocks=2):
        super(ColorizationBranch, self).__init__()
        # Color Conversion Block
        self.body = nn.Sequential(
            *[ResidualBlock(feature_channels) for _ in range(num_res_blocks)]
        )
        
        # Upsample to 100m resolution (same spatial resolution as SR output)
        self.upsample = nn.Sequential(
            nn.Conv2d(feature_channels, feature_channels * 4, kernel_size=3, padding=1),
            nn.PixelShuffle(2),
            nn.PReLU()
        )
        
        # Texture Enhancement and RGB Translation
        self.texture_enhancement = nn.Sequential(
            nn.Conv2d(feature_channels, feature_channels // 2, kernel_size=3, padding=1),
            nn.PReLU(),
            nn.Conv2d(feature_channels // 2, 3, kernel_size=3, padding=1),
            nn.Sigmoid()  # Constrains output RGB colors to [0, 1] range
        )

    def forward(self, x):
        x = self.body(x)
        x = self.upsample(x)
        rgb_output = self.texture_enhancement(x)
        return rgb_output


class DualOutputModel(nn.Module):
    """
    Complete end-to-end architecture combining Shared Encoder with dual specialized heads.
    Optimized for single forward-pass inference per tile.
    """
    def __init__(self, feature_channels=64):
        super(DualOutputModel, self).__init__()
        self.encoder = SharedEncoder(in_channels=1, feature_channels=feature_channels, num_res_blocks=4)
        self.sr_branch = SuperResolutionBranch(feature_channels=feature_channels, num_res_blocks=2)
        self.color_branch = ColorizationBranch(feature_channels=feature_channels, num_res_blocks=2)

    def forward(self, lr_thermal):
        # Extract rich shared representations
        shared_features = self.encoder(lr_thermal)
        
        # Simultaneous branch processing
        sr_thermal = self.sr_branch(shared_features)
        color_rgb = self.color_branch(shared_features)
        
        return sr_thermal, color_rgb

if __name__ == "__main__":
    # Test script to verify forward pass and tensor dimensions
    print("Initializing DualOutputModel...")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Executing on device: {device}")
    
    model = DualOutputModel(feature_channels=64).to(device)
    
    # Create dummy low-res thermal input: Batch=2, Channels=1, Height=256, Width=256
    dummy_input = torch.randn(2, 1, 256, 256).to(device)
    
    print(f"\nInput Low-Res Thermal Shape: {dummy_input.shape}")
    
    # Forward pass
    model.eval()
    with torch.no_grad():
        sr_out, rgb_out = model(dummy_input)
        
    print(f"Output Super-Resolved Thermal Shape (100m): {sr_out.shape}")
    print(f"Output Colorized RGB Shape (100m): {rgb_out.shape}")
    
    # Check VRAM footprint on RTX 4070
    if device.type == "cuda":
        mem_allocated_mb = torch.cuda.memory_allocated(device) / (1024 * 1024)
        print(f"\nGPU VRAM Allocated for Forward Pass: {mem_allocated_mb:.2f} MB")