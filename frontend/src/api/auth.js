import axios from "axios";

// Update the baseURL to match your backend's structure
const API = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BACKEND_URL}/api/users`, // Ensure the endpoint prefix is correct
});
console.log(import.meta.env);
console.log(import.meta.env.VITE_APP_BACKEND_URL);

// Add Authorization token to the headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
