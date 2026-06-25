// ecommerce/frontend/src/pages/MainPages/CartPage/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../../../../context/CartContext";
import API from "../../../../api";
import { useCountries } from "../../../hooks/useCountries";
import { useAuth } from "../../../../context/AuthContext";
import { ArrowLeft, MapPin, CreditCard, ShieldCheck, Truck, ShoppingCart } from "lucide-react";
import "./Checkout.css";
import { getImageSrc } from "../../../components/imageHandler";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { countries } = useCountries();
  const { user, isAuthenticated } = useAuth();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const directItem = location.state?.directItem;

  const [formData, setFormData] = useState({
    fullName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    if (!formData.country && countries && countries.length) {
      setFormData((f) => ({ ...f, country: countries[0] || "Pakistan" }));
    }
  }, [countries]);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalizedItems = directItem
    ? [{ ...directItem, product: directItem._id }]
    : (cart?.items || []).map((item) => {
      // Backend populates product data under item.productId when using .populate('productId')
      const prod = (typeof item.productId === "object" && item.productId !== null)
        ? item.productId
        : null;
      const name = prod?.name || item.name || "Unknown Product";
      const rawImage = prod?.images?.[0] || item.images?.[0] || item.image || "";
      const price = prod?.price ?? item.price ?? 0;
      const quantity = item.quantity || 1;
      const productId = prod?._id || (typeof item.productId === "string" ? item.productId : null) || item._id || null;
      return {
        product: productId,
        name,
        image: rawImage,   // kept as raw path; imageHelper called at render time
        price,
        quantity,
      };
    });

  const subtotal = normalizedItems.reduce((s, it) => s + (it.price || 0) * (it.quantity || 1), 0);
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
      setError("Please fill out all required shipping fields.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        items: normalizedItems.map((item) => ({
          product: item.product,
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
      console.error("Order error submission details:", err.response?.data);
      setError(
        err.response?.data?.message ||
        "Could not process your secure order request. Please verify credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!orderPlaced && normalizedItems.length === 0) {
    return (
      <div className="eh-checkout-page eh-checkout-empty">
        <div className="eh-checkout-empty-card">
          <ShoppingCart size={48} />
          <h1>Checkout Missing Content</h1>
          <p>Your tech cart is currently unallocated.</p>
          <Link to="/products" className="eh-btn eh-btn-primary">
            Browse Tech Specs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="eh-checkout-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="eh-checkout-header">
        <Link to="/cart" className="eh-back-link">
          <ArrowLeft size={16} />
          <span>Return to Cart</span>
        </Link>
        <h1>Secure Checkout</h1>
      </div>

      {error && <div className="eh-error-alert">{error}</div>}

      <div className="eh-checkout-layout">
        {/* Left Side: Form Section Mapping */}
        <div className="eh-checkout-form-section">
          <form onSubmit={handleSubmit}>
            
            <div className="eh-section-title">
              <MapPin size={20} className="eh-title-icon" />
              <h2>Shipping Architecture</h2>
            </div>

            <div className="eh-form-group">
              <label>Full Recipient Name *</label>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="eh-form-group">
              <label>Street Address Deployment *</label>
              <input
                type="text"
                name="street"
                placeholder="Suite, Block, Street address"
                value={formData.street}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="eh-form-row">
              <div className="eh-form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  placeholder="San Francisco"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="eh-form-group">
                <label>State / Region</label>
                <input
                  type="text"
                  name="state"
                  placeholder="California"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="eh-form-row">
              <div className="eh-form-group">
                <label>Zip / Postal Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="94103"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="eh-form-group">
                <label>Country Destination *</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Target Country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="eh-form-group">
              <label>Phone Node Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="eh-section-title eh-title-spacing">
              <CreditCard size={20} className="eh-title-icon" />
              <h2>Payment Verification Matrix</h2>
            </div>

            <div className="eh-payment-options">
              <label className={`eh-payment-label ${paymentMethod === "cod" ? "active" : ""}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <div className="eh-payment-meta">
                  <strong>Cash on Delivery (COD)</strong>
                  <span>Settle invoice balancing with liquid capital during courier handoff.</span>
                </div>
              </label>

              <label className="eh-payment-label disabled">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  disabled
                />
                <div className="eh-payment-meta">
                  <strong>Credit / Debit Token Handoff</strong>
                  <span className="eh-coming-soon">Payment gateway API integration pending.</span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="eh-place-order-btn"
              disabled={loading || !isAuthenticated}
            >
              {loading ? (
                "Authorizing Secure Payload..."
              ) : (
                `Deploy Secure Order • $${total.toFixed(2)}`
              )}
            </button>
          </form>
        </div>

        {/* Right Side Sticky Node: Order Summary Panel */}
        <div className="eh-order-summary-sidebar">
          <div className="eh-summary-container">
            <h2>Order Allocations</h2>
            
            <div className="eh-summary-items-list">
              {normalizedItems.map((item, i) => (
                <div key={i} className="eh-summary-item-row">
                  <div className="eh-summary-item-thumb">
                    <img
                      src={getImageSrc(item.image)}
                      alt={item.name}
                      onError={(e) => { e.target.src = "https://placehold.co/50x50?text=?"; e.target.onerror = null; }}
                    />
                  </div>
                  <div className="eh-summary-item-info">
                    <span className="eh-item-name">{item.name}</span>
                    <span className="eh-item-qty">Quantity × {item.quantity}</span>
                  </div>
                  <span className="eh-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="eh-summary-totals-block">
              <div className="eh-total-row">
                <span>Subtotal Node</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="eh-total-row">
                <span>Logistics / Shipping</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="eh-free-text">FREE</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="eh-total-row eh-grand-total-row">
                <span>Grand Aggregate Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="eh-trust-guarantee">
              <div className="eh-trust-line">
                <ShieldCheck size={16} />
                <span>256-Bit Hardware Layer Protection</span>
              </div>
              <div className="eh-trust-line">
                <Truck size={16} />
                <span>Dispatched Via Insured Priority Pipeline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;