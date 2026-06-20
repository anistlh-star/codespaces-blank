// ecommerce/frontend/src/pages/AdminPages/AdminUserProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import UserFormModal from "./UserComponents/UserFormModal.jsx";
import "../../pages/UserPages/UserProfile.css";
import API from "../../../api";

const AdminUserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get(`/users/${id}`);
        setUserData(data.user);
      } catch (err) {
        alert("User not found");
        navigate("/admin/users");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await API.delete(`/users/${id}`);
      navigate("/admin/users");
    } catch (err) {
      alert("Cannot delete user");
    }
  };

  if (loading) return <div className="loading">Loading user...</div>;
  if (!userData) return <div>User not found</div>;

  return (
    <div className="profile-container admin-profile">
      <button className="back-btn" onClick={() => navigate("/admin/users/all")}>
        ← Back to Users
      </button>

      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-large">
            {userData.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="user-info">
            <h1>{userData.name}</h1>
            <p className="email">{userData.email}</p>
            <p className="joined">
              Joined {new Date(userData.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <label>Phone</label>
            <p>{userData.phone || "—"}</p>
          </div>
          <div className="info-item">
            <label>Address</label>
            <p>{userData.address || "—"}</p>
          </div>
          <div className="info-item">
            <label>Role</label>
            <p className={`role-badge ${userData.role}`}>
              {userData.role.toUpperCase()}
            </p>
          </div>
        </div>

        <div className="profile-actions admin-actions">
          <button className="btn-edit" onClick={() => setShowEditModal(true)}>
            Edit User
          </button>
          <button className="btn-delete" onClick={handleDelete}>
            Delete User
          </button>
        </div>
      </div>

      {showEditModal && (
        <UserFormModal
          user={userData}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
};

export default AdminUserProfile;
