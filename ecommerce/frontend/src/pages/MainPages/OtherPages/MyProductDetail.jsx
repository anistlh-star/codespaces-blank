//ecommerce/frontend/src/pages/MainPages/OtherPages/MyProductDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./MyProductDetail.css";
import API from "../../../../api";
import { imageHelper } from "../../../utilis/imageHelper";

export default function MyProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/all/product/${id}`);
        setProduct(res.data.product || res.data);
      } catch (err) {
        console.error(err);
        setError("Product not found or you don't have permission to view it.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="user-product-detail-loading">Loading product details...</div>;
  }

  if (error || !product) {
    return (
      <div className="user-product-detail-error">
        <p>{error || "Product not found"}</p>
        <Link to="/my-products" className="user-product-back-btn">
          ← Back to My Products
        </Link>
      </div>
    );
  }

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="user-product-detail-page">
      <Link to="/my-products" className="user-product-back-btn">
        ← Back to My Products
      </Link>

      <div className="user-product-detail-container">
        {/* Image Gallery */}
        <div className="user-product-gallery">
          <div className="user-product-main-image-wrapper">
            <img
              src={imageHelper(product.images) || "/images/placeholder-product.jpg"}
              alt={product.name}
              className="user-product-main-image"
            />
          </div>

          {product.images?.length > 1 && (
            <div className="user-product-thumbnails">
              {product.images.slice(1).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="user-product-thumbnail"
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="user-product-info">
          <h1 className="user-product-name">{product.name}</h1>

          {/* Price Section */}
          <div className="user-product-price-section">
            {product.salePrice && discount > 0 ? (
              <>
                <span className="user-product-sale-price">
                  ${Number(product.salePrice).toFixed(2)}
                </span>
                <span className="user-product-original-price">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="user-product-discount-badge">-{discount}% OFF</span>
              </>
            ) : (
              <span className="user-product-price">
                ${Number(product.price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Status */}
          <div className="user-product-status">
            <span className={`user-product-stock-status ${product.stockStatus}`}>
              {product.stockStatus === "in-stock" ? "In Stock" : 
               product.stockStatus === "unavailable" ? "Out of Stock" : "Coming Soon"}
            </span>
            <span className="user-product-stock-count">Stock: {product.stock}</span>
          </div>

          {/* Brand & Origin */}
          <div className="user-product-meta">
            {product.brand && <p><strong>Brand:</strong> {product.brand}</p>}
            {product.countryOfOrigin && <p><strong>Country of Origin:</strong> {product.countryOfOrigin}</p>}
            {product.releaseDate && (
              <p><strong>Release Date:</strong> {new Date(product.releaseDate).toLocaleDateString()}</p>
            )}
          </div>

          {/* Description */}
          <div className="user-product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {/* Specifications */}
          {product.specifications?.length > 0 && (
            <div className="user-product-specifications">
              <h3>Specifications</h3>
              <div className="user-product-specs-table">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="user-product-spec-row">
                    <span className="spec-label">{spec.label}</span>
                    <span className="spec-value">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rating */}
          {product.rating > 0 && (
            <div className="user-product-rating">
              ⭐ {product.rating} • {product.reviews} reviews
            </div>
          )}
        </div>
      </div>
    </div>
  );
}