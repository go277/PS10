import os
import glob
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader

# Import our new architecture from the file you just created!
from gan import GeneratorUNet, Discriminator 

# ==========================================
# 1. THE DATA LOADER
# ==========================================
class SatelliteDataset(Dataset):
    """Loads the 4-channel tensors we generated in Phase 1"""
    def __init__(self, data_dir):
        self.files = glob.glob(os.path.join(data_dir, "*.npy"))
        
    def __len__(self):
        return len(self.files)
        
    def __getitem__(self, idx):
        data = np.load(self.files[idx])
        # Channel 0 is Thermal (Input)
        thermal = torch.tensor(data[0:1, :, :], dtype=torch.float32)
        # Channels 1, 2, 3 are RGB (Target)
        real_rgb = torch.tensor(data[1:4, :, :], dtype=torch.float32) 
        return thermal, real_rgb

# ==========================================
# 2. THE GAN TRAINING LOOP
# ==========================================
def train_gan(data_dir="data/production_dataset", epochs=200, batch_size=4):
    # Connect to your RTX 4070
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"🚀 Initializing GAN Training on {device}...")

    # Initialize both AIs
    generator = GeneratorUNet().to(device)
    discriminator = Discriminator().to(device)

    # Loss Functions: How the AI learns from its mistakes
    criterion_GAN = nn.MSELoss() # PatchGAN uses Mean Squared Error
    criterion_pixelwise = nn.L1Loss() # Forces sharp, exact colors
    
    # Optimizers: The math that updates the weights
    optimizer_G = optim.Adam(generator.parameters(), lr=0.0002, betas=(0.5, 0.999))
    optimizer_D = optim.Adam(discriminator.parameters(), lr=0.0002, betas=(0.5, 0.999))

    # Load the data
    dataloader = DataLoader(SatelliteDataset(data_dir), batch_size=batch_size, shuffle=True)

    for epoch in range(epochs):
        for i, (thermal, real_rgb) in enumerate(dataloader):
            thermal = thermal.to(device)
            real_rgb = real_rgb.to(device)

            # ---------------------
            # Train the Generator
            # ---------------------
            optimizer_G.zero_grad()
            
            # The Generator tries to paint the thermal image
            fake_rgb = generator(thermal)
            
            # The Discriminator judges the painting
            pred_fake = discriminator(thermal, fake_rgb)
            valid = torch.ones_like(pred_fake, requires_grad=False).to(device)
            
            # Calculate Generator Loss (It wants the discriminator to guess 'valid')
            loss_GAN = criterion_GAN(pred_fake, valid)
            loss_pixel = criterion_pixelwise(fake_rgb, real_rgb)
            
            # Total Generator Loss (100x weight on pixel exactness to prevent hallucinations)
            loss_G = loss_GAN + (100 * loss_pixel) 
            loss_G.backward()
            optimizer_G.step()

            # ---------------------
            # Train the Discriminator
            # ---------------------
            optimizer_D.zero_grad()
            
            # Loss for real ISRO images
            pred_real = discriminator(thermal, real_rgb)
            loss_real = criterion_GAN(pred_real, valid)
            
            # Loss for fake AI images
            fake = torch.zeros_like(pred_fake, requires_grad=False).to(device)
            pred_fake_d = discriminator(thermal, fake_rgb.detach())
            loss_fake = criterion_GAN(pred_fake_d, fake)
            
            # Total Discriminator Loss
            loss_D = 0.5 * (loss_real + loss_fake)
            loss_D.backward()
            optimizer_D.step()

        print(f"Epoch [{epoch+1}/{epochs}] | Loss D: {loss_D.item():.4f} | Loss G: {loss_G.item():.4f}")

    # Save the highly-trained Artist (We don't need the Critic anymore)
    os.makedirs("weights", exist_ok=True)
    torch.save(generator.state_dict(), "weights/generator_final.pth")
    print("✅ GAN Training Complete! Ready for FastAPI deployment.")

if __name__ == "__main__":
    train_gan()