// src/pages/UserPages/MyProducts.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import API from "../../../api";
import { Link } from "react-router-dom";

import "./MyProducts.css";
import { imageHelper } from "../../utilis/imageHelper";

const ITEMS_PER_PAGE_OPTIONS = [8, 12, 20];

const MyProducts = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    if (!user?._id) return;

    let ignore = false;

    const loadProducts = async () => {
      try {
        setLoading(true);

        // Map frontend sortBy values to backend-compatible ones
        let backendSortBy = "createdAt";
        let backendSortOrder = "desc";

        switch (sortBy) {
          case "price-low":
            backendSortBy = "price";
            backendSortOrder = "asc";
            break;
          case "price-high":
            backendSortBy = "price";
            backendSortOrder = "desc";
            break;
          case "rating-high":
            backendSortBy = "rating";
            backendSortOrder = "desc";
            break;
          case "oldest":
            backendSortBy = "createdAt";
            backendSortOrder = "asc";
            break;
          case "newest":
          default:
            backendSortBy = "createdAt";
            backendSortOrder = "desc";
            break;
        }

        const res = await API.get("/users/my-products", {
          params: {
            sortBy: backendSortBy,
            sortOrder: backendSortOrder,
          },
        });
        console.log("Fetched products:", res);

        if (!ignore) {
          setProducts(res.data.data.products || []);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error("Failed to load products:", err);
        if (!ignore) setProducts([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [user?._id, sortBy]);

  // ── Pagination logic ─────────────────────────────────────────
  const totalItems = products.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  if (!user) {
    return <div className="loading-message">Please log in to view your products</div>;
  }

  return (
    <div className="my-products-page">
      <div className="page-header">
        <h1>My Products ({totalItems})</h1>

        <div className="header-right">
          <div className="pagination-controls">
            <label>Show:</label>
            <select value={itemsPerPage} onChange={handlePerPageChange}>
              {ITEMS_PER_PAGE_OPTIONS.map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="sort-controls">
            <label>Sort by:</label>
            <select value={sortBy} onChange={handleSortChange}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating-high">Highest rated</option>
            </select>
          </div>

          <div className="view-controls">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <span className="icon">⊞</span>
            </button>
            <button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              title="List view"
            >
              <span className="icon">≡</span>
            </button>
          </div>

          <Link to="/add-product" className="btn-add">
            + Add Product
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading your products...</p>
        </div>
      ) : totalItems === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No products yet</h2>
          <p>You haven't listed any products.</p>
          <Link to="/add-product" className="btn-primary">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewMode}-${currentPage}-${sortBy}`}
              className={`products-container ${viewMode}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {currentProducts.map((product) => (
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
                        View
                      </Link>
                      <Link to={`/edit-product/${product._id}`} className="btn-edit">
                        Edit
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>

              <div className="page-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`page-number ${page === currentPage ? "active" : ""}`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className="page-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyProducts;