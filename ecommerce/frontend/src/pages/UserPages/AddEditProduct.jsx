// src/pages/AdminPages/AddEditProduct.jsx
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
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!productId;

  const [formData, setFormData] = useState({
    name: "", description: "", price: 0, salePrice: null,
    discountPercentage: null, stock: 0, featured: false, onSale: false,
    brand: "", category: "", countryOfOrigin: "", releaseDate: "",
    specifications: [], stockStatus: "in-stock",
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const { categories } = useCategories();
  const { countries } = useCountries();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const res = await API.get(`/products/${productId}`);
          console.log("Fetched product data:", res);
          const product = res.data.data || res.data;

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
    }
  }, [productId, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSpecChange = (index, field, value) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData((prev) => ({ ...prev, specifications: newSpecs }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess(""); setLoading(true);
    const form = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "specifications") form.append(key, JSON.stringify(value));
      else if (value !== null && value !== "") form.append(key, value);
    });

    images.forEach((file) => form.append("images", file));
    if (isEditMode) form.append("existingImages", JSON.stringify(existingImages));

    try {
      let res = isEditMode 
        ? await API.put(`/products/${productId}`, form, { headers: { "Content-Type": "multipart/form-data" } })
        : await API.post("/products/add", form, { headers: { "Content-Type": "multipart/form-data" } });

      setSuccess(res.data.message || "Parameters committed successfully.");
      setTimeout(() => navigate("/my-products"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to commit record updates.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || !["admin", "user", "Admin"].includes(user.role)) {
    return <div className="ecom-form-error-fallback">Access Matrix Denied</div>;
  }

  return (
    <motion.div className="ecom-form-container-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>{isEditMode ? "Modify Ledger Resource" : "Register Inventory Node"}</h1>
      {error && <div className="ecom-notification-banner error">{error}</div>}
      {success && <div className="ecom-notification-banner success">{success}</div>}

      <form onSubmit={handleSubmit} className="ecom-interactive-form">
        <section className="ecom-form-segment">
          <h2>Core Parameters</h2>
          <div className="ecom-input-field-block">
            <label>Product Designation Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="ecom-input-field-block">
            <label>Public Index Narrative Description *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={5} required />
          </div>
          <div className="ecom-input-grid-row">
            <div className="ecom-input-field-block">
              <label>Manufacturer Brand Identifier</label>
              <input type="text" name="brand" value={formData.brand} onChange={handleChange} />
            </div>
            <div className="ecom-input-field-block">
              <label>System Categorization Category *</label>
              <select name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Choose Class</option>
                {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="ecom-form-segment">
          <h2>Financials & Volume</h2>
          <div className="ecom-input-grid-row tri">
            <div className="ecom-input-field-block"><label>Base Value Price *</label><input type="number" name="price" value={formData.price} onChange={handleChange} step="0.01" required /></div>
            <div className="ecom-input-field-block"><label>Markdown Offer Price</label><input type="number" name="salePrice" value={formData.salePrice || ""} onChange={handleChange} step="0.01" /></div>
            <div className="ecom-input-field-block"><label>Percentage Cut %</label><input type="number" name="discountPercentage" value={formData.discountPercentage || ""} onChange={handleChange} /></div>
          </div>
          <div className="ecom-input-grid-row">
            <div className="ecom-input-field-block"><label>Available Reserve Stock *</label><input type="number" name="stock" value={formData.stock} onChange={handleChange} required /></div>
            <div className="ecom-input-field-block">
              <label>Availability Profile Status *</label>
              <select name="stockStatus" value={formData.stockStatus} onChange={handleChange} required>
                <option value="in-stock">In Stock / Deliverable</option>
                <option value="unavailable">Unavailable / Backordered</option>
              </select>
            </div>
          </div>
        </section>

        <section className="ecom-form-segment">
          <h2>Visual Asset Attachments</h2>
          <div className="ecom-upload-dragzone">
            <input type="file" multiple accept="image/*" onChange={(e) => setImages([...images, ...Array.from(e.target.files)])} />
            <p>Click to bind digital assets or drop files locally</p>
          </div>
          <div className="ecom-media-preview-strip">
            {existingImages.map((url, i) => (
              <div key={`exist-${i}`} className="ecom-media-item-card">
                <img src={url} alt="Server asset" />
                <button type="button" onClick={() => setExistingImages(existingImages.filter((_, idx) => idx !== i))}><MdDeleteForever /></button>
              </div>
            ))}
            {images.map((file, i) => (
              <div key={`new-${i}`} className="ecom-media-item-card">
                <img src={URL.createObjectURL(file)} alt="Local buffer" />
                <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))}><MdDeleteForever /></button>
              </div>
            ))}
          </div>
        </section>

        <div className="ecom-form-commit-footer">
          <button type="button" className="ecom-action-btn cancel" onClick={() => navigate("/my-products")}>Discard</button>
          <button type="submit" className="ecom-action-btn commit" disabled={loading}>{loading ? "Processing..." : isEditMode ? "Apply Changes" : "Deploy Asset"}</button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddEditProduct;