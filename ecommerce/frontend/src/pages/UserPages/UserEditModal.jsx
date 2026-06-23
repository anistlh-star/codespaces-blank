// ecommerce/frontend/src/components/UserEditModal.jsx
import React, { useState, useEffect } from "react";
import API from "../../../api";
import { useAuth } from "../../../context/AuthContext";

import "./UserEditModal.css";

const UserEditModal = ({ user, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { updateUser } = useAuth();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        role: user.role || "user",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); // Clear error when user changes input
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (user) {
        // Update existing user
        const res = await API.put(`/users/${user._id}`, formData);
        updateUser(res.data.user);
      } else {
        // Create new user (only admin uses this)
        await API.post("/users", formData);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save user configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edt-modal">
      {/* Background Overlay click closes window */}
      <div className="edt-modal__overlay" onClick={onClose} />
      
      <div className="edt-modal__container">
        <div className="edt-modal__header">
          <h2 className="edt-modal__title">
            {user ? "Edit Profile Details" : "Create New Profile"}
          </h2>
          <p className="edt-modal__subtitle">
            {user ? "Modify account configurations below." : "Register a brand new user system node."}
          </p>
        </div>

        {error && <div className="edt-modal__error">{error}</div>}

        <form onSubmit={handleSubmit} className="edt-modal__form">
          <div className="edt-modal__field">
            <label htmlFor="name" className="edt-modal__label">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              placeholder="e.g. Alexander Wright"
              value={formData.name}
              onChange={handleChange}
              className="edt-modal__input"
              required
            />
          </div>

          <div className="edt-modal__field">
            <label htmlFor="email" className="edt-modal__label">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="name@domain.com"
              value={formData.email}
              onChange={handleChange}
              className="edt-modal__input"
              required
            />
          </div>

          <div className="edt-modal__field">
            <label htmlFor="phone" className="edt-modal__label">Phone Connection</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={handleChange}
              className="edt-modal__input"
            />
          </div>

          <div className="edt-modal__field">
            <label htmlFor="address" className="edt-modal__label">Shipping Address</label>
            <textarea
              id="address"
              name="address"
              placeholder="Street Address, Suite, City, State, Zip"
              value={formData.address}
              onChange={handleChange}
              className="edt-modal__textarea"
              rows="3"
            />
          </div>

          <div className="edt-modal__actions">
            <button 
              type="button" 
              className="edt-btn edt-btn--secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="edt-btn edt-btn--primary" 
              disabled={loading}
            >
              {loading ? (
                <span className="edt-modal__spinner-flex">
                  <span className="edt-modal__spinner"></span>
                  Saving Changes...
                </span>
              ) : user ? (
                "Save Changes"
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;