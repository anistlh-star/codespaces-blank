// ecommerce/frontend/src/pages/AdminPages/UserManagement.jsx
import React, { useState, useEffect } from "react";
import UserFormModal from "./UserFormModal";
import "./UserManagement.css";
import API from "../../../../api";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?._id || localStorage.getItem("userId");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/users/all");
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Error connecting to account registries:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to permanently remove this user account?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert("Authorization error: Unable to terminate record.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role?.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="user-management">
      <div className="page-header">
        <div>
          <h1>User Directory</h1>
          <p className="subtext">Manage system accounts, refine operational access parameters, and inspect profiles.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            setEditingUser(null);
            setShowModal(true);
          }}
        >
          <span>+</span> Add New User
        </button>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or email identity..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="role-filter"
        >
          <option value="">All Account Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
          <option value="guest">Guest</option>
        </select>
      </div>

      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <div className="pulse-spinner"></div>
            <p>Syncing secure profiles...</p>
          </div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>Profile Name</th>
                <th>Email Address</th>
                <th>System Role</th>
                <th>Phone No.</th>
                <th>Joined Date</th>
                <th style={{ textAlign: "right" }}>Management Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="fade-in-row">
                    <td>
                      <Link to={`/admin/users/${u._id}`} className="user-profile-link">
                        {u.name}
                      </Link>
                    </td>
                    <td className="text-muted">{u.email}</td>
                    <td>
                      <span className={`role-badge ${u.role?.toLowerCase()}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.phone || "—"}</td>
                    <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' }) : "—"}</td>
                    <td style={{ textAlign: "right" }}>
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditingUser(u);
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </button>
                      {currentUserId !== u._id && (
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(u._id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="empty-table-state">
                    No registry accounts match your filter definitions.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <UserFormModal
          user={editingUser}
          onClose={() => setShowModal(false)}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
};

export default UserManagement;