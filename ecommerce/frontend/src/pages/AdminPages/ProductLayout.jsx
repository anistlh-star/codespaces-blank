//ecommerce/frontend/src/pages/AdminPages/ProductLayout.jsx

import { useState } from "react";
import ProductListingPage from "./ProductComponents/ProductList";
import TopBar from "./AdminComponents/Topbar";
import AdminSidebar from "./AdminComponents1/Sidebar";

const ProductLayout = () => {
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
          <ProductListingPage />
        </main>
      </div>
    </div>
  );
};

export default ProductLayout;
