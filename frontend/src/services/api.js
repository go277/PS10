import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

export const processTile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post(`${API_URL}/process-tile`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error(error.response?.data?.detail || "Failed to process image on the server.");
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