import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BACKEND_URL}/api/users`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
