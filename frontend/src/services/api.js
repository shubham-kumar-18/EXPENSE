import axios from "axios";

// `localhost` belongs to the person opening the browser.  A production build
// must therefore always use the publicly deployed API (or an explicitly
// configured VITE_API_URL), never the visitor's own computer.
const apiBaseUrl = (
  import.meta.env.VITE_API_URL || "https://expense-backend-8043.onrender.com"
).replace(/\/$/, "");

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
