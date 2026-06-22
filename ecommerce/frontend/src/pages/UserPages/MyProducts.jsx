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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    if (!user?._id) return;
    let ignore = false;

    const loadProducts = async () => {
      try {
        setLoading(true);
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
          params: { sortBy: backendSortBy, sortOrder: backendSortOrder },
        });

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
    return () => { ignore = true; };
  }, [user?._id, sortBy]);

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

  if (!user) {
    return <div className="ecom-auth-fallback">Please log in to view your dashboard profile.</div>;
  }

  return (
    <div className="ecom-dashboard-view">
      <div className="ecom-dashboard-header">
        <div className="ecom-header-title-block">
          <h1>My Inventory</h1>
          <span className="ecom-counter-badge">{totalItems} Products</span>
        </div>

        <div className="ecom-header-actions">
          <div className="ecom-control-pill-group">
            <div className="ecom-select-wrapper">
              <span>Show:</span>
              <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                {ITEMS_PER_PAGE_OPTIONS.map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div className="ecom-select-wrapper">
              <span>Sort:</span>
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating-high">Highest rated</option>
              </select>
            </div>
          </div>

          <div className="ecom-view-toggle-pill">
            <button className={`ecom-toggle-btn ${viewMode === "grid" ? "is-active" : ""}`} onClick={() => setViewMode("grid")}>⊞</button>
            <button className={`ecom-toggle-btn ${viewMode === "list" ? "is-active" : ""}`} onClick={() => setViewMode("list")}>≡</button>
          </div>

          <Link to="/add-product" className="ecom-btn-primary-action">+ Add Product</Link>
        </div>
      </div>

      {loading ? (
        <div className="ecom-loader-wrapper">
          <div className="ecom-loader-spinner"></div>
          <p>Analyzing product records...</p>
        </div>
      ) : totalItems === 0 ? (
        <div className="ecom-blankslate-container">
          <div className="ecom-blankslate-icon">📦</div>
          <h2>No inventory records discovered</h2>
          <p>Get started by listing your first commercial asset.</p>
          <Link to="/add-product" className="ecom-btn-primary-action">Create First Listing</Link>
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewMode}-${currentPage}-${sortBy}`}
              className={`ecom-products-matrix ${viewMode}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {currentProducts.map((product) => (
                <motion.div key={product._id} className="ecom-product-card-node" layout>
                  <div className="ecom-card-media-frame">
                    {Array.isArray(product.images) && product.images.length > 0 ? (
                      <img
                        src={imageHelper(product.images[0])}
                        alt={product.name}
                        className="ecom-card-img"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x400?text=No+Preview"; }}
                      />
                    ) : (
                      <div className="ecom-card-img-placeholder">No Image Available</div>
                    )}
                  </div>

                  <div className="ecom-card-body-content">
                    <div className="ecom-card-structural-details">
                      <span className="ecom-card-tag-category">{product.category?.name || "Uncategorized"}</span>
                      <h3 className="ecom-card-title-text">{product.name}</h3>
                      <p className="ecom-card-currency-price">${product.price?.toFixed(2) || "0.00"}</p>
                    </div>

                    <div className="ecom-card-status-strip">
                      <span className={`ecom-stock-indicator ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                        {product.stock > 0 ? `${product.stock} Units Available` : "Sold Out"}
                      </span>
                    </div>

                    <div className="ecom-card-action-footer">
                      <Link to={`/my-products/${product._id}`} className="ecom-footer-btn tertiary">View Profile</Link>
                      <Link to={`/edit-product/${product._id}`} className="ecom-footer-btn secondary">Modify</Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="ecom-pagination-navigator">
              <button className="ecom-page-step-btn" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>← Previous</button>
              <div className="ecom-page-numerical-track">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} className={`ecom-numerical-node ${page === currentPage ? "is-active" : ""}`} onClick={() => goToPage(page)}>{page}</button>
                ))}
              </div>
              <button className="ecom-page-step-btn" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyProducts;