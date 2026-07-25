import os
import glob
import random
import time
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import numpy as np
from torchvision.models import vgg19, VGG19_Weights

# Import YOUR actual brains
from gan import GeneratorUNet, Discriminator

# ==========================================
# 1. THE VGG-19 PERCEPTUAL JUDGE
# ==========================================
class VGGPerceptualLoss(nn.Module):
    def __init__(self):
        super(VGGPerceptualLoss, self).__init__()
        
        # Load the pre-trained VGG19 network
        vgg = vgg19(weights=VGG19_Weights.IMAGENET1K_V1).features
        
        # Slice the network into 4 blocks to capture micro and macro textures
        self.slice1 = nn.Sequential(*list(vgg.children())[:4])   # Fine edges
        self.slice2 = nn.Sequential(*list(vgg.children())[4:9])  # Textures
        self.slice3 = nn.Sequential(*list(vgg.children())[9:18]) # Object parts
        self.slice4 = nn.Sequential(*list(vgg.children())[18:27])# Large structures
        
        # CRITICAL: Freeze the weights! We are using this as a judge, not training it.
        for param in self.parameters():
            param.requires_grad = False

        # VGG-19 expects images to be normalized to specific ImageNet statistics
        self.register_buffer("mean", torch.tensor([0.485, 0.456, 0.406]).view(1, 3, 1, 1))
        self.register_buffer("std", torch.tensor([0.229, 0.224, 0.225]).view(1, 3, 1, 1))

    def forward(self, fake_img, real_img):
        # Normalize the images for the VGG brain
        fake_img = (fake_img - self.mean) / self.std
        real_img = (real_img - self.mean) / self.std

        # Extract features for the AI generated map
        fake_f1 = self.slice1(fake_img)
        fake_f2 = self.slice2(fake_f1)
        fake_f3 = self.slice3(fake_f2)
        fake_f4 = self.slice4(fake_f3)

        # Extract features for the real satellite map
        real_f1 = self.slice1(real_img)
        real_f2 = self.slice2(real_f1)
        real_f3 = self.slice3(real_f2)
        real_f4 = self.slice4(real_f3)

        # Calculate the difference (L1 Loss) between the structural features
        criterion = nn.L1Loss()
        loss = (criterion(fake_f1, real_f1) +
                criterion(fake_f2, real_f2) +
                criterion(fake_f3, real_f3) +
                criterion(fake_f4, real_f4))
        
        return loss

# ==========================================
# 2. THE DATA LOADER (FIXED SCALING)
# ==========================================
class SatelliteDataset(Dataset):
    def __init__(self, data_dir):
        self.files = glob.glob(os.path.join(data_dir, "*.npy"))
        
    def __len__(self):
        return len(self.files)

    def _augment(self, patch):
        if random.random() > 0.5: patch = np.flip(patch, axis=2)
        if random.random() > 0.5: patch = np.flip(patch, axis=1)
        k = random.randint(0, 3)
        patch = np.rot90(patch, k=k, axes=(1, 2))
        return patch.copy()
        
    def __getitem__(self, idx):
        data = np.load(self.files[idx])
        data = self._augment(data)
        
        # Split 4 channels into 1 (Thermal) and 3 (RGB)
        thermal = torch.tensor(data[0:1, :, :], dtype=torch.float32)
        real_rgb = torch.tensor(data[1:4, :, :], dtype=torch.float32) 
        
        # FIX 1: GLOBAL FIXED SCALING FOR THERMAL
        # Using true dataset bounds: Min 243.20K, Max 337.79K
        thermal = (thermal - 243.20) / (337.79 - 243.20)
        thermal = torch.clamp(thermal, 0.0, 1.0)
            
        # FIX 2: GLOBAL FIXED SCALING FOR RGB
        # Using true dataset max reflectance: 1.3016
        real_rgb = real_rgb / 1.3016
        real_rgb = torch.clamp(real_rgb, 0.0, 1.0)
        
        # Scale both to [-1.0, 1.0] for the GAN's Tanh layers
        thermal = (thermal * 2.0) - 1.0
        real_rgb = (real_rgb * 2.0) - 1.0
        
        return thermal, real_rgb

# ==========================================
# 3. THE MASTER TRAINING LOOP
# ==========================================
def main():
    print("=" * 60)
    print("🧠 INITIATING VGG-ENHANCED GAN TRAINING PROTOCOL")
    print("=" * 60)

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"⚙️ Compute Device: {device.type.upper()}")

    data_dir = r"D:\PROJECTS\PS10\ml_pipeline\data\production_dataset"
    dataset = SatelliteDataset(data_dir)
    
    # num_workers=0 to prevent Windows crashing!
    dataloader = DataLoader(dataset, batch_size=8, shuffle=True, num_workers=0, pin_memory=True)
    print(f"📚 Loaded {len(dataset)} perfectly sliced AI tiles.")

    # Load your REAL models
    generator = GeneratorUNet().to(device)
    discriminator = Discriminator().to(device)

    # Initialize Losses
    criterion_GAN = nn.MSELoss()
    criterion_L1 = nn.L1Loss()
    criterion_VGG = VGGPerceptualLoss().to(device) # The New Judge!

    # Balance the weights
    lambda_pixel = 10.0  # Lowered so it doesn't obsess over exact colors
    lambda_vgg = 10.0    # Forces it to learn true geography and textures

    optimizer_G = optim.Adam(generator.parameters(), lr=0.0002, betas=(0.5, 0.999))
    optimizer_D = optim.Adam(discriminator.parameters(), lr=0.0002, betas=(0.5, 0.999))

    epochs = 200
    
    # Ensure weights directory exists so inference.py can find it later
    weights_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "weights")
    os.makedirs(weights_dir, exist_ok=True)
    best_model_path = os.path.join(weights_dir, "best_isro_model.pth")

    start_time = time.time()
    best_loss = float('inf')

    for epoch in range(1, epochs + 1):
        generator.train()
        discriminator.train()
        
        epoch_loss_G = 0.0
        
        for i, (thermal, real_rgb) in enumerate(dataloader):
            thermal, real_rgb = thermal.to(device), real_rgb.to(device)
            
            # LABEL SMOOTHING: 0.9 for real, 0.1 for fake
            valid = (torch.ones((thermal.size(0), 1, 16, 16), requires_grad=False) * 0.9).to(device)
            fake = (torch.zeros((thermal.size(0), 1, 16, 16), requires_grad=False) + 0.1).to(device)
            
            # --- Train Generator ---
            optimizer_G.zero_grad()
            fake_rgb = generator(thermal)
            
            # 1. GAN Loss
            pred_fake = discriminator(thermal, fake_rgb)
            loss_GAN = criterion_GAN(pred_fake, valid)
            
            # 2. Pixel Loss
            loss_pixel = criterion_L1(fake_rgb, real_rgb) * lambda_pixel
            
            # 3. VGG Perceptual Loss (The Brain Fusion)
            loss_perceptual = criterion_VGG(fake_rgb, real_rgb) * lambda_vgg
            
            # Ultimate Master Loss
            loss_G = loss_GAN + loss_pixel + loss_perceptual
            
            loss_G.backward()
            optimizer_G.step()
            
            epoch_loss_G += loss_G.item()

            # --- Train Discriminator ---
            optimizer_D.zero_grad()
            pred_real = discriminator(thermal, real_rgb)
            loss_real = criterion_GAN(pred_real, valid)
            
            pred_fake_d = discriminator(thermal, fake_rgb.detach())
            loss_fake = criterion_GAN(pred_fake_d, fake)
            
            loss_D = 0.5 * (loss_real + loss_fake)
            loss_D.backward()
            optimizer_D.step()

        # Calculate average generator loss for the epoch
        avg_loss_G = epoch_loss_G / len(dataloader)
        print(f"--- Epoch [{epoch}/{epochs}] ---")
        print(f"📊 Generator Loss: {avg_loss_G:.4f} | Discriminator Loss: {loss_D.item():.4f}")
        
        # Save the absolute best generator model for inference
        if avg_loss_G < best_loss:
            best_loss = avg_loss_G
            torch.save(generator.state_dict(), best_model_path)
            print(f"💾 AI leveled up! Saved new master weights to weights/best_isro_model.pth")

    total_time = (time.time() - start_time) / 60
    print("=" * 60)
    print(f"🎉 VGG-ENHANCED GAN TRAINING COMPLETE in {total_time:.2f} minutes!")
    print("=" * 60)

if __name__ == "__main__":
    main()