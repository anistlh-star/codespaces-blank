//ecommerce/frontend/src/pages/AdminPages/CategoryLayout.jsx
import React, { useState } from "react";
import CategoryPage from "./CategoryComponents/CategoryPage";
import AdminSidebar from "./AdminComponents1/Sidebar";
import TopBar from "./AdminComponents1/Topbar";

export default function CategoryLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <div className="admin-layout">
      <TopBar onToggleSidebar={toggleSidebar} collapsed={collapsed} />

      <div
        className={`admin-container ${
          collapsed ? "sidebar-collapsed" : "sidebar-expanded"
        }`}
      >
        <AdminSidebar
          collapsed={!collapsed}
          isOpen={sideBarOpen}
          onClose={() => setSideBarOpen(false)}
        />

        <main className="admin-main">
          <CategoryPage />
        </main>
      </div>
    </div>
  );
}
