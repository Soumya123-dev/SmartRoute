from pydantic import BaseModel
from typing import List, Optional, Any

class StopBase(BaseModel):
    address: str

class StopCreate(StopBase):
    pass

class StopResponse(StopBase):
    id: int
    original_index: int
    lat: Optional[float]
    lon: Optional[float]

    class Config:
        from_attributes = True

class RouteRequest(BaseModel):
    stops: List[str]

class RouteResponse(BaseModel):
    id: int
    status: str
    total_distance_km: Optional[float]
    total_time_min: Optional[float]
    optimized_order: Optional[List[int]]
    stops: List[StopResponse]

    class Config:
        from_attributes = True
