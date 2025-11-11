import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { hasRole } from "./RBAC";

/**
 * Route guard component to protect routes by auth and optional roles.
 */
// PUBLIC_INTERFACE
const ProtectedRoute = ({ roles = [] }) => {
  const { user, token, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles.length > 0 && !hasRole(user, roles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
