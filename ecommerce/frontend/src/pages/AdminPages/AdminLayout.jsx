//ecommerce/frontend/src/pages/AdminPages/AdminLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import "./AdminStyles.css";
import AdminSidebar from "./AdminComponents1/Sidebar.jsx";
import { Link } from "react-router-dom";
const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeDropdown = () => setDropdownOpen(false);

  return (
    <div className="admin-layout">
      {/* ==================== TOPBAR ==================== */}
      <header className="admin-topbar">
        <div className="admin-topbar-left">
          <button
            onClick={toggleSidebar}
            className="admin-topbar-toggle"
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {sidebarCollapsed ? (
              <ChevronRight size={24} />
            ) : (
              <ChevronLeft size={24} />
            )}
          </button>
          <h1 className="admin-topbar-title">Admin Panel</h1>
        </div>

        <div className="admin-topbar-right">
          <button className="admin-home-link" onClick={() => navigate("/")}>
            Home
          </button>
       
          <button onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
          <div className="admin-profile-wrapper">
            <button
              className="admin-profile-btn"
            
            >
               <Link to="/userprofile">
      <img
                src={user?.image || "https://i.pravatar.cc/40?u=admin"}
                alt="Admin"
                className="admin-profile-avatar"
              />
              <span className="admin-profile-name">
                {user?.name || "Admin"}
              </span>
                  </Link>
            </button>

          </div>
        </div>
      </header>

      {/* ==================== MAIN CONTAINER ==================== */}
      <div
        className={`admin-container ${sidebarCollapsed ? "admin-sidebar-collapsed" : ""}`}
      >
        {/* Sidebar */}
        <div className="admin-sidebar-wrapper">
          <AdminSidebar collapsed={sidebarCollapsed} />
        </div>

        {/* Main Content Area */}
        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
