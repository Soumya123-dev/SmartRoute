import axios from 'axios';

// Changed from localhost to 127.0.0.1 to avoid Windows IPv6 resolution issues 
// which causes Network Errors with Uvicorn.
const API_URL = 'http://127.0.0.1:8000';

export const optimizeRoute = async (stops) => {
  try {
    const response = await axios.post(`${API_URL}/routes/optimize`, { stops });
    return response.data;
  } catch (error) {
    console.error("Error optimizing route:", error);
    throw error;
  }
};
