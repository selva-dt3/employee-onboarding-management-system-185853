import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

const Topbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div
      className="topbar"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        justifyContent: "space-between",
        padding: "12px 16px",
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div style={{ fontWeight: 600, color: "var(--primary)" }}>
        Employee Onboarding
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span>{user ? user.name || user.email : "Guest"}</span>
        {user && (
          <button className="btn btn-secondary" onClick={logout} aria-label="Logout">
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Topbar;
