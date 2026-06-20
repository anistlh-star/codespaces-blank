// src/pages/UserPages/Wishlist.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import API from "../../../api";
import { Link } from "react-router-dom";
import { imageHelper } from "../../utilis/imageHelper";

import "./Wishlist.css";

const Wishlist = () => {
  const { user } = useAuth();

  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    if (!user) return;

    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const res = await API.get("/wishlist");
        setWishlist(res.data.wishlist || { products: [] });
      } catch (err) {
        console.error("Failed to load wishlist:", err);
        setWishlist({ products: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [user]);

  const removeItem = async (productId) => {
    if (!productId) return;

    try {
      const res = await API.delete(`/wishlist/${productId}`);
      setWishlist(res.data.wishlist || { products: [] });
    } catch (err) {
      console.error("Failed to remove item:", err);
      alert("Failed to remove from wishlist");
    }
  };

  if (!user) {
    return <div className="loading-message">Please log in to view your wishlist</div>;
  }

  const products = wishlist.products || [];

  return (
    <div className="wishlist-page">
      <div className="page-header">
        <h1>My Wishlist ({products.length})</h1>

        <div className="header-controls">
          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <span>⊞</span>
            </button>
            <button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="List view"
            >
              <span>≡</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your wishlist...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">❤️</div>
          <h2>Your wishlist is empty</h2>
          <p>Start adding products you love!</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            className={`products-container ${viewMode}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {products.map((item) => {
              const product = item.product;

              if (!product || !product._id) return null;

              return (
                <motion.div
                  key={product._id}
                  className="product-card"
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="product-image-wrapper">
                    {Array.isArray(product.images) && product.images.length > 0 ? (
                      <img
                        src={imageHelper(product.images[0])}
                        alt={product.name}
                        className="product-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/300x300?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="no-image">No Image</div>
                    )}
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">
                      ${product.price?.toFixed(2) || "—"}
                    </p>

                    <div className="product-meta">
                      <span className="stock">
                        {product.stock > 0
                          ? `${product.stock} in stock`
                          : "Out of stock"}
                      </span>
                      <span className="category">
                        {product.category?.name || "—"}
                      </span>
                    </div>

                    <div className="product-actions">
                      <Link to={`/product/${product._id}`} className="btn-view">
                        View Details
                      </Link>
                      <button
                        className="btn-remove"
                        onClick={() => removeItem(product._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default Wishlist;