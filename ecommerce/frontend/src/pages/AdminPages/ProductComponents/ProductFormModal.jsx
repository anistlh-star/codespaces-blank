// ecommerce/frontend/src/pages/AdminPages/ProductComponents/ProductFormModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../../context/AuthContext";
import API from "../../../../api";
import { MdDeleteForever, MdAdd, MdClose } from "react-icons/md";
import { useCategories } from "../../../hooks/useCategories";
import { useCountries } from "../../../hooks/useCountries";
import "./ProductFormModal.css";

const ProductFormModal = ({ isOpen, onClose, productId, onRefresh }) => {
  const { user } = useAuth();
  const isEditMode = !!productId;

  const initialFormState = {
    name: "",
    description: "",
    price: 0,
    salePrice: null,
    discountPercentage: null,
    stock: 0,
    featured: false,
    onSale: false,
    brand: "",
    category: "",
    countryOfOrigin: "",
    releaseDate: "",
    specifications: [],
    stockStatus: "in-stock",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const { categories } = useCategories();
  const { countries } = useCountries();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Manage state clearing or fetching when modal open state transitions
  useEffect(() => {
    if (!isOpen) return;

    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          setError("");
          // Note: matching your admin routes from ProductList
          const res = await API.get(`/admin/products/${productId}`);
          const product = res.data.product || res.data.data || res.data;

          setFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price || 0,
            salePrice: product.salePrice ?? null,
            discountPercentage: product.discountPercentage ?? null,
            stock: product.stock || 0,
            featured: product.featured || false,
            onSale: product.onSale || false,
            brand: product.brand || "",
            category: product.category?._id || product.category || "",
            countryOfOrigin: product.countryOfOrigin || "",
            releaseDate: product.releaseDate ? new Date(product.releaseDate).toISOString().split("T")[0] : "",
            specifications: product.specifications || [],
            stockStatus: product.stockStatus || "in-stock",
          });
          setExistingImages(product.images || []);
        } catch (err) {
          setError("Failed to load product configurations.");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      // Clear form states completely for fresh creation entries
      setFormData(initialFormState);
      setImages([]);
      setExistingImages([]);
      setError("");
      setSuccess("");
    }
  }, [productId, isEditMode, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }],
    }));
  };

  const removeSpecification = (index) => {
    setFormData((prev) => ({
      ...prev,
      specifications: prev.specifications.filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "specifications") {
        form.append(key, JSON.stringify(value));
      } else if (value !== null && value !== "") {
        form.append(key, value);
      }
    });

    images.forEach((file) => form.append("images", file));
    if (isEditMode) {
      form.append("existingImages", JSON.stringify(existingImages));
    }

    try {
      let res = isEditMode
        ? await API.put(`/admin/products/${productId}`, form, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await API.post("/admin/products/add", form, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      setSuccess(res.data.message || "Parameters committed successfully.");
      
      // Fire page metrics refresh hook
      if (onRefresh) onRefresh();
      
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to commit record updates.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (!user || !["admin", "user", "Admin"].includes(user.role)) {
    return (
      <div className="product-modal-overlay" onClick={onClose}>
        <div className="product-modal-container" onClick={(e) => e.stopPropagation()}>
          <div className="ecom-form-error-fallback">Access Matrix Denied</div>
          <button className="ecom-action-btn cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="product-modal-overlay" onClick={onClose}>
        <motion.div
          className="product-modal-container"
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="product-modal-close-btn" onClick={onClose} aria-label="Close Modal">
            <MdClose size={24} />
          </button>

          <header className="product-modal-header">
            <h1>{isEditMode ? "Modify the Product" : "Add a New Product"}</h1>
            <p>Fill out parameters below to submit updates to your storefront storage layer.</p>
          </header>

          {error && <div className="ecom-notification-banner error">{error}</div>}
          {success && <div className="ecom-notification-banner success">{success}</div>}

          <form onSubmit={handleSubmit} className="ecom-interactive-form">
            {/* SECTION 1: Core Parameters */}
            <section className="ecom-form-segment">
              <h2>Product details</h2>
              <div className="ecom-input-field-block">
                <label>Product Name*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="ecom-input-field-block">
                <label>Product Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  required
                />
              </div>
              <div className="ecom-input-grid-row">
                <div className="ecom-input-field-block">
                  <label>Manufacturer Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                  />
                </div>
                <div className="ecom-input-field-block">
                  <label>Select Category*</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose Class</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* SECTION 2: Price and Stock */}
            <section className="ecom-form-segment">
              <h2>Price and Stock</h2>
              <div className="ecom-input-grid-row tri">
                <div className="ecom-input-field-block">
                  <label>Base Value Price ($)*</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    required
                  />
                </div>
                <div className="ecom-input-field-block">
                  <label>Markdown Offer Price ($)</label>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice || ""}
                    onChange={handleChange}
                    step="0.01"
                  />
                </div>
                <div className="ecom-input-field-block">
                  <label>Percentage Cut %</label>
                  <input
                    type="number"
                    name="discountPercentage"
                    value={formData.discountPercentage || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="ecom-input-grid-row">
                <div className="ecom-input-field-block">
                  <label>Stock Count*</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="ecom-input-field-block">
                  <label>Availability Status *</label>
                  <select
                    name="stockStatus"
                    value={formData.stockStatus}
                    onChange={handleChange}
                    required
                  >
                    <option value="in-stock">In Stock / Deliverable</option>
                    <option value="unavailable">Unavailable / Backordered</option>
                    <option value="to-be-announced">To Be Announced</option>
                  </select>
                </div>
              </div>

              <div className="ecom-checkbox-container-row">
                <label className="ecom-interactive-checkbox-label">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  <span>Promote as Featured Product</span>
                </label>
                <label className="ecom-interactive-checkbox-label">
                  <input
                    type="checkbox"
                    name="onSale"
                    checked={formData.onSale}
                    onChange={handleChange}
                  />
                  <span>Mark as Active Promotional Sale</span>
                </label>
              </div>
            </section>

            {/* SECTION 3: Logistics & Lifecycle */}
            <section className="ecom-form-segment">
              <h2>Logistics & Lifecycle</h2>
              <div className="ecom-input-grid-row">
                <div className="ecom-input-field-block">
                  <label>Country of Origin</label>
                  <select
                    name="countryOfOrigin"
                    value={formData.countryOfOrigin}
                    onChange={handleChange}
                  >
                    <option value="">Choose Country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ecom-input-field-block">
                  <label>Release Date</label>
                  <input
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            {/* SECTION 4: Technical Specifications */}
            <section className="ecom-form-segment">
              <div className="ecom-segment-header-actions">
                <h2>Technical Specifications</h2>
                <button
                  type="button"
                  className="ecom-secondary-action-btn"
                  onClick={addSpecification}
                >
                  <MdAdd size={18} /> Add Specs
                </button>
              </div>

              {formData.specifications.length === 0 ? (
                <p className="ecom-empty-placeholder-text">
                  No custom attributes declared for this model record yet.
                </p>
              ) : (
                <div className="ecom-dynamic-specs-list">
                  {formData.specifications.map((spec, index) => (
                    <div key={index} className="ecom-spec-input-row">
                      <div className="ecom-input-field-block">
                        <input
                          type="text"
                          placeholder="Label (e.g. Material)"
                          value={spec.label}
                          onChange={(e) => handleSpecChange(index, "label", e.target.value)}
                          required
                        />
                      </div>
                      <div className="ecom-input-field-block">
                        <input
                          type="text"
                          placeholder="Value (e.g. Stainless Steel)"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                          required
                        />
                      </div>
                      <button
                        type="button"
                        className="ecom-spec-delete-btn"
                        onClick={() => removeSpecification(index)}
                        title="Delete specification entry"
                      >
                        <MdDeleteForever size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* SECTION 5: Images */}
            <section className="ecom-form-segment">
              <h2>Upload Images</h2>
              <div className="ecom-upload-dragzone">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages([...images, ...Array.from(e.target.files)])}
                />
                <p>Click to bind digital assets or drop files locally</p>
              </div>
              <div className="ecom-media-preview-strip">
                {existingImages.map((url, i) => (
                  <div key={`exist-${i}`} className="ecom-media-item-card">
                    <img src={url} alt="Server asset" />
                    <button
                      type="button"
                      onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))}
                    >
                      <MdDeleteForever />
                    </button>
                  </div>
                ))}
                {images.map((file, i) => (
                  <div key={`new-${i}`} className="ecom-media-item-card">
                    <img src={URL.createObjectURL(file)} alt="Local buffer" />
                    <button
                      type="button"
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    >
                      <MdDeleteForever />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <div className="ecom-form-commit-footer">
              <button
                type="button"
                className="ecom-action-btn cancel"
                onClick={onClose}
                disabled={loading}
              >
                Discard
              </button>
              <button type="submit" className="ecom-action-btn commit" disabled={loading}>
                {loading ? "Processing..." : isEditMode ? "Apply Changes" : "Add Product"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductFormModal;