//ecommerce/frontend/src/pages/MainPages/OtherPages/MyProducts.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./MyProducts.css";
import API from "../../../../api";
import { useAuth } from "../../../../context/AuthContext";

export default function MyProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    const fetchMyProducts = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/user/${user._id}`);
        setProducts(res.data || []);
      } catch (err) {
        setError("Could not load your products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
  }, [user?._id]);

  if (!user) {
    return (
      <div className="user-products-page">
        <p>Please log in to see your products.</p>
      </div>
    );
  }

  return (
    <div className="user-products-page">
      <h1 className="user-products-title">My Products</h1>

      {loading && <div className="user-products-loading">Loading your products...</div>}

      {error && <div className="user-products-error">{error}</div>}

      {!loading && products.length === 0 && (
        <p className="user-products-empty">You haven't created any products yet.</p>
      )}

      <div className="user-products-grid">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/my-product/${product._id}`}
            className="user-products-card"
          >
            <div className="user-products-image-wrapper">
              <img
                src={product.images?.[0] || "/images/placeholder-product.jpg"}
                alt={product.name}
                className="user-products-image"
                loading="lazy"
              />
            </div>

            <div className="user-products-info">
              <h3 className="user-products-name">{product.name}</h3>
              <p className="user-products-price">${Number(product.price || 0).toFixed(2)}</p>
              <p className="user-products-category">{product.categoryName || "Uncategorized"}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}