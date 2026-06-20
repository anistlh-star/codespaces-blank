import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../../../hooks/useProducts";
import { useCategories } from "../../../hooks/useCategories";
import { useWishlist } from "../../../hooks/useWishlist";
import CategoryTabs from "./CategoryTabs";
import ProductImageSlider from "../../../components/ProductImageSlider";
import { Heart } from "lucide-react";
import "./NewArrivalsPage.css";
import { useCart } from "../../../../context/CartContext";

const NewArrivalsPage = () => {
  const navigate = useNavigate();
  const { newArrivals, loading, error } = useProducts();
  const { categories } = useCategories();
  const { isInWishlist, toggleWishlist, loading: wishListloading } = useWishlist();
  const { addToCart } = useCart();

  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? newArrivals
      : newArrivals.filter((p) => p.category.name === activeCategory);

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
    });
  };

  if (loading) {
    return (
      <div className="new-arrivals-page">
        <div className="loading">Loading new arrivals...</div>
      </div>
    );
  }

  if (error || !newArrivals?.length) {
    return (
      <div className="new-arrivals-page">
        <div className="error-message">
          {error || "No new arrivals at the moment. Check back soon!"}
        </div>
      </div>
    );
  }

  return (
    <div className="new-arrivals-page">
      <div className="page-header">
        <h1>New Arrivals</h1>
        <p>Fresh drops just added — don't miss out!</p>
      </div>

      <CategoryTabs
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categories}
      />

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <p className="no-results">
            No new arrivals in "{activeCategory}" category yet.
          </p>
        ) : (
          filteredProducts.map((product, index) => (
            <article
              key={product._id}
              className="prod-list-card"
              style={{ transitionDelay: `${Math.min(index * 50, 400)}ms` }}
            >
              <div className="prod-list-card-image-wrapper">
                <ProductImageSlider
                  images={product.images}
                  productName={product.name}
                  discount={product.discount}
                  showThumbnails={false}
                />
              </div>

              <div className="prod-list-card-content">
                <Link to={`/product/${product._id}`} className="block">
                  <h3 className="prod-list-card-title">{product.name}</h3>
                </Link>

                <div className="prod-list-card-brand">
                  {product.brand || "—"}
                </div>

                <div className="prod-list-card-price-row">
                  <span className="prod-list-card-price">
                    ${product.price?.toFixed(2) ?? "—"}
                  </span>
                  <span className="prod-list-card-rating">
                    ★ {product.rating ?? "—"}
                  </span>
                </div>

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
                    size={22}
                    fill={isInWishlist(product._id) ? "currentColor" : "none"}
                  />
                </button>

                <button
                  className="prod-list-card-add-btn"
                  onClick={() => addToCart(product._id, 1)}
                  disabled={product.stock <= 0}
                  aria-label={`Add ${product.name} to cart`}
                >
                  {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                </button>

                <button
                  className="prod-list-card-buy-now-btn"
                  onClick={() => handleBuyNow(product)}
                  disabled={product.stock <= 0}
                  aria-label={`Buy ${product.name} now`}
                >
                  Buy Now
                </button>
              </div>
            </article>
          ))
        )}
      </div>

      <div className="view-more">
        <Link to="/shop" className="view-more-btn">
          View All Products →
        </Link>
      </div>
    </div>
  );
};

export default NewArrivalsPage;
