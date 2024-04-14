import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api"; // Adjust based on your actual API

export const fetchData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/data`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
