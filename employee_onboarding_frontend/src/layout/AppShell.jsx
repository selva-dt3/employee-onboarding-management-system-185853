import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

/**
 * AppShell composes the base layout (sidebar + topbar + content).
 * It applies theme-aware styles through CSS variables and classes.
 */
// PUBLIC_INTERFACE
const AppShell = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      <aside
        className="sidebar"
        style={{
          width: 260,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
        }}
      >
        <Sidebar />
      </aside>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Topbar />
        <main
          style={{
            padding: 24,
            flex: 1,
          }}
        >
          <div className="surface" style={{ padding: 16, borderRadius: "var(--radius)" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
