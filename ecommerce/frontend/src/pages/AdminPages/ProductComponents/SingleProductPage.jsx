//ecommerce/frontend/src/pages/AdminPages/ProductComponents/SingleProductPage.jsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../../../styles/pages/AdminPages/ProductComponents/SingleProductPage.css";
import API from "../../../../api";
import { getImageSrc } from "../../../components/imageHandler";

export default function SingleProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/admin/products/${id}`);
        const prod = res.data.product || res.data;

        setProduct(prod);
      } catch (err) {
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="single-product-loading">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return <div className="product-not-found">Product not found</div>;
  }

  const mainImage = product.images?.[mainImageIndex] || null;
  const displayPrice = product.salePrice || product.price;
  const hasDiscount = product.salePrice && product.salePrice < product.price;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="single-product">
      <div className="product-grid">
        {/* Images Section */}
        <div className="product-images">
          <div className="image-badges">
            {product.onSale && (
              <span className="sale-badge">
                {product.discountPercentage
                  ? `-${product.discountPercentage}% OFF`
                  : "On Sale"}
              </span>
            )}
            {product.featured && (
              <span className="featured-badge">Featured</span>
            )}
          </div>

          <div className="main-image-wrapper">
            <img
              src={mainImage ? getImageSrc(mainImage) : "https://placehold.co/600x600?text=No+Image"}
              alt={product.name || "Product"}
              className="main-image"
              onError={(e) => (e.target.src = "https://placehold.co/600x600?text=Image+Error")}
            />
          </div>

          {product.images?.length > 1 && (
            <div className="thumbnail-container">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={getImageSrc(img)}
                  alt={`${product.name} - view ${index + 1}`}
                  className={`thumbnail ${index === mainImageIndex ? "active" : ""}`}
                  onClick={() => setMainImageIndex(index)}
                  onError={(e) => (e.target.src = "https://placehold.co/100x100?text=?")}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <div className="product-meta">
            <span className="brand">Brand: {product.brand || "Unknown"}</span>
            <span className="stock-status">
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
            <span>Release: {formatDate(product.releaseDate)}</span>
          </div>

          <h1 className="product-title">{product.name}</h1>

          <div className="price-section">
            <span className="current-price">${displayPrice?.toFixed(2) || "N/A"}</span>
            {hasDiscount && (
              <span className="original-price">${product.price?.toFixed(2)}</span>
            )}
          </div>

          <div className="action-buttons">
            <button className="btn btn-primary add-to-cart">Add to Cart</button>
            <button className="btn btn-accent buy-now">Buy Now</button>
            <button className="btn btn-outline wishlist">♡ Wishlist</button>
          </div>

          <div className="description">
            <h3>Description</h3>
            <p>{product.description || "No description available."}</p>
          </div>

          {/* Basic Info Table */}
          <div className="info-table">
            <table>
              <tbody>
                <tr><th>Brand</th><td>{product.brand || "—"}</td></tr>
                <tr><th>Country of Origin</th><td>{product.countryOfOrigin || "—"}</td></tr>
                <tr><th>Stock</th><td>{product.stock}</td></tr>
                <tr><th>Category</th><td>{product.category?.name || "—"}</td></tr>
                <tr><th>Rating</th><td>{product.rating} ★ ({product.reviews} reviews)</td></tr>
              </tbody>
            </table>
          </div>

          {/* Specifications Table */}
          {product.specifications?.length > 0 ? (
            <div className="specifications-section">
              <h3>Specifications</h3>
              <table className="specs-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {product.specifications.map((spec, idx) => (
                    <tr key={spec._id || idx}>
                      <td className="spec-label">{spec.label || "—"}</td>
                      <td className="spec-value">{spec.value || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="no-specs">
              No detailed specifications available for this product.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}