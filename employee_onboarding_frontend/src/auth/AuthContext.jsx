import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import endpoints from "../api/endpoints";

// PUBLIC_INTERFACE
export const AuthContext = createContext({
  /** Current user object or null */
  user: null,
  /** JWT or session token if present */
  token: null,
  /** Loading state for auth bootstrap or actions */
  loading: false,
  /** Error message for last auth operation */
  error: null,
  /** Login with credentials */
  login: async (_email, _password) => {},
  /** Logout and clear state */
  logout: () => {},
  /** Refresh current user profile */
  fetchMe: async () => {},
});

// PUBLIC_INTERFACE
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("auth_token");
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const persistToken = useCallback((value) => {
    try {
      if (value) {
        localStorage.setItem("auth_token", value);
      } else {
        localStorage.removeItem("auth_token");
      }
    } catch {
      // ignore storage issues
    }
  }, []);

  // PUBLIC_INTERFACE
  const fetchMe = useCallback(async () => {
    if (!token) {
      setUser(null);
      return null;
    }
    try {
      setLoading(true);
      setError(null);
      const res = await api.get(endpoints.auth.me);
      setUser(res.data?.user || res.data || null);
      return res.data;
    } catch (e) {
      setUser(null);
      // if token invalid, clear it
      persistToken(null);
      setToken(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, persistToken]);

  // Bootstrap user on mount or when token changes
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await fetchMe();
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchMe]);

  // PUBLIC_INTERFACE
  const login = useCallback(
    async (email, password) => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.post(endpoints.auth.login, { email, password });
        const newToken = res.data?.token || res.data?.access_token;
        if (newToken) {
          setToken(newToken);
          persistToken(newToken);
          await fetchMe();
        } else {
          throw new Error("No token returned by server");
        }
        return true;
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Login failed");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchMe, persistToken]
  );

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    try {
      persistToken(null);
      setToken(null);
      setUser(null);
      // Optionally inform backend
      api.post(endpoints.auth.logout).catch(() => {});
    } catch {
      // ignore
    }
  }, [persistToken]);

  const value = useMemo(
    () => ({ user, token, loading, error, login, logout, fetchMe }),
    [user, token, loading, error, login, logout, fetchMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
