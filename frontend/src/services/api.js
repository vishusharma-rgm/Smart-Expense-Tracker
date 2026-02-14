import axios from "axios";

const rawBaseUrl = (import.meta.env.VITE_API_URL || "").trim();
const baseUrl = rawBaseUrl || "http://localhost:3000";
const normalizedBaseUrl = baseUrl.endsWith("/")
  ? baseUrl.slice(0, -1)
  : baseUrl;

const api = axios.create({
  baseURL: `${normalizedBaseUrl}/api`,
});

// Attach token automatically
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

// Auto logout if token expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;
