import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export const processTile = async (data) => {
  let formData = data;

  // SAFETY CHECK: If your UI is still just passing a raw File object, 
  // this will automatically wrap it in a FormData package and add the 
  // missing default parameters so FastAPI doesn't crash.
  if (data instanceof File) {
    formData = new FormData();
    formData.append('file', data);
    formData.append('resolution', '7.5m (4x super resolution)');
    formData.append('output_type', 'Colorized RGB + segmentation');
    formData.append('model_version', 'ThermalGAN v3.2');
    formData.append('confidence_threshold', 75.0);
  }

  try {
    const response = await axios.post(`${API_URL}/process-tile`, formData);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    
    let errorMessage = "Failed to process image on the server.";
    
    // Catch custom Python errors from main.py
    if (error.response?.data?.error) {
      errorMessage = `Backend Error: ${error.response.data.error}`;
    } 
    // Catch FastAPI validation errors
    else if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (typeof detail === 'string') {
        errorMessage = detail;
      } else if (Array.isArray(detail)) {
        errorMessage = detail.map(err => `${err.loc.join('.')} - ${err.msg}`).join(', ');
      }
    }
    
    throw new Error(errorMessage);
  }
};

export const getHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/history`);
    return response.data.history; 
  } catch (error) {
    console.error("History API Error:", error);
    return []; 
  }
};