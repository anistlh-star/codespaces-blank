import React, { useState, useEffect } from "react";
import API from "../../../../api/index.js";
import "./CategoryFormModal.css";
import { getImageSrc } from "../../../components/imageHandler.js";

const CategoryFormModal = ({ category, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Safely hydrate state if editing an existing entity
  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setDescription(category.description || "");
      setPreview(category.image || null);
    } else {
      setName("");
      setDescription("");
      setPreview(null);
    }
    setImage(null);
    setError("");
  }, [category]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name designation is required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      if (image) {
        formData.append("image", image); // Appends new binary data
      }

      if (category) {
        // Updating explicit document reference
        await API.put(`/categories/${category._id}`, formData);
      } else {
        // Creating structural node
        await API.post("/categories/create", formData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred writing to the registry.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cat-modal-overlay">
      <div className="cat-modal-content">
        <div className="cat-modal-header">
          <h2>{category ? "Modify Category Record" : "Instate New Category"}</h2>
          <p className="cat-modal-subtitle">
            {category ? `Editing: ${category.name}` : "Create a new structural catalog classification group"}
          </p>
        </div>

        {error && <div className="cat-modal-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="cat-input-group">
            <label>Classification Title</label>
            <input
              type="text"
              placeholder="e.g. Virtual Reality Units"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="cat-input-group">
            <label>Contextual Description</label>
            <textarea
              placeholder="Provide a detailed log definition describing this category scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="cat-input-group">
            <label>Index Graphical Banner</label>
            <div className="cat-uploader-container">
              {preview && (
                <div className="cat-uploader-preview">
                  <img src={getImageSrc(preview)} alt="Visual preview node" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                id="cat-modal-file-input"
                onChange={handleImageChange}
                disabled={loading}
              />
              <label htmlFor="cat-modal-file-input" className="cat-file-trigger">
                {getImageSrc(preview) ? "Swap Media File" : "Upload Banner Matrix"}
              </label>
            </div>
          </div>

          <div className="cat-modal-buttons">
            <button
              type="button"
              className="cat-btn secondary"
              onClick={onClose}
              disabled={loading}
            >
              Dismiss
            </button>
            <button type="submit" className="cat-btn primary" disabled={loading}>
              {loading ? "Committing Database Records..." : category ? "Commit Updates" : "Save Definition"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;