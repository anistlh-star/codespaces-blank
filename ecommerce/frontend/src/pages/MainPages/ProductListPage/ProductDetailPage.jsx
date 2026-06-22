// src/pages/MainPages/ProductListPage/ProductDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Star,
  Heart,
  ShoppingCart,
} from "lucide-react";
import "./ProductDetailPage.css";
import API from "../../../../api";
import { useCart } from "../../../../context/CartContext";
import { useWishlist } from "../../../hooks/useWishlist";
import ProductImageSlider from "../../../components/ProductImageSlider";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist, wishListloading } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!id) {
      setError("No product ID provided");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        console.log("Fetched product data:", res);
        setProduct(res.data.data || res.data);
        setQuantity(1);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load product. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Quantity controls
  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1 && val <= (product?.stock || 1)) {
      setQuantity(val);
    }
  };

  const incrementQuantity = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!product || product.stock <= 0) return;
    addToCart(product._id, quantity);
  };

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        directItem: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
          quantity,
        },
      },
    });
  };

  const price = product?.price ?? 0;
  const salePrice = product?.salePrice;
  const finalPrice = salePrice ?? price;
  const isOutOfStock = product?.stock <= 0;

  // Loading skeleton
  if (loading) {
    return (
      <div className="pdp-wrapper">
        <div className="loading-skeleton">
          <div className="skeleton-image"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text short"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text short"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pdp-wrapper">
        <div
          className="error-container"
          style={{ textAlign: "center", padding: "4rem 1rem" }}
        >
          <h2>{error || "Product not found"}</h2>
          <p>Please go back and select a product.</p>
          <button
            onClick={() => navigate("/products")}
            style={{
              marginTop: "1rem",
              padding: "0.6rem 1.5rem",
              background: "var(--primary)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pdp-wrapper">
      <div className="pdp-wrapper-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a href="/">Home</a> &nbsp;/&nbsp;
          <a href={`/category/${product.category?._id}`}>
            {product.category?.name || "Category"}
          </a>{" "}
          &nbsp;/&nbsp;
          <span>{product.name}</span>
        </div>

        <div className="product-content">
          {/* Swiper Image Gallery Slider */}
          <div className="image-gallery">
            <ProductImageSlider
              images={product.images}
              productName={product.name}
              discount={product.onSale ? product.discountPercentage : 0}
              showThumbnails={true}
            />
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="brand">{product.brand || "—"}</div>
            <h1 className="product-title">{product.name}</h1>

            {/* Rating */}
            <div className="rating-container">
              <div className="stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`star ${i < Math.floor(product.rating || 0) ? "filled" : ""}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-number">
                {(product.rating || 0).toFixed(1)}
              </span>
              <span className="review-count">
                ({(product.reviews || 0).toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="price-section">
              {product.onSale && product.salePrice ? (
                <>
                  <span className="original-price">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="sale-price">
                    ${finalPrice.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="sale-price">
                  ${finalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div
              className={`stock-status ${isOutOfStock ? "out-of-stock" : "in-stock"}`}
            >
              {isOutOfStock
                ? "Out of Stock"
                : `In Stock (${product.stock} left)`}
            </div>

            <p className="short-description">{product.description}</p>

            {/* Actions */}
            <div className="actions">
              <div className="quantity-selector">
                <button
                  onClick={decrementQuantity}
                  className="qty-btn"
                  disabled={quantity <= 1 || isOutOfStock}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  max={product.stock || 1}
                  disabled={isOutOfStock}
                  aria-label="Quantity"
                />
                <button
                  onClick={incrementQuantity}
                  className="qty-btn"
                  disabled={quantity >= (product.stock || 1) || isOutOfStock}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="add-to-cart-btn"
                disabled={isOutOfStock}
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="buy-now-btn"
                disabled={isOutOfStock}
              >
                Buy Now
              </button>

              <button
                onClick={() => toggleWishlist(product._id)}
                disabled={wishListloading}
                className={`wishlist-btn ${isInWishlist(product._id) ? "active" : ""}`}
                title={
                  isInWishlist(product._id)
                    ? "Remove from Wishlist"
                    : "Add to Wishlist"
                }
              >
                <Heart
                  size={18}
                  fill={isInWishlist(product._id) ? "currentColor" : "none"}
                />
              </button>
            </div>

            <p className="shipping-note">
              🚚 Free shipping on orders over $50 • 30-day money-back guarantee
            </p>
          </div>
        </div>

        {/* Specifications */}
        <div className="details-section">
          <h2 className="section-title">Specifications</h2>
          <div className="specs-table">
            <table>
              <tbody>
                {product.specifications?.length > 0 ? (
                  product.specifications.map((spec, idx) => (
                    <tr key={idx}>
                      <td className="spec-label">{spec.label}</td>
                      <td className="spec-value">{spec.value}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      style={{ textAlign: "center", padding: "1.5rem" }}
                    >
                      No specifications available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <h2 className="section-title">Full Description</h2>
          <div className="full-description">
            {product.description || "No description available."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;