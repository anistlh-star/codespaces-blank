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

  if (!user?._id) return;
  const refreshStats = async () => {
    if (!user?._id) return;

    try {
      setStats((prev) => ({ ...prev, loading: true })); // optional: show loading again

      const [ordersRes, productsRes] = await Promise.all([
        API.get("/orders/my-orders"),
        API.get("/users/my-products"),
      ]);

      const newStats = {
        orders: ordersRes.data?.length || 0,
        products: productsRes.data?.data?.products?.length || 0,
        loading: false,
      };

      setStats(newStats);
    } catch (err) {
      console.error("Failed to refresh stats:", err);
      setStats({
        orders: 0,
        products: 0,
        loading: false,
      });
    }
  };

  // Initial load
  useEffect(() => {
    refreshStats();
  }, [user?._id]); // only re-run when user ID changes

  const handleProfileUpdated = () => {
    refreshStats(); // refresh stats after profile edit
  };
  if (!user) return <div className="loading">Please login</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-large">
            {user.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="user-info">
            <h1>{user.name}</h1>
            <p className="email">{user.email}</p>
            <p className="joined">
              Member since{" "}
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-number">{stats.orders}</span>
            <span className="stat-label"><Link to="/my-orders">Orders Placed</Link></span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.products}</span>
            <span className="stat-label"><Link to="/my-products">Products Listed</Link></span>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <label>Phone</label>
            <p>{user.phone || "Not added yet"}</p>
          </div>
          <div className="info-item">
            <label>Address</label>
            <p>{user.address || "Not added yet"}</p>
          </div>
          <div className="info-item">
            <label>Status</label>
            <p className="role-badge">{user.role}</p>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-edit" onClick={() => setShowEditModal(true)}>
            Edit Profile
          </button>
          <button className="btn-logout" onClick={logout}>
            Logout
          </button>
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
