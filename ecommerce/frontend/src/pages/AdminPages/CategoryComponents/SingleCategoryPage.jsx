import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../../api/index.js";
import "./SingleCategoryPage.css";
import { getImageSrc } from "../../../components/imageHandler.js";

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
        setCategory(res.data?.category || res.data?.data || res.data);
      } catch (err) {
        setError("Failed to resolve individual catalog profile configuration metadata.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id]);

  if (loading) {
    return (
      <div className="cat-single-loading">
        <div className="single-spinner"></div>
      </div>
    );
  }

  if (error || !category) {
    return <div className="cat-single-error-state">{error || "Category reference not resolved."}</div>;
  }

  return (
    <div className="cat-single-layout-container animate-fade-view">
      <button className="cat-single-back-btn" onClick={() => navigate("/admin/category")}>
        ← Return to Directory
      </button>

      <div className="cat-single-surface-card">
        <div className="cat-single-hero">
          <img
            src={getImageSrc(category.image)}
            alt={category.name}
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80";
            }}
          />
        </div>

        <div className="cat-single-body-details">
          <h1>{category.name}</h1>
          <p className="cat-single-desc">
            {category.description || "No explicit descriptive records linked to this dynamic database element key."}
          </p>

          <div className="cat-single-meta-table">
            <div className="cat-meta-row">
              <span className="meta-label">Unique Identity Hash ID</span>
              <span className="meta-value system-hash">{category._id}</span>
            </div>
            <div className="cat-meta-row">
              <span className="meta-label">Created Time Index</span>
              <span className="meta-value">
                {category.createdAt ? new Date(category.createdAt).toLocaleString("en-US", { dateStyle: "medium" }) : "—"}
              </span>
            </div>
            <div className="cat-meta-row">
              <span className="meta-label">Last Synchronization Update</span>
              <span className="meta-value">
                {category.updatedAt ? new Date(category.updatedAt).toLocaleString("en-US", { dateStyle: "medium" }) : "—"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}