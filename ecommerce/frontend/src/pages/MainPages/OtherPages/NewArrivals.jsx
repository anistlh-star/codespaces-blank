// ecommerce/frontend/src/pages/MainPages/OtherPages/NewArrivalsPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../../hooks/useProducts";
import { useCategories } from "../../../hooks/useCategories";
import { useWishlist } from "../../../hooks/useWishlist";
import CategoryTabs from "./CategoryTabs";
import ProductImageSlider from "../../../components/ProductImageSlider";
import { Heart, Star, ArrowRight } from "lucide-react";
import { useCart } from "../../../../context/CartContext";
import "./NewArrivalsPage.css";

const NewArrivalsPage = () => {
  const navigate = useNavigate();
  const { newArrivals, loading, error } = useProducts(); //[cite: 21]
  const { categories } = useCategories(); //[cite: 21]
  const { isInWishlist, toggleWishlist, loading: wishListloading } = useWishlist(); //[cite: 21]
  const { addToCart } = useCart(); //[cite: 21]

  const [activeCategory, setActiveCategory] = useState("All"); //[cite: 21]

  const filteredProducts =
    activeCategory === "All"
      ? newArrivals
      : newArrivals.filter((p) => p.category.name === activeCategory); //[cite: 21]

  const handleBuyNow = (product) => {
    navigate("/checkout", {
      state: {
        directItem: {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
          quantity: 1,
        },
      },
    }); //[cite: 21]
  };

  if (loading) {
    return (
      <div className="new-arrivals-container display-centered">
        <div className="ecom-loading-spinner">Loading fresh arrivals...</div>
      </div>
    );
  }

  if (error || !newArrivals?.length) {
    return (
      <div className="new-arrivals-container display-centered">
        <div className="ecom-error-message">
          {error || "No new arrivals available at this time. Check back soon!"}
        </div>
      </div>
    );
  }

  return (
    <div className="new-arrivals-container">
      <header className="new-arrivals-header">
        <span className="new-arrivals-tagline">Curated Drop</span>
        <h1 className="new-arrivals-title">New Arrivals</h1>
        <p className="new-arrivals-subtitle">Fresh performance hardware additions to our ecosystem.</p>
      </header>

      <CategoryTabs
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categories}
      /> {/*[cite: 21] */}

      <div className="new-arrivals-grid">
        {filteredProducts.length === 0 ? (
          <p className="new-arrivals-empty">
            No new releases categorized under "{activeCategory}" at the moment.
          </p>
        ) : (
          filteredProducts.map((product, index) => (
            <article
              key={product._id}
              className="arrival-product-card"
              style={{ animationDelay: `${Math.min(index * 40, 300)}ms` }} //[cite: 21]
            >
              {/* Image Container Layer */}
              <div className="arrival-card-image-box">
                <ProductImageSlider
                  images={product.images}
                  productName={product.name}
                  discount={product.discount}
                  showThumbnails={false}
                /> {/*[cite: 21] */}
                
                {/* Wishlist Button Overlay */}
                <button
                  onClick={() => toggleWishlist(product._id)}
                  disabled={wishListloading}
                  className={`arrival-wishlist-trigger ${isInWishlist(product._id) ? "is-active" : ""}`}
                  aria-label={isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart
                    size={18}
                    fill={isInWishlist(product._id) ? "currentColor" : "none"}
                  />
                </button> {/*[cite: 21] */}
              </div>

              {/* Product Info Metadata Layer */}
              <div className="arrival-card-meta">
                <span className="arrival-card-brand">{product.brand || "Premium Spec"}</span> {/*[cite: 21] */}
                
                <h3 className="arrival-card-title">
                  <Link to={`/product/${product._id}`}>{product.name}</Link>
                </h3>

                <div className="arrival-card-metrics">
                  <span className="arrival-card-price">
                    ${product.price?.toFixed(2) ?? "0.00"}
                  </span> {/*[cite: 21] */}
                  {product.rating && (
                    <span className="arrival-card-rating">
                      <Star size={13} fill="currentColor" /> {product.rating}
                    </span>
                  )}
                </div>

                {/* Operations Actions Suite */}
                <div className="arrival-card-actions">
                  <button
                    className="arrival-btn-secondary"
                    onClick={() => addToCart(product._id, 1)}
                    disabled={product.stock <= 0}
                  >
                    {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                  </button> {/*[cite: 21] */}

                  <button
                    className="arrival-btn-primary"
                    onClick={() => handleBuyNow(product)}
                    disabled={product.stock <= 0}
                  >
                    Buy Now
                  </button> {/*[cite: 21] */}
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="new-arrivals-footer">
        <Link to="/shop" className="arrival-explore-all-btn">
          Explore All Products <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default NewArrivalsPage;