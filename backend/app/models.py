from sqlalchemy import Column, Integer, String, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class RouteOptimization(Base):
    __tablename__ = "route_optimizations"

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, default="pending")
    optimized_order = Column(JSON, nullable=True)
    total_distance_km = Column(Float, nullable=True)
    total_time_min = Column(Float, nullable=True)
    
    stops = relationship("Stop", back_populates="route")

class Stop(Base):
    __tablename__ = "stops"

    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey("route_optimizations.id"))
    original_index = Column(Integer)
    address = Column(String)
    lat = Column(Float, nullable=True)
    lon = Column(Float, nullable=True)
    
    route = relationship("RouteOptimization", back_populates="stops")
