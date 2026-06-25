// src/pages/UserPages/Wishlist.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { useWishlist } from "../../hooks/useWishlist"; // 👈 Hook imported

import "./Wishlist.css";
import { getImageSrc } from "../../components/imageHandler";

const Wishlist = () => {
  const { user } = useAuth();
  
  // Consume your global reactive state engine
  const { 
    wishlistData, 
    wishListloading, 
    toggleWishlist, 
    error: actionError 
  } = useWishlist();

  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"

  if (!user) {
    return (
      <div className="wishlist-gate">
        <div className="wishlist-gate__card">
          <h2>Access Denied</h2>
          <p>Please log in to manage your curated personal wishlist.</p>
          <Link to="/login" className="wl-btn wl-btn--primary">
            Sign In Account
          </Link>
        </div>
      </div>
    );
  }

  // Derive products array safely from the global hook's populated data wrapper
  const products = wishlistData?.products || [];

  return (
    <div className="wl-page">
      {/* Top Header Layout Controls */}
      <div className="wl-header">
        <div className="wl-header__meta">
          <h1 className="wl-header__title">My Wishlist</h1>
          <span className="wl-header__badge">
            {products.length} {products.length === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="wl-header__controls">
          <div className="wl-toggle-group">
            <button
              className={`wl-toggle-btn ${viewMode === "grid" ? "is-active" : ""}`}
              onClick={() => setViewMode("grid")}
              aria-label="Grid view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>
            <button
              className={`wl-toggle-btn ${viewMode === "list" ? "is-active" : ""}`}
              onClick={() => setViewMode("list")}
              aria-label="List view"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Renders global hook errors if a network operation fails */}
      {actionError && <div className="wl-toast-error">{actionError}</div>}

      {/* Main Structural Display Logic */}
      {wishListloading && products.length === 0 ? (
        <div className="wl-loader">
          <div className="wl-loader__spinner"></div>
          <p>Retrieving your saved items...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="wl-empty">
          <div className="wl-empty__icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </div>
          <h2 className="wl-empty__title">Your wishlist is empty</h2>
          <p className="wl-empty__text">Save items you love here to monitor stock availability and price adjustments.</p>
          <Link to="/shop" className="wl-btn wl-btn--primary">
            Explore Collections
          </Link>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            key={viewMode}
            className={`wl-container wl-container--${viewMode}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            {products.map((item) => {
              const product = item.product;
              if (!product || !product._id) return null;

              const inStock = product.stock > 0;

              return (
                <motion.div
                  key={product._id}
                  className="wl-card"
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.28 }}
                >
                  {/* Media Wrapper Frame */}
                  <div className="wl-card__media">
                    {Array.isArray(product.images) && product.images.length > 0 ? (
                      <img
                        src={getImageSrc(product.images[0])}
                        alt={product.name}
                        className="wl-card__img"
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/400x400?text=No+Image+Available";
                        }}
                      />
                    ) : (
                      <div className="wl-card__no-img">No Image Available</div>
                    )}
                    
                    {/* Maps to global toggle function to ensure instant counter synchronization */}
                    <button
                      className="wl-card__quick-remove"
                      onClick={() => toggleWishlist(product._id)}
                      title="Remove Item"
                      aria-label="Remove from wishlist"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>

                  {/* Item Content Descriptions */}
                  <div className="wl-card__body">
                    <div className="wl-card__header-row">
                      <span className="wl-card__tag">{product.category?.name || "General"}</span>
                      <span className={`wl-card__stock ${inStock ? "is-in-stock" : "is-out-stock"}`}>
                        {inStock ? "In Stock" : "Sold Out"}
                      </span>
                    </div>

                    <h3 className="wl-card__title">{product.name}</h3>
                    <p className="wl-card__price">${product.price?.toFixed(2) || "—"}</p>

                    <div className="wl-card__actions">
                      <Link to={`/product/${product._id}`} className="wl-btn wl-btn--secondary">
                        View Product
                      </Link>
                      <button
                        className="wl-btn wl-btn--text"
                        onClick={() => toggleWishlist(product._id)}
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