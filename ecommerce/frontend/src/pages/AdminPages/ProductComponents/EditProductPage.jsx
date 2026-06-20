//ecommerce/frontend/src/pages/AdminPages/ProductComponents/EditProductPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../../api/index.js";
import "./EditProductPage.css";
import { useCategories } from "../../../hooks/useCategories.js";
import { useCountries } from "../../../hooks/useCountries.js";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
const {countries} = useCountries()
  const { categories, loading: loadingCategories } = useCategories();

  const [form, setForm] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    countryOfOrigin: "",
    releaseDate: "",
    specifications: [],
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/admin/products/${id}`);
      const p = res.data.product || res.data;

      setForm({
        name: p.name || "",
        brand: p.brand || "",
        description: p.description || "",
        price: p.price?.toString() || "",
        stock: p.stock?.toString() || "",
        category: p.category?._id || p.category || "",
        countryOfOrigin: p.countryOfOrigin || "",
        releaseDate: p.releaseDate
          ? new Date(p.releaseDate).toISOString().split("T")[0]
          : "",
        specifications: p.specifications || [],
      });

      const imageUrls = (p.images || []).map((img) => `/images/${img}`);
      setExistingImages(p.images || []);
      setPreviews(imageUrls);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load product" });
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(files);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews); // Show only new previews when uploading
  };

  const addSpecification = () => {
    setForm((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }],
    }));
  };

  const removeSpecification = (index) => {
    setForm((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleSpecChange = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.specifications];
      updated[index][field] = value;
      return { ...prev, specifications: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      setMessage({ type: "error", text: "Name, Price and Category are required" });
      return;
    }

    setSaving(true);
    setMessage({ type: "", text: "" });

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("brand", form.brand);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category", form.category);
    formData.append("countryOfOrigin", form.countryOfOrigin);
    formData.append("releaseDate", form.releaseDate);

    // Specifications
    formData.append(
      "specifications",
      JSON.stringify(form.specifications.filter((s) => s.label && s.value))
    );

    // New images (replace existing)
    newFiles.forEach((file) => formData.append("images", file));

    try {
      await API.put(`/admin/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ type: "success", text: "Product updated successfully!" });
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to update product",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="admin-edit-product-loading">Loading product...</div>;

  return (
    <div className="admin-edit-product-page">
      <h1 className="admin-edit-product-title">Edit Product</h1>

      {message.text && (
        <div className={`admin-edit-product-message admin-edit-product-message--${message.type}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-edit-product-form">
        <div className="admin-edit-product-grid">
          {/* Name */}
          <div className="admin-edit-product-group">
            <label className="admin-edit-product-label">Product Name *</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleTextChange}
              className="admin-edit-product-input"
              required
            />
          </div>

          {/* Brand */}
          <div className="admin-edit-product-group">
            <label className="admin-edit-product-label">Brand</label>
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleTextChange}
              className="admin-edit-product-input"
            />
          </div>

          {/* Price & Stock */}
          <div className="admin-edit-product-group">
            <label className="admin-edit-product-label">Price ($) *</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleTextChange}
              className="admin-edit-product-input"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="admin-edit-product-group">
            <label className="admin-edit-product-label">Stock *</label>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleTextChange}
              className="admin-edit-product-input"
              min="0"
              required
            />
          </div>

          {/* Category & Country */}
          <div className="admin-edit-product-group">
            <label className="admin-edit-product-label">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleTextChange}
              className="admin-edit-product-select"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name || cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-edit-product-group">
            <label className="admin-edit-product-label">Country of Origin</label>
            <select
              name="countryOfOrigin"
              value={form.countryOfOrigin}
              onChange={handleTextChange}
              className="admin-edit-product-select"
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="admin-edit-product-group">
          <label className="admin-edit-product-label">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleTextChange}
            className="admin-edit-product-textarea"
            rows="5"
          />
        </div>

        {/* Release Date */}
        <div className="admin-edit-product-group">
          <label className="admin-edit-product-label">Release Date</label>
          <input
            type="date"
            name="releaseDate"
            value={form.releaseDate}
            onChange={handleTextChange}
            className="admin-edit-product-input"
          />
        </div>

        {/* Images */}
        <div className="admin-edit-product-group">
          <label className="admin-edit-product-label">
            Product Images (New files will replace old ones)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFilesChange}
            className="admin-edit-product-file-input"
          />

          {/* Previews */}
          {previews.length > 0 && (
            <div className="admin-edit-product-preview-grid">
              {previews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Preview ${i}`}
                  className="admin-edit-product-preview-img"
                />
              ))}
            </div>
          )}
        </div>

        {/* Specifications */}
        <div className="admin-edit-product-specs">
          <h3 className="admin-edit-product-spec-title">Specifications</h3>
          {form.specifications.map((spec, index) => (
            <div key={index} className="admin-edit-product-spec-row">
              <input
                type="text"
                placeholder="Label"
                value={spec.label}
                onChange={(e) => handleSpecChange(index, "label", e.target.value)}
                className="admin-edit-product-input"
              />
              <input
                type="text"
                placeholder="Value"
                value={spec.value}
                onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                className="admin-edit-product-input"
              />
              <button
                type="button"
                onClick={() => removeSpecification(index)}
                className="admin-edit-product-spec-remove"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSpecification}
            className="admin-edit-product-spec-add"
          >
            + Add Specification
          </button>
        </div>

        <div className="admin-edit-product-actions">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="admin-edit-product-btn admin-edit-product-btn-cancel"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="admin-edit-product-btn admin-edit-product-btn-save"
          >
            {saving ? "Saving Changes..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  );
}