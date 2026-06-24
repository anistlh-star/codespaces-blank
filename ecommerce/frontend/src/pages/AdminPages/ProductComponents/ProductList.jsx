//ecommerce/frontend/src/pages/AdminPages/ProductComponents/ProductList.jsx
import { useEffect, useState, useCallback } from "react";
import "./ProductList.css";
import API from "../../../../api/index.js";
import { Link } from "react-router-dom";
import { getImageSrc, placeholder } from "../../../components/imageHandler.js";
import { useCategories } from "../../../hooks/useCategories.js";
import ProductFormModal from "./ProductFormModal.jsx";

export default function ProductListingPage() {
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });

  // Categories for sidebar
  // const [categories, setCategories] = useState([]);
  const { categories, productsPerCategory, loadingCategories } = useCategories();

  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const openAddModal = () => {
    setSelectedProductId(null);
    setModalOpen(true);
  };

  const openEditModal = (id) => {
    setSelectedProductId(id);
    setModalOpen(true);
  };

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        priceMin: priceRange.min,
        priceMax: priceRange.max,
        sortField: sortBy,
        sortOrder,
      };

      const res = await API.get("/admin/products/all", { params });

      setProducts(res.data.data.products || []);
      setTotalProducts(res.data.data.totalProducts || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    searchTerm,
    selectedCategory,
    priceRange,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sorting
  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split(":");
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    try {
      await API.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await API.post("/wishlist", { productId });
      alert("Added to wishlist!");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to wishlist");
    }
  };

  // Pagination
  const handlePageChange = (newPage) => setCurrentPage(newPage);
  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div className="product-listing-page">
      <h1>All Products</h1>

      {/* Header */}
      <header className="product-listing-page__header">
        <div className="product-listing-page__filters-top">
          <button onClick={openAddModal}>+ Add New Product</button>
        </div>

        <div className="product-listing-page__actions">
          {/* Sorting */}
          <select
            className="product-listing-page__sort-select"
            onChange={handleSortChange}
          >
            <option value="createdAt:desc">Latest items</option>
            <option value="price:asc">Price: Low to High</option>
            <option value="price:desc">Price: High to Low</option>
            <option value="rating:desc">Best Rating</option>
          </select>

          {/* View Toggle */}
          <div className="product-listing-page__view-toggle">
            <button
              className={viewMode === "grid" ? "active" : ""}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </button>
            <button
              className={viewMode === "list" ? "active" : ""}
              onClick={() => setViewMode("list")}
            >
              List
            </button>
          </div>
        </div>
      </header>

      <div className="product-listing-page__main">
        {/* Sidebar */}
        <aside className="product-listing-page__sidebar">
          {/* Search */}
          <div className="product-listing-page__search">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <span className="product-listing-page__search-icon">🔍</span>
          </div>

          {/* Categories */}
          <section className="product-listing-page__filter-section">
            <h3>Categories</h3>
            {loadingCategories ? (
              <p>Loading categories...</p>
            ) : (
              <ul>
                <li>
                  <a
                    href="#"
                    className={!selectedCategory ? "active" : ""}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedCategory("");
                      setCurrentPage(1);
                    }}
                  >
                    All Products ({totalProducts})
                  </a>
                </li>
                {productsPerCategory.map((cat) => (
                  <li key={cat._id}>
                    <a
                      href="#"
                      className={selectedCategory === cat._id ? "active" : ""}
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedCategory(cat._id);
                        setCurrentPage(1);
                      }}
                    >
                      {cat.categoryName} <span>({cat.totalProducts})</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Price Range */}
          <section className="product-listing-page__filter-section">
            <h3>Price range</h3>
            <input
              type="range"
              min="0"
              max="100000"
              value={priceRange.max}
              onChange={(e) => {
                setPriceRange({ min: 0, max: parseInt(e.target.value) });
                setCurrentPage(1);
              }}
            />
            <div className="product-listing-page__price-values">
              <span>$0</span>
              <span>${priceRange.max}</span>
            </div>
          </section>
        </aside>

        {/* Products */}
        <section
          className={`product-listing-page__products ${viewMode === "list" ? "list-view" : ""
            }`}
        >
          {loading ? (
            <div className="product-listing-page__loading">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="product-listing-page__empty">
              No products found.
            </div>
          ) : (
            products.map((product) => (
              <div key={product._id}>
                <article className="product-listing-page__card">
                  {product.isNew && (
                    <span className="product-listing-page__new-badge">NEW</span>
                  )}
                  <img
                    src={getImageSrc(product.images?.[0])}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = placeholder)}
                  />
                  <Link to={`/admin/products/${product._id}`}>
                    <h3>{product.name}</h3>
                  </Link>
                  <div className="product-listing-page__rating">
                    {"★".repeat(Math.floor(product.rating || 0))}
                    {"☆".repeat(5 - Math.floor(product.rating || 0))}
                    <span>
                      {(product.rating ?? 0).toFixed(1)}/5 (
                      {product.reviews ?? 0})
                    </span>
                  </div>
                  <div className="product-listing-page__price">
                    ${product.salePrice ?? product.price}
                    {product.salePrice && product.salePrice < product.price && (
                      <span className="product-listing-page__old-price">
                        ${product.price}
                      </span>
                    )}
                  </div>
                  <button className="product-listing-page__details-btn">
                    Details
                  </button>
                  <button
                    className="product-listing-page__wishlist-btn"
                    onClick={() => handleAddToWishlist(product._id)}
                  >
                    ♡ Add to wishlist
                  </button>
                  <button
                    className="product-listing-page__wishlist-btn"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete product
                  </button>
                  <button
                    className="product-listing-page__wishlist-btn"
                    onClick={() => openEditModal(product._id)}
                  >
                    Edit product
                  </button>

                </article>
              </div>
            ))
          )}
        </section>
      </div>

      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        productId={selectedProductId}
        onRefresh={fetchProducts}
      />

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="product-listing-page__pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            ← Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
