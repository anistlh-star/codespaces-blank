// ecommerce/frontend/src/pages/MainPages/CategoryPage/CategoryProducts.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Grid, List, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import "./CategoryProducts.css";
import { useCategories } from "../../../hooks/useCategories";
import ProductImageSlider from "../../../components/ProductImageSlider";
import { useProducts } from "../../../hooks/useProducts";
import { useCart } from "../../../../context/CartContext";

const sortOptions = [
  { value: "newest",     label: "Newest first" },
  { value: "oldest",     label: "Oldest first" },
  { value: "price-asc",  label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc",label: "Rating: High to Low" },
  { value: "rating-asc", label: "Rating: Low to High" },
];

const ITEMS_PER_PAGE = 12;

const CategoryProducts = () => {
  const { categoryId } = useParams(); // e.g., "/category/:categoryId"
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // View mode & sorting
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination from hook
  const {
    products,
    loadingProducts,
    totalPages,
    totalProducts,
    currentPage,
    setCurrentPage,
  } = useProducts({
    category: categoryId,          // filter by this category ID
    sortBy,
  });

  // Fetch categories to get the category name
  const { categories, loadingCategories } = useCategories();
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (!loadingCategories && categories.length > 0) {
      const cat = categories.find((c) => c._id === categoryId);
      setCategoryName(cat ? cat.name : "Category");
    }
  }, [categories, loadingCategories, categoryId]);

  const isLoading = loadingProducts || loadingCategories;

  // Pagination helpers
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalProducts);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Buy Now handler (direct checkout)
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

  // If category not found after loading
  if (!loadingCategories && categories.length > 0 && !categoryName) {
    return (
      <div className="category-products-page">
        <div className="category-not-found">
          <h2>Category not found</h2>
          <Link to="/products" className="back-link">← Back to all products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="category-products-page">
      <div className="category-products-container">

        {/* Header */}
        <div className="category-header">
          <h1 className="category-title">{categoryName || "Loading..."}</h1>
          <Link to="/products" className="back-to-all">
            ← All Products
          </Link>
        </div>

        {/* Controls */}
        <div className="category-controls">
          <div className="result-count">
            {isLoading
              ? "Loading products..."
              : totalProducts === 0
              ? "No products found"
              : `Showing ${startItem}–${endItem} of ${totalProducts}`}
          </div>

          <div className="sort-view-wrapper">
            <div className="sort-box">
              <label htmlFor="sort-select">Sort by:</label>
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

            <div className="view-toggle" role="tablist">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                aria-selected={viewMode === "grid"}
                role="tab"
              >
                <Grid size={20} />
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
                aria-selected={viewMode === "list"}
                role="tab"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Products grid/list */}
        <div className={`products-grid products-grid--${viewMode}`}>
          {isLoading ? (
            <div className="loading-state">
              <Loader2 size={40} className="spin" />
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <p>No products found in this category.</p>
            </div>
          ) : (
            products.map((product, index) => (
              <article
                key={product._id}
                className={`product-card product-card--${viewMode}`}
                style={{ transitionDelay: `${Math.min(index * 50, 400)}ms` }}
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
                  <Link to={`/product/${product._id}`} className="title-link">
                    <h3 className="product-title">{product.name}</h3>
                  </Link>

                  <div className="product-brand">{product.brand || "—"}</div>

                  <div className="price-row">
                    <span className="price">${product.price?.toFixed(2) ?? "—"}</span>
                    <span className="rating">★ {product.rating ?? "—"}</span>
                  </div>

                  <div className="card-actions">
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product._id, 1)}
                      disabled={product.stock <= 0}
                    >
                      {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
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

        {/* Pagination */}
        {totalPages > 1 && !isLoading && (
          <nav className="pagination" aria-label="Category products pagination">
            <button
              className="page-btn"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`page-btn ${currentPage === page ? "active" : ""}`}
                onClick={() => goToPage(page)}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            ))}

            <button
              className="page-btn"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;