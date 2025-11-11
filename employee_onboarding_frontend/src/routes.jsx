import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./auth/ProtectedRoute";
import AppShell from "./layout/AppShell";
import Home from "./pages/dashboard/Home";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";

/**
 * Defines all application routes including public auth pages and protected app routes.
 */
// PUBLIC_INTERFACE
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected app routes */}
      <Route element={<ProtectedRoute roles={[]}/>}>
        <Route
          path="/"
          element={
            <AppShell>
              <Home />
            </AppShell>
          }
        />
        {/* Additional protected routes can be added here, wrapped in AppShell */}
        {/* Example role-gated:
        <Route element={<ProtectedRoute roles={['Admin']}/>}>
          <Route path="/admin" element={<AppShell><AdminPage/></AppShell>} />
        </Route>
        */}
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
