from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import asyncio

from . import models, schemas, database
from .services.azure_maps import azure_maps_client
from .services.optimizer import optimize_route

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="SmartRoute API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/routes/optimize", response_model=schemas.RouteResponse)
async def create_optimized_route(request: schemas.RouteRequest, db: Session = Depends(database.get_db)):
    if not request.stops or len(request.stops) < 2:
        raise HTTPException(status_code=400, detail="At least 2 stops are required")

    try:
        # 1. Create RouteOptimization record
        db_route = models.RouteOptimization(status="processing")
        db.add(db_route)
        db.commit()
        db.refresh(db_route)

        # 2. Geocode addresses CONCURRENTLY for vastly improved performance!
        geocode_tasks = [azure_maps_client.geocode_address(addr) for addr in request.stops]
        coords_results = await asyncio.gather(*geocode_tasks)

        stops_data = []
        for i, (address, coords) in enumerate(zip(request.stops, coords_results)):
            db_stop = models.Stop(
                route_id=db_route.id,
                original_index=i,
                address=address,
                lat=coords["lat"],
                lon=coords["lon"]
            )
            db.add(db_stop)
            stops_data.append(coords)
        
        db.commit()

        # 3. Get Route Matrix
        matrix = await azure_maps_client.get_route_matrix(stops_data)

        # 4. Optimize Route
        optimized_order, total_dist, total_time = optimize_route(matrix)

        # 5. Update Database
        db_route.status = "completed"
        db_route.optimized_order = optimized_order
        db_route.total_distance_km = total_dist
        db_route.total_time_min = total_time
        
        db.commit()
        db.refresh(db_route)

        return db_route

    except Exception as e:
        print(f"Error optimizing route: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Internal server error during optimization.")

@app.get("/routes/{route_id}", response_model=schemas.RouteResponse)
def get_route(route_id: int, db: Session = Depends(database.get_db)):
    db_route = db.query(models.RouteOptimization).filter(models.RouteOptimization.id == route_id).first()
    if db_route is None:
        raise HTTPException(status_code=404, detail="Route not found")
    return db_route
