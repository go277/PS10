from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import uvicorn
import sys
import os
import time
import torch

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml_pipeline.inference import InferenceEngine
from utils import (
    parse_satellite_upload, 
    tensor_to_base64, 
    analyze_land_cover, 
    detect_infrastructure, 
    extract_geolocation, 
    generate_segmentation_mask
)
from database import SessionLocal, AnalysisLog, engine, Base

app = FastAPI(
    title="ISRO Hackathon 2026 API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
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

ai_engine = InferenceEngine() 

@app.post("/api/v1/process-tile")
async def process_tile(file: UploadFile = File(...), db: Session = Depends(get_db)):
    
    # 1. Python-side file format validation
    if not file.filename.lower().endswith(('.npy', '.tif', '.tiff')):
        raise HTTPException(status_code=400, detail="Only .npy and .tif files are supported.")
        
    start_time = time.time()
    db_log = AnalysisLog(filename=file.filename, status="Processing")
    db.add(db_log)
    db.commit()
    db.refresh(db_log)

    try:
        file_bytes = await file.read()
        
        # 2. Extract Geolocation before processing!
        geo_data = extract_geolocation(file_bytes, file.filename)
        
        # 3. Direct memory processing for both .npy and raw GeoTIFF tiles
        input_array = parse_satellite_upload(file_bytes, file.filename)
        
        # 4. AI Pipeline 
        sr_thermal, color_rgb = ai_engine.predict(input_array)
        
        # ---> NEW: Generate the 3rd Image (Segmentation Mask)
        seg_mask_tensor = generate_segmentation_mask(color_rgb)
        
        # 5. Run Analytics & YOLOv8 Object Detection
        veg_pct, water_pct = analyze_land_cover(color_rgb)
        buildings, road_km = detect_infrastructure(color_rgb)
        
        # 6. Convert Tensors to Base64 Strings for the UI
        sr_base64 = tensor_to_base64(sr_thermal, is_color=False)
        rgb_base64 = tensor_to_base64(color_rgb, is_color=True)
        input_base64 = tensor_to_base64(sr_thermal, is_color=False) # Smart-cropped version
        
        # ---> NEW: Convert the mask
        seg_base64 = tensor_to_base64(seg_mask_tensor, is_color=True)
        
        process_time = round(time.time() - start_time, 3)
        
        # 7. Save final metrics to Database
        db_log.status = "Success"
        db_log.processing_time_sec = process_time
        db_log.vegetation_percent = veg_pct
        db_log.water_percent = water_pct
        db_log.total_buildings = buildings
        db_log.road_length_km = road_km
        db.commit()
        
        # 8. Ship to Frontend!
        return JSONResponse(
            status_code=200,
            content={
                "message": "Processing complete",
                "log_id": db_log.id,
                "processing_time": f"{process_time}s",
                "filename": file.filename,
                "location": geo_data, 
                "analytics": {
                    "vegetation_pct": veg_pct,
                    "water_pct": water_pct,
                    "total_buildings": buildings,
                    "road_length_km": road_km
                },
                "images": {
                    "original_thermal": input_base64,
                    "enhanced_thermal": sr_base64,
                    "colorized_rgb": rgb_base64,
                    "segmentation_map": seg_base64  # <--- NEW!
                }
            }
        )
    except Exception as e:
        db_log.status = "Failed"
        db_log.error_message = str(e)
        db.commit()
        print(f"Error processing tile: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/api/v1/history")
async def get_history(limit: int = 10, db: Session = Depends(get_db)):
    logs = db.query(AnalysisLog).order_by(AnalysisLog.timestamp.desc()).limit(limit).all()
    return {"history": logs}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)