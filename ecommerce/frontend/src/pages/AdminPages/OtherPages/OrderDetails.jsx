//ecommerce/frontend/src/pages/AdminPages/OtherPages/OrderDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetails.css"; // you'll create this
import { useAuth } from "../../../../context/AuthContext";
import API from "../../../../api";
import { Link } from "react-router-dom";
const OrderDetails = () => {
  const { id } = useParams(); // from /order/:id
  const { user } = useAuth();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/orders/${id}`);

        // Assuming backend returns { success, order, subTotal, tax, totalAmount }
        setOrder({
          ...res.data.order,
          subTotal: res.data.subTotal,
          tax: res.data.tax,
          calculatedTotal: res.data.totalAmount,
        });
      } catch (err) {
        console.error("Order fetch error:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load order details. It may not exist or you lack permission.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user]);

  if (!user) {
    return (
      <div className="order-details-page">
        <h2>Please log in to view order details</h2>
        <button onClick={() => navigate("/login")}>Go to Login</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner large"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="error-message">
        <h2>Error</h2>
        <p>{error || "Order not found"}</p>
        <button onClick={() => navigate("/my-orders")}>
          Back to My Orders
        </button>
      </div>
    );
  }

  return (
    <div className="order-details-page">
      <div className="order-details-container">
        <div className="header">
          <h1>Order Details</h1>
          <button
            className="btn back-btn"
            onClick={() => navigate("/my-orders")}
          >
            ← Back to Orders
          </button>
        </div>

        <div className="order-summary-card">
          <div className="order-meta">
            <div>
              <strong>Order ID:</strong> #{order._id.slice(-8).toUpperCase()}
            </div>
            <div>
              <strong>Placed on:</strong>{" "}
              {new Date(order.createdAt).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
            <div>
              <strong>Status:</strong>{" "}
              <span className={`status-badge ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>
                ${order.subTotal?.toFixed(2) || order.totalAmount.toFixed(2)}
              </span>
            </div>
            <div className="total-row">
              <span>Tax (5%):</span>
              <span>${order.tax?.toFixed(2) || "0.00"}</span>
            </div>
            <div className="total-row grand-total">
              <strong>Total:</strong>
              <strong>
                $
                {order.calculatedTotal?.toFixed(2) ||
                  order.totalAmount.toFixed(2)}
              </strong>
            </div>
          </div>
        </div>

        <h2>Shipping Address</h2>
        <div className="shipping-address">
          <p>{order.shippingAddress.street}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
            {order.shippingAddress.zipCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>

        <h2>Payment Information</h2>
        <div className="payment-info">
          <p>
            <strong>Method:</strong> {order.paymentMethod.toUpperCase()}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`status-badge ${order.paymentStatus.toLowerCase()}`}
            >
              {order.paymentStatus}
            </span>
          </p>
        </div>

        <h2>Order Items</h2>
        <div className="order-items-list">
          {order.items.map((item) => (
            <div key={item._id || item.product} className="order-item-row">
              <div className="item-image">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                />
              </div>
              <div className="item-info">
                <h4>
                  <Link to={`/product/${item.product._id}`}>{item.name}</Link>
                </h4>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p>Quantity: {item.quantity}</p>
                <p className="item-subtotal">
                  Subtotal: ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
