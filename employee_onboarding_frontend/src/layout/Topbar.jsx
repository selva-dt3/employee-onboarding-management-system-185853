import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

const Topbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        justifyContent: "space-between",
        padding: "12px 16px",
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div style={{ fontWeight: 600, color: "var(--color-primary)" }}>
        Employee Onboarding
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span>{user ? user.name || user.email : "Guest"}</span>
        {user && (
          <button className="btn" onClick={logout} aria-label="Logout">
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Topbar;
