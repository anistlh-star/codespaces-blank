// ecommerce/frontend/src/components/Navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, Heart, User, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { MdAdminPanelSettings } from "react-icons/md";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../hooks/useWishlist";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { token, logout, user } = useAuth();
  const { cart } = useCart();
  const { wishlistIds } = useWishlist()
  const closeMenu = () => setIsMobileOpen(false);
  const toggleMenu = () => setIsMobileOpen(!isMobileOpen);

  const handleSignOut = () => {
    logout();
    navigate("/login");
    closeMenu();
  };
  const cartItemCount =
    cart?.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <>
      <nav className="ecom-navbar">
        <div className="ecom-navbar-container">
          {/* Brand Logo */}
          <Link to="/" className="ecom-navbar-logo" onClick={closeMenu}>
            Electro<span className="logo-accent">Hub</span>
          </Link>

          {/* Desktop Navigation Routes */}
          <div className="ecom-navbar-routes">
            <NavLink to="/" className={({ isActive }) => `ecom-navbar-link ${isActive ? "active" : ""}`} end>
              Home
            </NavLink>
            <NavLink to="/shop" className={({ isActive }) => `ecom-navbar-link ${isActive ? "active" : ""}`}>
              Shop
            </NavLink>
          </div>

          {/* User Operations Panel */}
          <div className="ecom-navbar-actions">
            {isAdmin && (
              <Link to="/admin" className="ecom-icon-btn admin-indicator" title="Admin Control Panel">
                <MdAdminPanelSettings size={22} />
              </Link>
            )}
            <Link to="/wishlist" className="ecom-icon-btn ecom-wishlist-trigger" aria-label="View Wishlist">
              <Heart size={20} />
              {wishlistIds.length > 0 && (
                <span className="ecom-navbar-badge">{wishlistIds.length}</span>
              )}
            </Link>
            <Link to="/my-orders" className="ecom-icon-btn" aria-label="View Wishlist">
              <ShoppingBag size={20} />
            </Link>

            <Link to="/cart" className="ecom-icon-btn ecom-cart-trigger" aria-label="View Cart">
              <ShoppingCart size={20} />

              {cartItemCount > 0 && (
                <span className="ecom-navbar-badge">{cartItemCount}</span>
              )}
            </Link>

            {token ? (
              <div className="ecom-user-dropdown-wrapper">
                <Link to="/profile" className="ecom-icon-btn" aria-label="Account Profile">
                  <User size={20} />
                </Link>
                <div className="ecom-dropdown-menu">
                  <Link to="/userprofile" className="ecom-dropdown-item">My Profile</Link>
                  <Link to="/my-orders" className="ecom-dropdown-item">Order History</Link>
                  <button onClick={handleSignOut} className="ecom-dropdown-item ecom-logout-btn">
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="ecom-auth-cta-btn">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Action Trigger */}
            <button className="ecom-mobile-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Synchronized Mobile View Overlay Architecture */}
      <div
        className={`ecom-mobile-overlay ${isMobileOpen ? "visible" : ""}`}
        onClick={closeMenu}
      />

      <div className={`ecom-mobile-drawer ${isMobileOpen ? "open" : ""}`}>
        <div className="ecom-drawer-header">
          <span className="ecom-navbar-logo">Electro<span className="logo-accent">Hub</span></span>
          <button className="ecom-drawer-close" onClick={closeMenu}>
            <X size={22} />
          </button>
        </div>

        <div className="ecom-drawer-body">
          <div className="ecom-drawer-links">
            <Link to="/" onClick={closeMenu}>Home</Link>
            <Link to="/shop" onClick={closeMenu}>Shop</Link>
            <Link to="/wishlist" onClick={closeMenu}>Wishlist ({wishlistIds.length})</Link>
            <Link to="/cart" onClick={closeMenu}>Cart ({cartItemCount})</Link>
            {token && <Link to="/profile" onClick={closeMenu}>My Account</Link>}
            {isAdmin && (
              <Link to="/admin" onClick={closeMenu} className="ecom-drawer-admin-link">
                Admin Settings
              </Link>
            )}
          </div>

          <div className="ecom-drawer-footer">
            {token ? (
              <button onClick={handleSignOut} className="ecom-drawer-auth-btn logout">
                Sign Out
              </button>
            ) : (
              <Link to="/login" onClick={closeMenu} className="ecom-drawer-auth-btn">
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;