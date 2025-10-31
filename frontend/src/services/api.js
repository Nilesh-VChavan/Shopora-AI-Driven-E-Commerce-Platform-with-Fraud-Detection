// frontend/src/services/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.DEV 
  ? "http://127.0.0.1:8000/api" 
  : "https://shopora-ai-driven-e-commerce-platform.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// REQUEST INTERCEPTOR – ADD JWT TOKEN
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR – HANDLE 401 (UNAUTHORIZED)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;