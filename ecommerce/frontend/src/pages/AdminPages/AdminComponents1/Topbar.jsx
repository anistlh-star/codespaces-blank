//ecommerce/frontend/src/pages/AdminPages/AdminComponents1/Topbar.jsx
import { Bell, Menu, ChevronDown, LogOut, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

export default function TopBar({ onToggleSidebar }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="admin-topbar">
      <button onClick={onToggleSidebar} className="admin-topbar-toggle">
        <Menu size={24} />
      </button>

      <div className="admin-topbar-right">
        <Link to="/" className="admin-home-link">
          Home
        </Link>

        
            <div className="admin-profile-avatar">
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </div>
          
        
      </div>
    </header>
  );
}
