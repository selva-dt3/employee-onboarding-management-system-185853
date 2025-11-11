import axios from "axios";

/**
 * Creates a configured Axios instance for the app.
 * Reads environment variables safely with fallbacks.
 */
const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  "http://localhost:4000";

const REQUEST_TIMEOUT_MS = Number(
  process.env.REACT_APP_REQUEST_TIMEOUT_MS || 15000
);

/**
 * Interceptor helpers for attaching token and handling responses.
 * Token is read from localStorage (set via AuthContext).
 */
export const createApiClient = () => {
  const instance = axios.create({
    baseURL: API_BASE,
    timeout: Number.isFinite(REQUEST_TIMEOUT_MS) ? REQUEST_TIMEOUT_MS : 15000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    try {
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // ignore storage errors
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Basic centralized error handling hook
      return Promise.reject(error);
    }
  );

  return instance;
};

const api = createApiClient();

export default api;
