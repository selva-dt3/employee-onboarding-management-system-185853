import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontWeight: 700, marginBottom: 16 }}>LMS</div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <Link to="/">Home</Link>
        {user?.roles?.includes("Admin") && <Link to="/admin">Admin</Link>}
        {user?.roles?.includes("HR") && <Link to="/hr">HR</Link>}
        <Link to="/lessons">Lessons</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
