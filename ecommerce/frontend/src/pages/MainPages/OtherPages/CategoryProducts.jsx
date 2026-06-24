// ecommerce/frontend/src/pages/MainPages/CategoryPage/CategoryProducts.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Grid, List, ChevronLeft, ChevronRight, Loader2, ArrowLeft } from "lucide-react";
import "./CategoryProducts.css";
import { useCategories } from "../../../hooks/useCategories";
import ProductImageSlider from "../../../components/ProductImageSlider";
import { useProducts } from "../../../hooks/useProducts";
import { useCart } from "../../../../context/CartContext";
import HeroBanner from "../../../components/HeroBanner/HeroBanner";
import backgroundImage from "../../../assets/images/Category-Banner.jpg";
import smartPhoneImage from "../../../assets/images/Smartphones.jpg";
import mobileAccessoriesImage from "../../../assets/images/mobile-accessories.jpg";
import consoleImage from "../../../assets/images/consoles.jpg";
import videoGamesImage from "../../../assets/images/videogames.png";
import watchesImage from "../../../assets/images/watches.jpg";
import headphonesImage from "../../../assets/images/headphones.jpg";
const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "rating-asc", label: "Rating: Low to High" },
];

const ITEMS_PER_PAGE = 12;

const CategoryProducts = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  const {
    products,
    loadingProducts,
    totalPages,
    totalProducts,
    currentPage,
    setCurrentPage,
  } = useProducts({
    category: categoryId,
    sortBy,
  });

  const { categories, loadingCategories } = useCategories();
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (!loadingCategories && categories.length > 0) {
      const cat = categories.find((c) => c._id === categoryId);
      setCategoryName(cat ? cat.name : "Category");
    }
  }, [categories, loadingCategories, categoryId]);

  const isLoading = loadingProducts || loadingCategories;

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalProducts);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  // select the background image according to category name
  // Place matching banner files in the public/images folder (e.g. public/images/smartphones-banner.jpg)
  const getBackgroundImageForCategory = (name) => {
    if (!name) return backgroundImage;
    const key = name.toLowerCase().trim();
    switch (key) {
      case "smartphones":
        return smartPhoneImage;
      case "mobile accessories":
        return mobileAccessoriesImage;
      case "consoles":
        return consoleImage;
      case "video games":
        return videoGamesImage;
      case "watches":
        return watchesImage;
      case "headphones":
        return headphonesImage;
      default:
        return backgroundImage; // Default banner imported above
    }
  };
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

  if (!loadingCategories && categories.length > 0 && !categoryName) {
    return (
      <div className="category-products-page">
        <div className="category-not-found">
          <h2>Category Not Found</h2>
          <p>The category you are looking for might have been moved or renamed.</p>
          <Link to="/products" className="back-link">
            <ArrowLeft size={16} /> Back to All Products
          </Link>
        </div>
      </div>
    );
  }

  const bannerImage = getBackgroundImageForCategory(categoryName);

  return (
    <div className="category-products-page">
      <HeroBanner
        badge="New Launch"
        highlightText={`Explore our curated selection of ${categoryName || "products"}.`}
        backgroundImage={bannerImage} />
      <div className="category-products-container">

        {/* Top Breadcrumb & Back Link Navigation */}
        <div className="category-navigation">
          <Link to="/products" className="back-to-all">
            <ArrowLeft size={16} /> <span>All Products</span>
          </Link>
        </div>

        {/* Dynamic Header Section */}
        <div className="category-header">
          <h1 className="category-title">{categoryName || "Loading Category..."}</h1>
          <div className="result-count">
            {isLoading
              ? "Updating catalog..."
              : totalProducts === 0
                ? "No items found"
                : `Showing ${startItem}–${endItem} of ${totalProducts} products`}
          </div>
        </div>

        {/* Filter & Layout Control Toolbar */}
        <div className="category-controls">
          <div className="sort-view-wrapper">
            <div className="sort-box">
              <label htmlFor="sort-select">Sort by</label>
              <div className="select-container">
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="view-toggle" role="tablist">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                aria-selected={viewMode === "grid"}
                role="tab"
              >
                <Grid size={18} />
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
                aria-selected={viewMode === "list"}
                role="tab"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Products Display Board */}
        <div className={`products-grid products-grid--${viewMode}`}>
          {isLoading ? (
            <div className="loading-state">
              <Loader2 size={36} className="spin" />
              <p>Curating collection...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No products available in this category right now.</p>
              <Link to="/products" className="shop-all-btn">Discover Other Items</Link>
            </div>
          ) : (
            products.map((product, index) => (
              <article
                key={product._id}
                className={`product-card product-card--${viewMode}`}
                style={{ animationDelay: `${Math.min(index * 40, 300)}ms` }}
              >
                <div className="card-image-wrapper">
                  <ProductImageSlider
                    images={product.images}
                    productName={product.name}
                    discount={product.discount}
                    showThumbnails={false}
                  />
                </div>

                <div className="card-content">
                  <div className="card-info-header">
                    <span className="product-brand">{product.brand || "Essential"}</span>
                    <span className="rating">★ {product.rating?.toFixed(1) ?? "—"}</span>
                  </div>

                  <Link to={`/product/${product._id}`} className="title-link">
                    <h3 className="product-title">{product.name}</h3>
                  </Link>

                  <div className="price-row">
                    <span className="price">${product.price?.toFixed(2) ?? "—"}</span>
                  </div>

                  <div className="card-actions">
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product._id, 1)}
                      disabled={product.stock <= 0}
                    >
                      {product.stock <= 0 ? "Out of Stock" : "Add to Bag"}
                    </button>

                    <button
                      className="buy-now-btn"
                      onClick={() => handleBuyNow(product)}
                      disabled={product.stock <= 0}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Minimalist Pagination System */}
        {totalPages > 1 && !isLoading && (
          <nav className="pagination" aria-label="Category products pagination">
            <button
              className="page-btn directional-btn"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`page-btn number-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => goToPage(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              className="page-btn directional-btn"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;