// ecommerce/frontend/src/pages/MainPages/CartPage/Checkout.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import "./Checkout.css";
import { useCart } from "../../../../context/CartContext";
import API from "../../../../api";
import { useCountries } from "../../../hooks/useCountries";
import { useAuth } from "../../../../context/AuthContext";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { countries } = useCountries();
  const { user, isAuthenticated } = useAuth();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const directItem = location.state?.directItem; // from "Buy Now"

  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: countries[0] || "Pakistan",
    phone: user?.phone || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Items preparation (normalized shape)
  const normalizedItems = directItem
    ? [{ ...directItem, product: directItem._id }]
    : (cart?.items || []).map((item) => ({
        product: item.productId, // ← already the ID
        name: item.name || "Unknown Product",
        image: item.images?.[0] || "",
        price: item.price || 0,
        quantity: item.quantity || 1,
      }));
  // Use backend-provided totals when available (more reliable)
  const subtotal =
    cart?.totalAmount ||
    normalizedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const shippingCost = subtotal > 100 ? 0 : 8.99;
  const total = subtotal + shippingCost;

  useEffect(() => {
    if (!orderPlaced && normalizedItems.length === 0) {
      navigate("/cart");
    }
  }, [normalizedItems.length, navigate, orderPlaced]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    if (
      !formData.fullName ||
      !formData.street ||
      !formData.city ||
      !formData.country ||
      !formData.zipCode
    ) {
      setError("Please complete all required shipping fields");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        items: normalizedItems.map((item) => ({
          product: item.product, // ← THIS IS THE FIX (was productId)
          name: item.name,
          image: item.image,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          street: formData.street,
          city: formData.city,
          state: formData.state || "N/A",
          country: formData.country,
          zipCode: formData.zipCode,
          phone: formData.phone,
        },
        paymentMethod,
      };

      const res = await API.post("/orders/place-order", payload);
      setOrderPlaced(true);
      if (!directItem) {
        await clearCart();
      }

      navigate("/order-success", {
        state: { orderId: res.data.order?._id },
      });
    } catch (err) {
      console.error("Order error:", err.response?.data); // ← helpful for debugging
      setError(
        err.response?.data?.message ||
          "Could not place order. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };
  if (!orderPlaced && normalizedItems.length === 0) {
    return (
      <div className="checkout-page empty">
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
        <Link to="/products" className="btn">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {error && <div className="error-alert">{error}</div>}

      <div className="checkout-grid">
        {/* Shipping & Payment Form */}
        <div className="checkout-form">
          <h2>Shipping Information</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>State / Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Zip / Postal Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Country *</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
              >
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <h2>Payment Method</h2>
            <div className="payment-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>

              <label className="radio-label disabled">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  disabled
                />
                Credit/Debit Card (coming soon)
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-large"
              disabled={loading || !isAuthenticated}
            >
              {loading ? "Processing..." : `Place Order • $${total.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="order-summary-card">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {normalizedItems.map((item, i) => (
              <div key={i} className="summary-row">
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-qty">× {item.quantity}</span>
                </div>
                <span className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="total-line">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="total-line">
              <span>Shipping</span>
              <span>
                {shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div className="total-line grand-total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
