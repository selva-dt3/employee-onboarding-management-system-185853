import axios from "axios";
import endpoints from "./endpoints";

/**
 * Creates a configured Axios instance for the app.
 * Reads environment variables safely with fallbacks.
 * Handles token attach, refresh on 401, and retry logic.
 */
const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  "http://localhost:4000";

const REQUEST_TIMEOUT_MS = Number(
  process.env.REACT_APP_REQUEST_TIMEOUT_MS || 15000
);

// In-memory token cache to avoid frequent localStorage reads between requests.
// This is updated by AuthContext on login/refresh/logout via the exported setter.
let inMemoryAccessToken = null;

// Refresh control to avoid parallel refresh calls.
let isRefreshing = false;
let refreshPromise = null;
let subscribers = [];

/**
 * Subscribe to token refreshed event to retry queued requests.
 */
function subscribeTokenRefresh(cb) {
  subscribers.push(cb);
}
function onRefreshed(newToken) {
  subscribers.forEach((cb) => cb(newToken));
  subscribers = [];
}

/**
 * Update the in-memory token; called by AuthContext on login/refresh/logout.
 */
// PUBLIC_INTERFACE
export function setAccessToken(token) {
  /** Sets the in-memory access token used by axios interceptors. */
  inMemoryAccessToken = token || null;
}

/**
 * Safely get token from localStorage as a fallback hydration.
 */
function readStoredToken() {
  try {
    return localStorage.getItem("auth_token");
  } catch {
    return null;
  }
}

/**
 * Persist token to localStorage.
 */
function writeStoredToken(value) {
  try {
    if (value) localStorage.setItem("auth_token", value);
    else localStorage.removeItem("auth_token");
  } catch {
    // ignore storage write errors
  }
}

/**
 * Perform a refresh token call. Assumes server sets/uses httpOnly cookie
 * or accepts current access token for refresh depending on backend contract.
 */
async function performRefresh(axiosBase) {
  // If another refresh is ongoing, reuse it
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }
  isRefreshing = true;
  refreshPromise = axiosBase
    .post(endpoints.auth.refresh, {})
    .then((res) => {
      const newToken =
        res.data?.access_token || res.data?.token || res.data?.accessToken;
      if (!newToken) {
        throw new Error("No token returned by refresh endpoint");
      }
      setAccessToken(newToken);
      writeStoredToken(newToken);
      return newToken;
    })
    .finally(() => {
      isRefreshing = false;
      // Keep refreshPromise for subscribers until onRefreshed is called by caller
    });

  return refreshPromise;
}

/**
 * Interceptor helpers for attaching token and handling responses.
 */
export const createApiClient = () => {
  const instance = axios.create({
    baseURL: API_BASE,
    timeout: Number.isFinite(REQUEST_TIMEOUT_MS) ? REQUEST_TIMEOUT_MS : 15000,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // allow cookie-based refresh flows
  });

  // Request: attach Authorization from in-memory or storage
  instance.interceptors.request.use((config) => {
    let token = inMemoryAccessToken;
    if (!token) {
      token = readStoredToken();
      if (token) {
        setAccessToken(token); // hydrate memory
      }
    }
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response: on 401, try refresh once and retry original request
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error?.config;
      const status = error?.response?.status;

      if (!originalRequest) {
        return Promise.reject(error);
      }

      // Avoid infinite loop by marking retried requests
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newToken = await performRefresh(instance);
          // Notify any queued requests
          onRefreshed(newToken);

          // Update header for the retried request
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return instance(originalRequest);
        } catch (refreshErr) {
          // If refresh failed, clear tokens and reject
          setAccessToken(null);
          writeStoredToken(null);
          // Allow callers to handle logout/redirection
          return Promise.reject(refreshErr);
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const api = createApiClient();

export default api;
