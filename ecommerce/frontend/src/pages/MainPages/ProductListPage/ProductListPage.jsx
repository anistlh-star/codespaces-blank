// ecommerce/frontend/src/pages/MainPages/ProductListPage/ProductListPage.jsx
import { useState } from "react";
import {
  Grid,
  List,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Heart,
} from "lucide-react";
import "./ProductListPage.css";
import { useProducts } from "../../../hooks/useProducts";
import { useCategories } from "../../../hooks/useCategories";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../../../context/CartContext";
import ProductImageSlider from "../../../components/ProductImageSlider";
import { useWishlist } from "../../../hooks/useWishlist";
import HeroBanner from '../../../components/HeroBanner/HeroBanner';
import shopBgImage from '../../../assets/images/stockfresh_7725590_business-desktop-with-credit-card_sizeXL-1-1536x1025.jpg'
 
const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "rating-asc", label: "Rating: Low to High" },
];

const ITEMS_PER_PAGE = 12;

const ProductListPage = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 0]);
  const { isInWishlist, toggleWishlist, wishListloading } = useWishlist();

  const [sortBy, setSortBy] = useState("newest");

  const { addToCart } = useCart();
  const navigate = useNavigate();
  const {
    products,
    loadingProducts,
    totalPages,
    totalProducts,
    currentPage,
    totalProductsCount,
    brands,
    setCurrentPage,
  } = useProducts({
    category: selectedCategory === "All" ? null : selectedCategory,
    brand: selectedBrand === "All" ? null : selectedBrand,
    priceRange: priceRange[1] > 0 ? priceRange : null,
    sortBy,
  });

  const { productsPerCategory, loadingCategories } = useCategories();

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalProducts);

  const isLoading = loadingProducts || loadingCategories;

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

  return (
    <div className="prod-list-page">
      <HeroBanner
        badge="Global Marketplace"
        title="Browse the Complete"
        highlightText="Product Catalog"
        backgroundImage={shopBgImage}
      />
      <div className="prod-list-container">
        {/* Sidebar Filters */}
        <aside className="prod-list-sidebar" aria-label="Product filters">
          <div className="prod-list-filter-group">
            <h3 className="prod-list-filter-title">
              <Filter size={16} /> Filters
            </h3>

            {/* Category */}
            <div className="prod-list-filter-section">
              <h4>Category</h4>
              <button
                className={`prod-list-filter-btn ${selectedCategory === "All" ? "active" : ""}`}
                onClick={() => {
                  setSelectedCategory("All");
                  setCurrentPage(1);
                }}
              >
                All {totalProductsCount > 0 && `(${totalProductsCount})`}
              </button>

              {productsPerCategory.map((cat) => (
                <button
                  key={cat._id}
                  className={`prod-list-filter-btn ${selectedCategory === cat._id ? "active" : ""}`}
                  onClick={() => {
                    setSelectedCategory(cat._id);
                    setCurrentPage(1);
                  }}
                >
                  {cat.categoryName}{" "}
                  {cat.totalProducts > 0 && `(${cat.totalProducts})`}
                </button>
              ))}
            </div>

            {/* Brand */}
            <div className="prod-list-filter-section">
              <h4>Brands</h4>
              <button
                className={`prod-list-filter-btn ${selectedBrand === "All" ? "active" : ""}`}
                onClick={() => {
                  setSelectedBrand("All");
                  setCurrentPage(1);
                }}
              >
                All Brands
              </button>
              {brands.map((brand) => (
                <button
                  key={brand._id}
                  className={`prod-list-filter-btn ${selectedBrand === brand.brandName ? "active" : ""}`}
                  onClick={() => {
                    setSelectedBrand(brand.brandName);
                    setCurrentPage(1);
                  }}
                >
                  {brand.brandName} ({brand.count})
                </button>
              ))}
              {brands.length === 0 && !loadingCategories && (
                <p className="prod-list-empty-text">No brands available</p>
              )}
            </div>

            {/* Price Range */}
            <div className="prod-list-filter-section">
              <h4>Price Range</h4>
              <div className="prod-list-price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  min={0}
                  value={priceRange[0] || ""}
                  onChange={(e) => {
                    const val = e.target.value === "" ? 0 : Number(e.target.value);
                    if (!isNaN(val) && val >= 0) {
                      setPriceRange([val, priceRange[1]]);
                      setCurrentPage(1);
                    }
                  }}
                  aria-label="Minimum price"
                />
                <span className="prod-list-price-dash">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  min={0}
                  value={priceRange[1] || ""}
                  onChange={(e) => {
                    const val = e.target.value === "" ? 0 : Number(e.target.value);
                    if (!isNaN(val) && val >= priceRange[0]) {
                      setPriceRange([priceRange[0], val]);
                      setCurrentPage(1);
                    }
                  }}
                  aria-label="Maximum price"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="prod-list-main">
          {/* Controls */}
          <div className="prod-list-controls">
            <div className="prod-list-result-count">
              {isLoading
                ? "Loading products..."
                : totalProducts === 0
                  ? "No products found"
                  : `Showing ${startItem}–${endItem} of ${totalProducts}`}
            </div>

            <div className="prod-list-sort-view-wrapper">
              <div className="prod-list-sort">
                <label htmlFor="sort-select">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="prod-list-view-toggle" role="tablist">
                <button
                  className={`prod-list-view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  aria-selected={viewMode === "grid"}
                  role="tab"
                >
                  <Grid size={18} />
                </button>
                <button
                  className={`prod-list-view-btn ${viewMode === "list" ? "active" : ""}`}
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

          {/* Products grid / list */}
          <div className={`prod-list-products prod-list-products--${viewMode}`}>
            {isLoading ? (
              <div className="prod-list-no-results">
                <Loader2 size={28} className="animate-spin prod-list-spinner" />
                <p>Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="prod-list-no-results">
                <p>No products match your current filters.</p>
                <p className="prod-list-no-results-sub">
                  Try adjusting the category, brand, price range or sort options.
                </p>
              </div>
            ) : (
              products.map((product, index) => (
                <article
                  key={product._id}
                  className={`prod-list-card prod-list-card--${viewMode}`}
                  style={{ transitionDelay: `${Math.min(index * 30, 300)}ms` }}
                >
                  <div className="prod-list-card-image-wrapper">
                    <ProductImageSlider
                      images={product.images}
                      productName={product.name}
                      discount={
                        product.salePrice && product.salePrice < product.price
                          ? Math.round(((product.price - product.salePrice) / product.price) * 100)
                          : 0
                      }
                      showThumbnails={false}
                    />
                    {/* Modern Float Wishlist Circle */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product._id);
                      }}
                      disabled={wishListloading}
                      className={`prod-list-card-wishlist-btn ${isInWishlist(product._id) ? "active" : ""}`}
                      title={isInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                    >
                      <Heart
                        size={18}
                        stroke="currentColor" /* 👈 CRITICAL: This forces the outline to use the CSS text color */
                        strokeWidth={2}       /* 👈 Gives the lines some defined thickness */
                        fill={isInWishlist(product._id) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>

                  <div className="prod-list-card-content">
                    <div className="prod-list-card-info-header">
                      <div className="prod-list-card-brand">{product.brand || "Generic"}</div>
                      <span className="prod-list-card-rating">
                        ★ {product.rating ? product.rating.toFixed(1) : "—"}
                      </span>
                    </div>

                    <Link to={`/product/${product._id}`} className="prod-list-card-title-link">
                      <h3 className="prod-list-card-title">{product.name}</h3>
                    </Link>

                    <div className="prod-list-card-price-row">
                      <div className="prod-list-card-price">
                        <span className="prod-list-card-current-price">
                          ${product.salePrice ?? product.price}
                        </span>
                        {product.salePrice && product.salePrice < product.price && (
                          <span className="prod-list-card-old-price">
                            ${product.price}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="prod-list-card-actions">
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
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && !isLoading && (
            <nav className="prod-list-pagination" aria-label="Product pagination">
              <button
                className="prod-list-page-btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`prod-list-page-btn ${currentPage === page ? "active" : ""}`}
                  onClick={() => goToPage(page)}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}

              <button
                className="prod-list-page-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListPage;