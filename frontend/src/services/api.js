import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "https://expense-backend-8043.onrender.com" : "https://localhost:5002");

const api = axios.create({
  baseURL: apiBaseUrl
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
