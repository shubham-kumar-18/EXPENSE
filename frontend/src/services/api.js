import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://expense-backend-8043.onrender.com"
});

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("expense-ai-auth");
  if (stored) {
    try {
      const { token } = JSON.parse(stored);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      localStorage.removeItem("expense-ai-auth");
    }
  }
  return config;
});

export default api;
