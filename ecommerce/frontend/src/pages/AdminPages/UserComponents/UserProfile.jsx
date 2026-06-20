//ecommerce/frontend/src/pages/AdminPages/UserComponents/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserProfile.css';
import { useAuth } from '../../../../context/AuthContext';
import API from '../../../../api';
import UserEditModal from '../../UserPages/UserEditModal';

const UserProfile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    ordersCount: 0,
    productsCount: 0,
    loading: true,
    error: null,
  });
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user?._id) return;

      try {
     const [ordersRes, productsRes] = await Promise.all([
        API.get("/orders/my-orders"),
        API.get("/users/my-products"),
      ]);
        setStats({
          ordersCount: ordersRes.data?.length || 0,
          productsCount: productsRes.data?.length || 0,
          loading: false,
          error: null,
        });
      } catch (err) {
        setStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load profile statistics',
        }));
        console.error('Profile stats error:', err);
      }
    };

    fetchUserStats();
  }, [user?._id]);

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <h2>Please log in to view your profile</h2>
          <Link to="/login" className="btn primary">Go to Login</Link>
        </div>
      </div>
    );
  }
 const handleProfileUpdated = () => {
    refreshStats(); // refresh stats after profile edit
  };
  return (
    <div className="profile-page">
      <div className="profile-card animate-fade-in">
        <div className="profile-header">
          <div className="avatar">
            {user.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div className="user-info">
            <h1>{user.name || 'User'}</h1>
            <p className="email">{user.email}</p>
            <p className="joined">
              Member since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card animate-slide-up">
            <div className="stat-icon">📦</div>
            <h3>Orders Placed</h3>
            <div className="stat-value">
              {stats.loading ? (
                <div className="loading-spinner"></div>
              ) : stats.error ? (
                <span className="error">—</span>
              ) : (
                stats.ordersCount
              )}
            </div>
            <Link to="/my-orders" className="stat-link">View Orders →</Link>
          </div>

          <div className="stat-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="stat-icon">🛍️</div>
            <h3>Products Listed</h3>
            <div className="stat-value">
              {stats.loading ? (
                <div className="loading-spinner"></div>
              ) : stats.error ? (
                <span className="error">—</span>
              ) : (
                stats.productsCount
              )}
            </div>
            <Link to="/my-products" className="stat-link">View Products →</Link>
          </div>
        </div>

        <div className="profile-actions">
            <button className="btn-primary" onClick={() => setShowEditModal(true)}>
            Edit Profile
          </button>
          
          <button className="btn secondary">Change Password</button>
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