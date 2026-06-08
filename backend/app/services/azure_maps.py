import random
import asyncio

class MockAzureMapsService:
    """
    Mock service to simulate Azure Maps geocoding and routing 
    so the project runs without requiring a real API key.
    """
    
    async def geocode_address(self, address: str):
        # Simulate network latency
        await asyncio.sleep(0.1)
        
        # Indian Coordinates Base (Mumbai)
        base_lat = 19.0760
        base_lon = 72.8777
        
        # Spread points across a larger radius (approx 10-20km spread)
        lat = base_lat + random.uniform(-0.15, 0.15)
        lon = base_lon + random.uniform(-0.15, 0.15)
        
        return {"lat": lat, "lon": lon}
        
    async def get_route_matrix(self, coordinates: list):
        # Return a distance matrix
        await asyncio.sleep(0.5)
        n = len(coordinates)
        matrix = []
        for i in range(n):
            row = []
            for j in range(n):
                if i == j:
                    row.append({"distance": 0, "time": 0})
                else:
                    # Mock distance based on euclidean distance * factor
                    p1 = coordinates[i]
                    p2 = coordinates[j]
                    dist_km = ((p1["lat"]-p2["lat"])**2 + (p1["lon"]-p2["lon"])**2)**0.5 * 111 # rough approx
                    
                    # Mumbai Traffic Simulation (Slower speeds)
                    # Assume 20km/h avg speed due to heavy traffic
                    time_min = (dist_km / 20) * 60 
                    row.append({"distance": dist_km, "time": time_min})
            matrix.append(row)
        return matrix

azure_maps_client = MockAzureMapsService()
