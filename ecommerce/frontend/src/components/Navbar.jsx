//ecommerce/frontend/src/components/Navbar.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, Heart, User } from "lucide-react";
import { useState, useEffect } from "react";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";
import { useCategories } from "../hooks/useCategories";
import { MdAdminPanelSettings } from "react-icons/md";
import { useCart } from "../../context/CartContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { token, logout, user } = useAuth();
  // const { categories, loading: categoriesLoading } = useCategories();
  const { cart, clearCart } = useCart();

  const closeMenu = () => setIsMobileOpen(false);
  // const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);

  const handleSignOut = () => {
    logout();
    clearCart();
    navigate("/login");
    closeMenu();
  };

  const cartItemCount =
    cart?.items?.reduce((total, item) => total + (item.quantity || 1), 0) || 0;

  return (
    <>
      <nav className="electronics-navbar">
        <div className="electronics-navbar-container">
          {/* Logo */}
          <Link to="/" className="electronics-navbar-logo" onClick={closeMenu}>
            Electro<span>Hub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="electronics-navbar-menu electronics-desktop-only">
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                isActive
                  ? "electronics-navbar-link active"
                  : "electronics-navbar-link"
              }
            >
              Shop
            </NavLink>
            <NavLink to="/ai" onClick={closeMenu}>
              AI
            </NavLink>

            {/* <div
              className="electronics-category-dropdown-wrapper"
              onMouseEnter={() => setIsCategoryOpen(true)}
              onMouseLeave={() => setIsCategoryOpen(false)}
            >
              <button className="electronics-navbar-link" onClick={toggleCategory}>
                Categories
              </button>

              {isCategoryOpen && (
                <div className="electronics-category-dropdown">
                  {categoriesLoading ? (
                    <div className="electronics-dropdown-loading">Loading...</div>
                  ) : categories.length === 0 ? (
                    <div className="electronics-dropdown-empty">No categories yet</div>
                  ) : (
                    categories.map((cat) => (
                      <button
                        key={cat._id}
                        className="electronics-dropdown-item"
                        onClick={() => {
                          navigate(`/category/${cat._id}`);
                          setIsCategoryOpen(false);
                        }}
                      >
                        {cat.categoryName || cat.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div> */}

            <NavLink
              to="/newarrivals"
              className={({ isActive }) =>
                isActive
                  ? "electronics-navbar-link active"
                  : "electronics-navbar-link"
              }
            >
              New Arrivals
            </NavLink>
          </div>

          {/* Right Icons & Auth */}
          <div className="electronics-navbar-actions">
            <Link
              to="/wishlist"
              className="electronics-navbar-icon-btn"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </Link>

            <Link
              to="/cart"
              className="electronics-navbar-icon-btn electronics-navbar-cart-btn"
              aria-label={`Cart ${cartItemCount > 0 ? `(${cartItemCount} items)` : ""}`}
            >
              <ShoppingBag size={20} strokeWidth={1.8} />
              {cartItemCount > 0 && (
                <span className="electronics-navbar-cart-count">
                  {cartItemCount}
                </span>
              )}
            </Link>
            {/* if user role is admin then choose the profile if not then choose the userprofile */}

            {token ? (
              <>
                <Link
                  to={
                    user && user.role === "Admin" ? "/profile" : "/userprofile"
                  }
                  className="electronics-navbar-icon-btn"
                  aria-label="Account"
                >
                  <User size={20} />
                </Link>
                <button
                  className="electronics-navbar-link electronics-signout-btn electronics-desktop-only"
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
                {user && (user.role === "Admin" || user.role === "admin") && (
                  <Link
                    to="/admin"
                    className="electronics-navbar-link electronics-admin-btn electronics-desktop-only"
                  >
                    <MdAdminPanelSettings size={22} /> Admin
                  </Link>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="electronics-navbar-link electronics-signin-btn electronics-desktop-only"
              >
                Sign In
              </Link>
            )}
            <button
              className="electronics-navbar-toggle electronics-mobile-only"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer with smooth slide */}
      <div
        className={`electronics-mobile-overlay ${isMobileOpen ? "electronics-mobile-overlay--visible" : ""}`}
        onClick={closeMenu}
      >
        <div
          className={`electronics-mobile-drawer ${isMobileOpen ? "electronics-mobile-drawer--open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="electronics-mobile-drawer-header">
            <Link
              to="/"
              className="electronics-mobile-logo"
              onClick={closeMenu}
            >
              Electro<span>Hub</span>
            </Link>
            <button
              className="electronics-mobile-close-btn"
              onClick={closeMenu}
            >
              <X size={28} />
            </button>
          </div>

          <nav className="electronics-mobile-nav-links">
            <NavLink to="/shop" onClick={closeMenu}>
              Shop
            </NavLink>
            <NavLink to="/ai" onClick={closeMenu}>
              AI
            </NavLink>
            <NavLink to="/newarrivals" onClick={closeMenu}>
              New Arrivals
            </NavLink>
          </nav>

          <div className="electronics-mobile-secondary-links">
            <Link to="/wishlist" onClick={closeMenu}>
              Wishlist
            </Link>
            <Link to="/cart" onClick={closeMenu}>
              Cart
            </Link>
            <Link to="/userprofile" onClick={closeMenu}>
              My Account
            </Link>
            <Link to="/profile" onClick={closeMenu}>
              My Account
            </Link>

            {token ? (
              <>
                <button
                  onClick={handleSignOut}
                  className="electronics-mobile-auth-link electronics-logout"
                >
                  Sign Out
                </button>

                {user &&
                  user.role === "Admin" &&
                  user.role ===
                    "admin"(
                      <Link
                        to="/admin"
                        className="electronics-mobile-auth-link"
                        onClick={closeMenu}
                      >
                        <MdAdminPanelSettings size={22} /> Admin
                      </Link>,
                    )}
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="electronics-mobile-auth-link"
              >
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
