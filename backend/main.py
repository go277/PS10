import os
import sys
import time
import io
import base64
from PIL import Image
import numpy as np
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import uvicorn
import warnings

# Suppress warnings from the AI models for cleaner terminal logs
warnings.filterwarnings("ignore")

# --- ROBUST IMPORT FIX ---
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

from ml_pipeline.inference import InferenceEngine
from utils import analyze_terrain
from database import SessionLocal, AnalysisLog, engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ISRO Hackathon 2026 API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize the 12.5-hour Master Brain ONCE at startup
try:
    engine_ai = InferenceEngine()
    print("✅ AI Engine Ready")
except Exception as e:
    engine_ai = None
    print(f"❌ AI Engine Error: {e}")

def encode_image_base64(img_array):
    try:
        img_array = np.squeeze(img_array)
        # Denormalize based on the array range
        if img_array.max() <= 1.0 and img_array.min() < 0:
            img_array = ((img_array + 1.0) / 2.0 * 255).astype(np.uint8)
        elif img_array.max() <= 1.0:
            img_array = (img_array * 255).astype(np.uint8)
        else:
            img_array = img_array.astype(np.uint8)

        # Transpose if channels are first
        if len(img_array.shape) == 3 and img_array.shape[0] == 3:
            img_array = img_array.transpose(1, 2, 0)

        img = Image.fromarray(img_array)
        buffered = io.BytesIO()
        img.save(buffered, format="PNG")
        return "data:image/png;base64," + base64.b64encode(buffered.getvalue()).decode("utf-8")
    except:
        return ""

@app.get("/api/v1/history")
async def get_history(limit: int = 15, db: Session = Depends(get_db)):
    try:
        logs = db.query(AnalysisLog).order_by(AnalysisLog.id.desc()).limit(limit).all()
        
        formatted_rows = []
        for log in logs:
            veg = getattr(log, 'vegetation_pct', getattr(log, 'vegetation_percent', 0.0))
            water = getattr(log, 'water_pct', getattr(log, 'water_percent', 0.0))
            bldgs = getattr(log, 'total_buildings', 0.0)
            roads = getattr(log, 'road_length_km', 0.0)
            ptime = getattr(log, 'processing_time', getattr(log, 'processing_time_sec', "-"))
            
            formatted_rows.append({
                "id": log.id,
                "filename": getattr(log, 'filename', 'Unknown'),
                "status": getattr(log, 'status', 'Failed'),
                "vegetation_percent": veg,
                "water_percent": water,
                "total_buildings": bldgs,
                "road_length_km": roads,
                "processing_time_sec": str(ptime).replace("s", "") if ptime else "-",
                # THE TIMEZONE FIX: We add "Z" so React knows this is UTC and converts it to Indian Standard Time!
                "timestamp": (log.timestamp.isoformat() + "Z") if getattr(log, 'timestamp', None) else None
            })
        
        return JSONResponse(status_code=200, content={"history": formatted_rows})
        
    except Exception as e:
        print(f"CRITICAL DB ERROR: {str(e)}")
        return JSONResponse(status_code=200, content={"history": []})

@app.post("/api/v1/process-tile")
async def process_tile(
    file: UploadFile = File(...),
    resolution: str = Form("70m"),
    coordinates: str = Form(None),
    db: Session = Depends(get_db)
):
    if engine_ai is None:
        return JSONResponse(status_code=500, content={"error": "AI Engine not initialized"})

    start_time = time.time()

    try:
        file_path = f"temp_{file.filename}"
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        data = np.load(file_path)
        os.remove(file_path)

        # Ensure we only pass the 1-channel thermal data
        if data.shape[0] > 1:
            data = data[0:1, :, :]

        # 1. THE ARTIST: Generate Photorealistic Geography
        thermal_in, rgb_out = engine_ai.predict(data)
        
        # Squeeze arrays to ensure clean dimensions
        rgb_numpy = rgb_out.squeeze()
        thermal_numpy = thermal_in.squeeze()

        # 2. THE ANALYST: Perform AI Terrain Segmentation
        analysis = analyze_terrain(rgb_numpy)
        
        process_time_val = round(time.time() - start_time, 2)
        process_time_str = f"{process_time_val}s"

        thermal_b64 = encode_image_base64(thermal_numpy)
        rgb_b64 = encode_image_base64(rgb_numpy)

        # 3. Save to Database
        db_log = AnalysisLog(filename=file.filename, status="Success")
        
        if hasattr(db_log, 'vegetation_pct'): db_log.vegetation_pct = analysis["vegetation"]
        elif hasattr(db_log, 'vegetation_percent'): db_log.vegetation_percent = analysis["vegetation"]
        
        if hasattr(db_log, 'water_pct'): db_log.water_pct = analysis["water"]
        elif hasattr(db_log, 'water_percent'): db_log.water_percent = analysis["water"]
            
        if hasattr(db_log, 'total_buildings'): db_log.total_buildings = analysis["buildings"]
        if hasattr(db_log, 'road_length_km'): db_log.road_length_km = analysis["roads_other"]
        
        if hasattr(db_log, 'processing_time'): db_log.processing_time = process_time_val
        elif hasattr(db_log, 'processing_time_sec'): db_log.processing_time_sec = process_time_val

        db.add(db_log)
        db.commit()
        db.refresh(db_log)

        # 4. Return to Frontend
        return JSONResponse(
            status_code=200,
            content={
                "message": "Processing complete",
                "log_id": db_log.id,
                "processing_time": process_time_str,
                "filename": file.filename,
                "location": coordinates or "Coordinates mapped",
                "analytics": {
                    "vegetation_pct": analysis["vegetation"],
                    "water_pct": analysis["water"],
                    "total_buildings": analysis["buildings"],
                    "road_length_km": analysis["roads_other"]
                },
                "images": {
                    "original_thermal": thermal_b64,
                    "enhanced_thermal": thermal_b64, 
                    "colorized_rgb": rgb_b64,
                    "segmentation_map": rgb_b64 
                }
            }
        )

    except Exception as e:
        try:
            db_log = AnalysisLog(filename=file.filename, status="Failed")
            if hasattr(db_log, 'error_message'):
                db_log.error_message = str(e)
            db.add(db_log)
            db.commit()
        except Exception as db_e:
            print(f"Failed to log error: {db_e}")

        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)