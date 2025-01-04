import axios from "axios";

// Update the baseURL to match your backend's structure
const API = axios.create({
  baseURL: "http://localhost:5000/api/users", // Ensure the endpoint prefix is correct
});

// Add Authorization token to the headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
