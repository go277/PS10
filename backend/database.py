from sqlalchemy import create_engine, Column, Integer, String, DateTime, Float
from sqlalchemy.orm import declarative_base, sessionmaker
import datetime

SQLALCHEMY_DATABASE_URL = "sqlite:///./isro_pipeline.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class AnalysisLog(Base):
    __tablename__ = "analysis_logs"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    status = Column(String, default="Processing")
    processing_time_sec = Column(Float, nullable=True)
    
    # Phase 9 Analytics Columns
    water_percent = Column(Float, nullable=True)
    vegetation_percent = Column(Float, nullable=True)
    total_buildings = Column(Integer, nullable=True)
    road_length_km = Column(Float, nullable=True)
    
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    model_version = Column(String, default="DualOutput-v1.0")
    error_message = Column(String, nullable=True)

Base.metadata.create_all(bind=engine)