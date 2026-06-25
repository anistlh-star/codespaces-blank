import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../../../api/index.js";
import { getImageSrc } from "../../../components/imageHandler.js"

import CategoryFormModal from "./CategoryFormModal.jsx";
import "./CategoryPage.css";

export default function CategoryPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal Context Management states
  const [showModal, setShowModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await API.get("/categories/all");
      setCategories(res.data?.data?.categories || res.data?.categories || []);
    } catch (err) {
      setError("Failed to fetch catalog groups from the server infrastructure.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the category: "${name}"?`)) return;
    try {
      await API.delete(`/categories/${id}`);
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Failed to drop selected index key from database context allocation.");
    }
  };

  const openCreateModal = () => {
    setActiveCategory(null);
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setActiveCategory(cat);
    setShowModal(true);
  };

  return (
    <div className="cat-dashboard-wrapper">
      <header className="cat-dashboard-header">
        <div>
          <h1>All Categories</h1>
          <p className="cat-dashboard-subtitle">Manage system item listings, categories, and logical hierarchies.</p>
        </div>
        <button className="cat-dashboard-add-btn" onClick={openCreateModal}>
       +Add New Category
        </button>
      </header>

      {loading ? (
        <div className="cat-dashboard-spinner-state">
          <div className="spinner-node"></div>
          <p>Syncing dataset arrays...</p>
        </div>
      ) : error ? (
        <div className="cat-dashboard-error-state">{error}</div>
      ) : (
        <main className="cat-dashboard-grid animate-fade-view">
          {categories.map((cat, index) => (
            <div 
              className="cat-dashboard-card" 
              key={cat._id}
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <div className="cat-card-media">
                <img
                  src={getImageSrc(cat.image)}
                  alt={cat.name}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>
              <div className="cat-card-body">
                <h3>
                  <Link to={`/admin/category/${cat._id}`} className="cat-item-link">
                    {cat.name}
                  </Link>
                </h3>
                <p>{cat.description || "No description logs registered for this reference configuration node."}</p>
                
                <div className="cat-card-actions">
                  <button className="cat-card-btn edit" onClick={() => openEditModal(cat)}>
                    Modify
                  </button>
                  <button className="cat-card-btn delete" onClick={() => handleDelete(cat._id, cat.name)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="cat-dashboard-empty">No catalog classification logs recorded in this workspace directory.</div>
          )}
        </main>
      )}

      {showModal && (
        <CategoryFormModal
          category={activeCategory}
          onClose={() => setShowModal(false)}
          onSuccess={fetchCategories}
        />
      )}
    </div>
  );
}