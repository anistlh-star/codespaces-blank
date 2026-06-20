//ecommerce/frontend/src/pages/AdminPages/CategoryComponents/CategoryPage.jsx
import { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../../../api/index.js";
import "../../../../styles/pages/AdminPages/CategoryComponents/CategoryPage.css";
import { imageHelper } from "../../../utilis/imageHelper.js";
import { useCategories } from "../../../hooks/useCategories.js";
export default function CategoryPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { categories } = useCategories();
  // Memoized fetch function

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setMessage("Category name is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (description.trim()) formData.append("description", description);
      if (image) formData.append("image", image);

      await API.post("/categories/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Category created successfully");
      setName("");
      setDescription("");
      setImage(null);
      setPreview(null);
      fetchCategories();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      await API.delete(`/categories/${id}`);
      setMessage("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      setMessage("Failed to delete category");
      console.error(error);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/category/update/${id}`);
  };

  return (
    <div className="category-page">
      <header className="category-page__header">
        <h1 className="category-page__title">Categories</h1>
      </header>

      {message && (
        <div
          className={`category-page__toast ${
            message.toLowerCase().includes("success") ? "success" : "error"
          }`}
        >
          {message}
        </div>
      )}

      <div className="category-page__grid">
        {/* Create Form - Left side */}
        <section className="category-page__form-section">
          <div className="category-page__card">
            <h2 className="category-page__card-title">Add New Category</h2>

            <form onSubmit={handleSubmit} className="category-page__form">
              <div className="category-page__form-group">
                <label className="category-page__label">Category Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wooden Watches"
                  required
                  className="category-page__input"
                />
              </div>

              <div className="category-page__form-group">
                <label className="category-page__label">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description..."
                  rows={3}
                  className="category-page__textarea"
                />
              </div>

              <div className="category-page__form-group">
                <label className="category-page__label">Category Image</label>
                <div className="category-page__file-wrapper">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="category-image"
                    className="category-page__file-input"
                  />
                  <label
                    htmlFor="category-image"
                    className="category-page__file-label"
                  >
                    {image ? "Change Image" : "Choose Image"}
                  </label>
                </div>

                {preview && (
                  <div className="category-page__preview">
                    <img
                      src={preview}
                      alt="Preview"
                      className="category-page__preview-img"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="category-page__btn category-page__btn--primary"
              >
                {loading ? "Creating..." : "Create Category"}
              </button>
            </form>
          </div>
        </section>

        {/* Categories List - Right side */}
        <section className="category-page__list-section">
          <h2 className="category-page__list-title">
            All Categories <span>({categories.length})</span>
          </h2>

          {categories.length === 0 ? (
            <div className="category-page__empty">No categories found</div>
          ) : (
            <div className="category-page__grid-cards">
              {categories.map((cat) => (
                <div key={cat._id} className="category-page__card-item">
                  <div className="category-page__card-image">
                    <img
                      src={imageHelper(cat.image)}
                      alt={cat.name}
                      onError={(e) => {
                        e.target.src =
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROJGo_BDmE1BQXej-UemTXxZG6RkDsA95ZnA&s";
                      }}
                    />
                  </div>

                  <div className="category-page__card-content">
                    <h3 className="category-page__card-name">
                      <Link to={`/admin/category/${cat._id}`}>
                        {cat.categoryName}
                      </Link>
                    </h3>
                    <p className="category-page__card-desc">
                      {cat.description || "No description"}
                    </p>

                    <div className="category-page__card-actions">
                      <button
                        onClick={() => handleEdit(cat._id)}
                        className="category-page__btn category-page__btn--edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="category-page__btn category-page__btn--delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
