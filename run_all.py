import os
import sys
import subprocess
import time

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
VENV_PYTHON = os.path.join(CURRENT_DIR, ".venv", "Scripts", "python.exe")

PIPELINE_SCRIPTS = ["fetch_gee_data.py", "slice_data.py"]

REGION_COORDINATES = [
    "74.50,34.00,74.80,34.30", # 01. Kashmir
    "77.10,31.50,77.40,31.80", # 02. Himachal
    "78.00,30.00,78.30,30.30", # 03. Uttarakhand
    "75.50,31.00,75.80,31.30", # 04. Punjab
    "76.50,29.00,76.80,29.30", # 05. Haryana
    "76.90,28.40,77.20,28.70", # 06. Delhi
    "71.00,27.00,71.30,27.30", # 07. Thar Desert
    "74.00,25.00,74.30,25.30", # 08. Aravalli
    "69.50,23.50,69.80,23.80", # 09. Rann of Kutch
    "70.50,21.00,70.80,21.30", # 10. Gir
    "75.50,22.50,75.80,22.80", # 11. Malwa
    "78.50,23.50,78.80,23.80", # 12. Vindhya
    "80.50,26.50,80.80,26.80", # 13. Ganga Plains
    "82.50,25.50,82.80,25.80", # 14. Eastern UP
    "85.00,25.50,85.30,25.80", # 15. Bihar
    "84.50,23.50,84.80,23.80", # 16. Jharkhand
    "88.50,21.50,88.80,21.80", # 17. Sundarbans
    "88.20,27.00,88.50,27.30", # 18. Darjeeling
    "92.50,26.20,92.80,26.50", # 19. Brahmaputra
    "91.50,25.30,91.80,25.60", # 20. Meghalaya
    "94.00,28.00,94.30,28.30", # 21. Arunachal
    "86.00,20.00,86.30,20.30", # 22. Odisha
    "82.50,17.50,82.80,17.80", # 23. Eastern Ghats
    "80.80,15.80,81.10,16.10", # 24. Krishna Basin
    "79.00,17.50,79.30,17.80", # 25. Telangana
    "76.00,19.00,76.30,19.30", # 26. Marathwada
    "73.50,18.00,73.80,18.30", # 27. Western Ghats
    "74.00,15.20,74.30,15.50", # 28. Goa
    "75.00,13.50,75.30,13.80", # 29. Karnataka
    "77.00,13.00,77.30,13.30", # 30. Bangalore
    "76.50,11.20,76.80,11.50", # 31. Nilgiri
    "79.50,10.50,79.80,10.80", # 32. Cauvery
    "76.20,09.50,76.50,09.80", # 33. Kerala
    "92.70,11.80,93.00,12.10"  # 34. Andaman Islands
]
TOTAL_REGIONS = len(REGION_COORDINATES)

def run_script(script_name, env_vars):
    script_path = os.path.join(CURRENT_DIR, script_name)
    env = os.environ.copy()
    env.update(env_vars)
    env["PYTHONIOENCODING"] = "utf-8"
    
    current_time = time.strftime('%H:%M:%S')
    print(f"[{current_time}] 🚀 Executing: {script_name} with Region {env_vars['REGION_INDEX']}")
    
    result = subprocess.run(
        [VENV_PYTHON, script_path],
        env=env,
        capture_output=True,
        text=True,
        encoding='utf-8'
    )
    
    if result.returncode != 0:
        print(f"❌ ERROR: {script_name} failed!")
        print(result.stderr)
        return False
        
    if result.stdout.strip():
        print(result.stdout.strip())
        
    return True

def main():
    print("=" * 60)
    print("🌃 NIGHT-SHIFT PIPELINE ENGAGED: TARGETING 3000+ TILES")
    print("=" * 60)

    if not os.path.exists(VENV_PYTHON):
        print(f"❌ FATAL ERROR: Virtual environment Python not found.")
        sys.exit(1)

    total_successful_regions = 0

    for i in range(TOTAL_REGIONS):
        print(f"\n" + "-" * 50)
        print(f"--- Processing Region {i + 1}/{TOTAL_REGIONS} ---")
        
        region_coords = REGION_COORDINATES[i]
        env_vars = {
            "REGION_INDEX": str(i),
            "REGION_COORDS": region_coords
        }
        
        region_success = True
        for script in PIPELINE_SCRIPTS:
            success = run_script(script, env_vars)
            if not success:
                # --- NIGHT SHIFT RESILIENCE ---
                # Instead of sys.exit(1), we just break the inner loop 
                # so the outer loop moves to the next region safely!
                print(f"⚠️ WARNING: Region {i} crashed. Skipping to the next region to keep factory running.")
                region_success = False
                break 
        
        if region_success:
            total_successful_regions += 1
            
    print("\n" + "=" * 60)
    print(f"🎉 NIGHT-SHIFT COMPLETE! Successfully processed {total_successful_regions}/{TOTAL_REGIONS} regions.")
    print("=" * 60)

if __name__ == "__main__":
    main()