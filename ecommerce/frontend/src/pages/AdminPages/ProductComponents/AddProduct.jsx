//ecommerce/frontend/src/pages/AdminPages/ProductComponents/AddProduct.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../../api/index";
import "./AddProduct.css";
import { useCategories } from "../../../hooks/useCategories";

export default function AddProduct() {
  const navigate = useNavigate();
  const { categories } = useCategories();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    countryOfOrigin: "",
    images: [],
    releaseDate: "",
    specifications: [{ label: "", value: "" }],
  });

  const [countries] = useState([
    "United States", "China", "Germany", "Japan", "South Korea",
    "India", "Vietnam", "Taiwan", "Italy", "France", "United Kingdom",
    "Thailand", "Pakistan", "Turkey", "Indonesia", "Malaysia", "Brazil"
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
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
      specifications: prev.specifications.filter((_, i) => i !== index),
    }));
  };

  const handleSpecChange = (index, field, value) => {
    setFormData((prev) => {
      const newSpecs = [...prev.specifications];
      newSpecs[index][field] = value;
      return { ...prev, specifications: newSpecs };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.stock) {
      setError("Please fill all required fields (*)");
      setLoading(false);
      return;
    }

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("brand", formData.brand);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    submitData.append("category", formData.category);
    submitData.append("stock", formData.stock);
    submitData.append("countryOfOrigin", formData.countryOfOrigin);
    submitData.append("releaseDate", formData.releaseDate);

    // Multiple images
    formData.images.forEach((file) => {
      submitData.append("images", file);
    });

    // Specifications as JSON string
    submitData.append(
      "specifications",
      JSON.stringify(formData.specifications.filter(s => s.label.trim() && s.value.trim()))
    );

    try {
      const res = await API.post("/products/add", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setSuccess("✅ Product added successfully!");
        setTimeout(() => navigate("/my-products"), 1500);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-page">
      <h1 className="add-product-title">Add New Product</h1>

      {error && <div className="add-product-error">{error}</div>}
      {success && <div className="add-product-success">{success}</div>}

      <form onSubmit={handleSubmit} className="add-product-form">
        {/* Product Name */}
        <div className="add-product-form-group">
          <label className="add-product-label">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="add-product-input"
            required
          />
        </div>

        {/* Brand */}
        <div className="add-product-form-group">
          <label className="add-product-label">Brand</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="add-product-input"
          />
        </div>

        {/* Description */}
        <div className="add-product-form-group">
          <label className="add-product-label">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="add-product-textarea"
            required
          />
        </div>

        {/* Price & Stock */}
        <div className="add-product-form-row">
          <div className="add-product-form-group half">
            <label className="add-product-label">Price ($) *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="add-product-input"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="add-product-form-group half">
            <label className="add-product-label">Stock *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="add-product-input"
              min="0"
              required
            />
          </div>
        </div>

        {/* Category & Country */}
        <div className="add-product-form-row">
          <div className="add-product-form-group half">
            <label className="add-product-label">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="add-product-select"
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

          <div className="add-product-form-group half">
            <label className="add-product-label">Country of Origin</label>
            <select
              name="countryOfOrigin"
              value={formData.countryOfOrigin}
              onChange={handleChange}
              className="add-product-select"
            >
              <option value="">Select Country</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Release Date */}
        <div className="add-product-form-group">
          <label className="add-product-label">Release Date</label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            className="add-product-input"
          />
        </div>

        {/* Multiple Images */}
        <div className="add-product-form-group">
          <label className="add-product-label">Product Images (Multiple allowed)</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="add-product-file-input"
          />
          {formData.images.length > 0 && (
            <div className="add-product-image-preview">
              Selected: {formData.images.length} file(s)
            </div>
          )}
        </div>

        {/* Specifications */}
        <div className="add-product-specs-container">
          <h2 className="add-product-spec-title">Specifications</h2>

          {formData.specifications.map((spec, index) => (
            <div key={index} className="add-product-spec-row">
              <input
                type="text"
                placeholder="Label (e.g. Color)"
                value={spec.label}
                onChange={(e) => handleSpecChange(index, "label", e.target.value)}
                className="add-product-input add-product-spec-input"
              />
              <input
                type="text"
                placeholder="Value (e.g. Black)"
                value={spec.value}
                onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                className="add-product-input add-product-spec-input"
              />
              <button
                type="button"
                onClick={() => removeSpecification(index)}
                className="add-product-spec-remove-btn"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSpecification}
            className="add-product-add-spec-btn"
          >
            + Add Specification
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="add-product-submit-btn"
        >
          {loading ? "Creating Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}