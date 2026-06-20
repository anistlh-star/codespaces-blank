//ecommerce/frontend/src/pages/AdminPages/CategoryComponents/SingleCategoryPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../../api/index.js";
import "../../../../styles/pages/AdminPages/CategoryComponents/SingleCategoryPage.css";
import { imageHelper } from "../../../utilis/imageHelper.js";

export default function SingleCategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await API.get(`/categories/${id}`);
        setCategory(res.data.category || res.data);
      } catch (err) {
        setError("Failed to load category details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!category) return <div className="not-found">Category not found</div>;

  return (
    <div className="single-category-page">
      <header className="page-header">
        <h1>{category.name}</h1>
        <button
          className="btn edit-btn"
          onClick={() => navigate(`/admin/category/update/${id}`)}
        >
          Edit Category
        </button>
      </header>

      <div className="category-details">
        {category.image ? (
          <div className="category-image">
            <img
              src={imageHelper(category.image)}
              alt={category.name}
              onError={(e) =>
                (e.target.src = "https://placehold.co/400x300?text=Image+Error")
              }
            />
          </div>
        ) : (
          <div className="no-image">No image available</div>
        )}

        <div className="info-section">
          <h2>Details</h2>
          <div className="detail-item">
            <span className="label">Name:</span>
            <span>{category.name}</span>
          </div>
          <div className="detail-item">
            <span className="label">Description:</span>
            <span>{category.description || "—"}</span>
          </div>
          <div className="detail-item">
            <span className="label">Created:</span>
            <span>{new Date(category.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="actions">
        <button
          className="btn back-btn"
          onClick={() => navigate("/admin/category")}
        >
          Back to List
        </button>
      </div>
    </div>
  );
}
