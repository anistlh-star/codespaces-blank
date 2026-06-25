// ecommerce/frontend/src/pages/UserPages/UserProfile.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import API from "../../../api";
import UserEditModal from "./UserEditModal.jsx";
import { Link } from "react-router-dom";

import "./UserProfile.css";

const UserProfile = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ orders: 0, products: 0, loading: true });
  const [showEditModal, setShowEditModal] = useState(false);

  // Define data fetch handler inside a hook-safe context
  const refreshStats = async () => {
    if (!user?._id) return;
console.log("Refreshing stats for user:", user);
    try {
      setStats((prev) => ({ ...prev, loading: true }));

      const [ordersRes, productsRes] = await Promise.all([
        API.get("/orders/my-orders"),
        API.get("/users/my-products"),
      ]);

      setStats({
        orders: ordersRes.data?.orders.length || 0,
        products: productsRes.data?.data?.products?.length || 0,
        loading: false,
      });
      console.log("Stats refreshed:", { orders: ordersRes, products: productsRes });  
    } catch (err) {
      console.error("Failed to refresh stats:", err);
      setStats({
        orders: 0,
        products: 0,
        loading: false,
      });
    }
  };

  // Safe initial load invocation triggering only if user identifier arrives
  useEffect(() => {
    if (user?._id) {
      refreshStats();
    }
  }, [user?._id]);

  const handleProfileUpdated = () => {
    refreshStats();
  };

  // Safe early returns are placed AFTER all hooks have initialized
  if (!user) {
    return (
      <div className="prof-gate">
        <div className="prof-gate__card">
          <div className="prof-gate__spinner"></div>
          <p>Verifying profile authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prof-page">
      <div className="prof-container">
        
        {/* Banner Card Element */}
        <div className="prof-card prof-card--hero">
          <div className="prof-card__header">
            <div className="prof-avatar">
              {user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="prof-user">
              <h1 className="prof-user__name">{user.name}</h1>
              <p className="prof-user__email">{user.email}</p>
              <div className="prof-user__meta">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"></path><path d="M12 11h.01"></path><path d="M12 7h.01"></path><path d="M12 15h.01"></path><path d="M16 11h.01"></path><path d="M16 7h.01"></path><path d="M8 11h.01"></path><path d="M8 7h.01"></path></svg>
                <span>
                  Member since{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Metric Counter Panels */}
        <div className="prof-stats-grid">
          <Link to="/my-orders" className="prof-stat-card">
            <div className="prof-stat-card__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            </div>
            <div className="prof-stat-card__data">
              <span className="prof-stat-card__number">{stats.loading ? "—" : stats.orders}</span>
              <span className="prof-stat-card__label">Orders Placed</span>
            </div>
          </Link>

          <Link to="/my-products" className="prof-stat-card">
            <div className="prof-stat-card__icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            </div>
            <div className="prof-stat-card__data">
              <span className="prof-stat-card__number">{stats.loading ? "—" : stats.products}</span>
              <span className="prof-stat-card__label">Products Listed</span>
            </div>
          </Link>
        </div>

        {/* Structured Data Content Deck */}
        <div className="prof-card">
          <h2 className="prof-card__title">Account Details</h2>
          
          <div className="prof-details-grid">
            <div className="prof-detail-item">
              <span className="prof-detail-item__label">Phone Connection</span>
              <p className="prof-detail-item__value">{user.phone || "Not linked yet"}</p>
            </div>
            
            <div className="prof-detail-item">
              <span className="prof-detail-item__label">Shipping Address</span>
              <p className="prof-detail-item__value">{user.address || "No address added yet"}</p>
            </div>
            
            <div className="prof-detail-item">
              <span className="prof-detail-item__label">Access Hierarchy</span>
              <div className="prof-detail-item__value">
                <span className="prof-badge">{user.role}</span>
              </div>
            </div>
          </div>

          <div className="prof-actions">
            <button className="prof-btn prof-btn--primary" onClick={() => setShowEditModal(true)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"></path></svg>
              Edit Profile
            </button>
            <button className="prof-btn prof-btn--danger" onClick={logout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              Logout
            </button>
          </div>
        </div>

      </div>

      {showEditModal && (
        <UserEditModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleProfileUpdated}
        />
      )}
    </div>
  );
};

export default UserProfile;