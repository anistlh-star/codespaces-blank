//ecommerce/frontend/src/pages/AdminPages/OtherPages/MyOrders.jsx
import React, { useState, useEffect } from "react";
import "./MyOrders.css";
import { useAuth } from "../../../../context/AuthContext";
import API from "../../../../api/index";
import { useOrder } from "../../../hooks/useOrder";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cancelOrder } = useOrder();
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id) return;

      try {
        const res = await API.get(`/orders/my-orders`);
        setOrders(res.data.orders || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load your orders");
        setLoading(false);
        console.error("Orders fetch error:", err);
      }
    };

    fetchOrders();
  }, [user?._id]);

  if (!user) {
    return (
      <div className="my-orders-page">
        <h2>Please log in to view your orders</h2>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="orders-container animate-fade-in">
        <h1>Your Orders</h1>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner large"></div>
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn secondary"
            >
              Retry
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <p>You haven't placed any orders yet.</p>
            <a href="/shop" className="btn primary">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order, index) => (
              <div
                key={order._id}
                className="order-card animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="order-header">
                  <h3>Order #{order._id.slice(-6).toUpperCase()}</h3>
                  <span
                    className={`status-badge ${order.status.toLowerCase()}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="order-details">
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p>
                    <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
                  </p>
                  <p>
                    <strong>Items:</strong> {order.items.length}
                  </p>
                  <p>
                    <strong>Payment:</strong>{" "}
                    {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                  </p>
                </div>

                <div className="order-actions">
                  <button
                    className="btn primary"
                    onClick={() => navigate(`/my-orders/${order._id}`)}
                  >
                    View Details
                  </button>{" "}
                  {order.status === "Pending" && (
                    <button
                      className="btn secondary"
                      onClick={async () => {
                        if (await cancelOrder(order._id)) {
                          setOrders((prev) =>
                            prev.filter((o) => o._id !== order._id),
                          );
                        }
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
