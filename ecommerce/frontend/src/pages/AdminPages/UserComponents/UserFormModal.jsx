// ecommerce/frontend/src/pages/AdminPages/UserFormModal.jsx
import React, { useState, useEffect } from "react";
import API from "../../../../api";
import "./UserManagement.css";

const UserFormModal = ({ user, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        password: "", // Kept blank during edits to prevent overriding hash
        role: user.role?.toLowerCase() || "user",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (user) {
        // Build payload safely without blank password overwrites
        const updatePayload = { ...form };
        delete updatePayload.password; 
        
        await API.put(`/admin/users/${user._id}`, updatePayload);
      } else {
        await API.post("/admin/users/add", form);
      }
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{user ? "Modify User Account" : "Register New Account"}</h2>
          <p className="modal-subtitle">
            {user ? `Updating profile information for ${user.name}` : "Create a new user assignment credentials"}
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Jane Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          {!user && (
            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          )}

          <div className="input-row">
            <div className="input-group">
              <label>System Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
                <option value="guest">Guest</option>
              </select>
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Physical Address</label>
            <textarea
              placeholder="Street, City, State, ZIP Code"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="btn secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Saving changes..." : user ? "Update Account" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;