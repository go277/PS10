import os
import numpy as np
from PIL import Image, ImageFilter

def create_training_data(input_dir="raw_maps", output_dir="data"):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    image_files = [f for f in os.listdir(input_dir) if f.endswith(('.png', '.jpg', '.jpeg'))]
    
    if not image_files:
        print(f"⚠️ No images found! Please place some aerial .jpg images inside the '{input_dir}' folder.")
        return

    print(f"Found {len(image_files)} real images. Generating satellite tensor data...")

    for i, filename in enumerate(image_files):
        img_path = os.path.join(input_dir, filename)
        
        # 1. Load Real Image and force to 256x256
        img = Image.open(img_path).convert('RGB')
        img = img.resize((256, 256))
        
        # 2. TARGET RGB: Convert to (Channel, Height, Width) tensor format (0.0 to 1.0)
        rgb_array = np.array(img).transpose(2, 0, 1).astype(np.float32) / 255.0
        
        # 3. SIMULATED THERMAL INPUT: Grayscale -> Blur -> Sensor Noise
        # This forces the AI to learn how to sharpen and colorize!
        thermal_img = img.convert('L').filter(ImageFilter.GaussianBlur(radius=2.5))
        thermal_array = np.array(thermal_img).astype(np.float32) / 255.0
        
        # Add synthetic satellite noise
        noise = np.random.normal(0, 0.03, thermal_array.shape)
        thermal_array = np.clip(thermal_array + noise, 0, 1.0)
        
        # Save training pairs for train.py
        np.save(os.path.join(output_dir, f"train_target_rgb_{i:04d}.npy"), rgb_array)
        np.save(os.path.join(output_dir, f"train_input_thermal_{i:04d}.npy"), thermal_array)
        
        # Save a clean Input file specifically for you to drag-and-drop into the React UI!
        np.save(os.path.join(output_dir, f"ui_test_tile_{i:04d}.npy"), thermal_array)

        print(f"✅ Processed {filename} -> ui_test_tile_{i:04d}.npy")
        
    print("\nDataset generation complete! You can now run train.py to train your model.")

if __name__ == "__main__":
    if not os.path.exists("raw_maps"):
        os.makedirs("raw_maps")
        print("Created 'raw_maps' folder.")
        print("ACTION REQUIRED: Go to Google Maps (Satellite View), take 3-5 screenshots of cities/rivers, save them as .jpg in the 'raw_maps' folder, and run this script again!")
    else:
        create_training_data()