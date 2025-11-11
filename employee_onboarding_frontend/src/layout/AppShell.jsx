import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const shellStyles = {
  container: { display: "flex", minHeight: "100vh" },
  sidebar: { width: 240, borderRight: "1px solid #e5e7eb", background: "#fff" },
  contentWrap: { flex: 1, display: "flex", flexDirection: "column" },
  content: { padding: 24, flex: 1 },
};

// PUBLIC_INTERFACE
const AppShell = ({ children }) => {
  return (
    <div style={shellStyles.container}>
      <aside style={shellStyles.sidebar}>
        <Sidebar />
      </aside>
      <div style={shellStyles.contentWrap}>
        <Topbar />
        <main style={shellStyles.content}>{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
