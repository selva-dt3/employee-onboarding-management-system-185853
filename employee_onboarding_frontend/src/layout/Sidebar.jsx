import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const NavLink = ({ to, label }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      style={{
        padding: "10px 12px",
        borderRadius: "var(--radius-sm)",
        color: active ? "var(--primary)" : "var(--text)",
        background: active ? "rgba(37, 99, 235, 0.08)" : "transparent",
        textDecoration: "none",
        display: "block",
        transition: "background-color .2s ease, color .2s ease",
      }}
      className="sidebar-link"
    >
      {label}
    </Link>
  );
};

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 16, color: "var(--primary)" }}>LMS</div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <NavLink to="/" label="Home" />
        {user?.roles?.includes("Admin") && <NavLink to="/admin" label="Admin" />}
        {user?.roles?.includes("HR") && <NavLink to="/hr" label="HR" />}
        <NavLink to="/lessons" label="Lessons" />
      </nav>
    </div>
  );
};

export default Sidebar;
