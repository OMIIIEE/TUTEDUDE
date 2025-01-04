import axios from "axios";

// Correct baseURL to reflect the `/users` endpoint
const API = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BACKEND_URL}/api/users`,
}); // Corrected here

// Add token to the Authorization header if it exists in localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
