// src/pages/AdminPages/AddEditProduct.jsx  (or wherever you want to place it)
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import API from "../../../api";
import { MdDeleteForever } from "react-icons/md";

import "./AddEditProduct.css";
import { useCategories } from "../../hooks/useCategories";
import { useCountries } from "../../hooks/useCountries";

const AddEditProduct = () => {
  const { user } = useAuth();
  const { id: productId } = useParams(); // for edit mode
  const navigate = useNavigate();

  const isEditMode = !!productId;

  // ── Form state ───────────────────────────────────────────────
  const [formData, setFormData] = useState({
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
    specifications: [], // array of { label, value }
    stockStatus: "in-stock",
  });

  const [images, setImages] = useState([]); // new uploads
  const [existingImages, setExistingImages] = useState([]); // for edit
  const { categories } = useCategories();
  const {countries} = useCountries()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── Fetch product for edit ───────────────────────────────────
  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const res = await API.get(`/products/${productId}`);
          const product = res.data.product || res.data;

          setFormData({
            name: product.name || "",
            description: product.description || "",
            price: product.price || 0,
            salePrice: product.salePrice || null,
            discountPercentage: product.discountPercentage || null,
            stock: product.stock || 0,
            featured: product.featured || false,
            onSale: product.onSale || false,
            brand: product.brand || "",
            category: product.category?._id || "",
            countryOfOrigin: product.countryOfOrigin || "",
            releaseDate: product.releaseDate
              ? new Date(product.releaseDate).toISOString().split("T")[0]
              : "",
            specifications: product.specifications || [],
            stockStatus: product.stockStatus || "in-stock",
          });

          setExistingImages(product.images || []);
        } catch (err) {
          setError("Failed to load product details");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [productId, isEditMode]);

  // ── Handle input changes ─────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ── Handle spec changes ──────────────────────────────────────
  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const addSpec = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { label: "", value: "" }],
    }));
  };

  const removeSpec = (index) => {
    const newSpecs = formData.specifications.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  // ── Handle image uploads ─────────────────────────────────────
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index, isExisting = false) => {
    if (isExisting) {
      const newExisting = existingImages.filter((_, i) => i !== index);
      setExistingImages(newExisting);
    } else {
      const newImages = images.filter((_, i) => i !== index);
      setImages(newImages);
    }
  };

  // ── Submit form ──────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const form = new FormData();

    // Append all text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "specifications") {
        form.append(key, JSON.stringify(value));
      } else if (value !== null && value !== "") {
        form.append(key, value);
      }
    });

    // Append new images
    images.forEach((file) => {
      form.append("images", file);
    });

    // For edit: append existing images to keep (as array of URLs)
    if (isEditMode) {
      form.append("existingImages", JSON.stringify(existingImages));
    }

    try {
      let res;
      if (isEditMode) {
        res = await API.put(`/products/${productId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        res = await API.post("/products/add", form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSuccess(res.data.message || "Product saved successfully!");
      setTimeout(() => navigate("/my-products"), 2000); // redirect after success
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || (user.role !== "admin" && user.role !== "user" && user.role !== "Admin")) {
    // or 'seller' if you have that
    return <div className="error-message">Access denied</div>;
  }

  return (
    <motion.div
      className="add-edit-product-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>{isEditMode ? "Edit Product" : "Add New Product"}</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit} className="product-form">
        {/* Basic Info */}
        <section className="form-section">
          <h2>Basic Information</h2>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              required
            />
          </div>

          <div className="form-group">
            <label>Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Pricing & Stock */}
        <section className="form-section">
          <h2>Pricing & Stock</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min={0}
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Sale Price</label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice || ""}
                onChange={handleChange}
                min={0}
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>Discount %</label>
              <input
                type="number"
                name="discountPercentage"
                value={formData.discountPercentage || ""}
                onChange={handleChange}
                min={0}
                max={100}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Stock Quantity *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min={0}
                required
              />
            </div>

            <div className="form-group">
              <label>Stock Status *</label>
              <select
                name="stockStatus"
                value={formData.stockStatus}
                onChange={handleChange}
                required
              >
                <option value="in-stock">In Stock</option>
                <option value="unavailable">Unavailable</option>
                <option value="to-be-announced">To Be Announced</option>
              </select>
            </div>
          </div>

          <div className="form-checkboxes">
            <label>
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              Featured
            </label>

            <label>
              <input
                type="checkbox"
                name="onSale"
                checked={formData.onSale}
                onChange={handleChange}
              />
              On Sale
            </label>
          </div>
        </section>

        {/* Images */}
        <section className="form-section">
          <h2>Images *</h2>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="file-input"
          />

          <div className="image-preview">
            {/* Existing images (edit mode) */}
            {existingImages.map((url, index) => (
              <div key={`existing-${index}`} className="image-item">
                <img src={url} alt="Existing" />
                <button type="button" onClick={() => removeImage(index, true)}>
                 <MdDeleteForever />
                </button>
              </div>
            ))}

            {/* New uploads preview */}
            {images.map((file, index) => (
              <div key={`new-${index}`} className="image-item">
                <img src={URL.createObjectURL(file)} alt="Preview" />
                <button type="button" onClick={() => removeImage(index)}>
                 <MdDeleteForever />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Specifications */}
        <section className="form-section">
          <h2>Specifications</h2>
          {formData.specifications.map((spec, index) => (
            <div key={index} className="spec-row">
              <input
                type="text"
                placeholder="Label (e.g. Color)"
                value={spec.label}
                onChange={(e) =>
                  handleSpecChange(index, "label", e.target.value)
                }
                required
              />
              <input
                type="text"
                placeholder="Value (e.g. Red)"
                value={spec.value}
                onChange={(e) =>
                  handleSpecChange(index, "value", e.target.value)
                }
                required
              />
              <button type="button" onClick={() => removeSpec(index)}>
                Remove
              </button>
            </div>
          ))}

          <button type="button" className="btn-add-spec" onClick={addSpec}>
            + Add Specification
          </button>
        </section>

        {/* Additional */}
        <section className="form-section">
          <h2>Additional</h2>
          <div className="form-group">
            <label>Country of Origin</label>
            <select
              name="countryOfOrigin"
              value={formData.countryOfOrigin}
              onChange={handleChange}
            >
              <option value="">Select Country</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Release Date</label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
            />
          </div>
        </section>

        <div className="form-actions">
          <button type="submit" className="btn-save" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditMode
                ? "Update Product"
                : "Add Product"}
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/my-products")}
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddEditProduct;
