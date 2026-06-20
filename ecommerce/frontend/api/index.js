// api/index.js – recommended for your current setup
import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,        // Important for cookies
});

// 🔥 Auto attach token for logged-in users
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");   // or wherever you store token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
