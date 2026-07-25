import subprocess
import sys
import time

def run_step(script_path, description):
    print("============================================================")
    print(f"🚀 INITIATING: {description}")
    print(f"📁 Script: {script_path}")
    print("============================================================")
    
    try:
        # sys.executable ensures it uses your exact .venv_ai python
        subprocess.run([sys.executable, script_path], check=True)
        print(f"\n✅ SUCCESS: {description} completed.\n")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ CRITICAL ERROR in {script_path}.")
        print("Pipeline halted safely so you don't train on broken data.")
        sys.exit(1)

if __name__ == "__main__":
    print("🌍 ORBITAL AI PIPELINE ENGAGED")
    start_time = time.time()

    # NOTE: Update these paths to match the exact names of your scripts
    pipeline_steps = [
        {"path": "ml_pipeline/download_data.py", "desc": "Phase 1: Downloading Raw Satellite Data"},
        {"path": "ml_pipeline/prepare_data.py", "desc": "Phase 2: Slicing and Normalizing Tiles"},
        {"path": "ml_pipeline/train.py", "desc": "Phase 3: Deep Learning GAN Training"}
    ]

    for step in pipeline_steps:
        run_step(step["path"], step["desc"])

    elapsed_hours = (time.time() - start_time) / 3600
    print("============================================================")
    print(f"🎉 MASTER PIPELINE COMPLETE in {elapsed_hours:.2f} hours!")
    print("💾 Your diabolically enhanced weights are ready for inference.")
    print("============================================================")