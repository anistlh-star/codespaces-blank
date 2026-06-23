// ecommerce/frontend/src/pages/AdminPages/OtherPages/MyOrders.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../../../context/AuthContext";
import API from "../../../../api/index";
import { useOrder } from "../../../hooks/useOrder";
import { 
  ShoppingBag, 
  Calendar, 
  DollarSign, 
  Layers, 
  CreditCard, 
  AlertCircle, 
  ArrowRight, 
  XCircle,
  RefreshCw
} from "lucide-react";
import "./MyOrders.css";

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
        setError("Failed to synchronize your historical transaction records.");
        setLoading(false);
        console.error("Orders fetch error:", err);
      }
    };

    fetchOrders();
  }, [user?._id]);

  if (!user) {
    return (
      <div className="eh-orders-page eh-orders-empty-state">
        <div className="eh-orders-fallback-card">
          <AlertCircle size={40} className="eh-orders-alert-icon" />
          <h2>Authentication Required</h2>
          <p>Please log in to review your personal order history pipeline.</p>
          <button className="eh-orders-btn eh-orders-btn-primary" onClick={() => navigate("/login")}>
            Go to Login Matrix
          </button>
        </div>
      </div>
    );
  }

  // Animation layout dictionaries
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } }
  };

  return (
    <div className="eh-orders-page">
      <motion.div 
        className="eh-orders-container"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="eh-orders-header">
          <div className="eh-orders-title-block">
            <ShoppingBag className="eh-orders-header-icon" />
            <h1>Your Orders</h1>
          </div>
          <p className="eh-orders-subtitle">You can Track, inspect, and manage your current Orders and their status.</p>
        </div>

        {loading ? (
          <div className="eh-orders-loading-box">
            <div className="eh-orders-spinner"></div>
            <p>Retrieving transaction nodes...</p>
          </div>
        ) : error ? (
          <div className="eh-orders-error-box">
            <AlertCircle size={24} />
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="eh-orders-btn eh-orders-btn-secondary">
              <RefreshCw size={14} />
              <span>Retry Sync</span>
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="eh-orders-empty-box">
            <ShoppingBag size={48} className="eh-orders-empty-icon" />
            <p>No transaction parameters found matching this client profile.</p>
            <button onClick={() => navigate("/shop")} className="eh-orders-btn eh-orders-btn-primary">
              Start Shopping
            </button>
          </div>
        ) : (
          <motion.div className="eh-orders-list" variants={containerVariants}>
            {orders.map((order) => (
              <motion.div
                key={order._id}
                className="eh-orders-card"
                variants={itemVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div className="eh-orders-card-header">
                  <div className="eh-orders-id-group">
                    <span className="eh-orders-label">ORDER NODE</span>
                    <h3>#{order._id.slice(-6).toUpperCase()}</h3>
                  </div>
                  <span className={`eh-orders-status eh-orders-status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div className="eh-orders-details-grid">
                  <div className="eh-orders-meta-node">
                    <Calendar size={16} />
                    <div>
                      <span className="eh-orders-node-label">Timestamp</span>
                      <p>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="eh-orders-meta-node">
                    <DollarSign size={16} />
                    <div>
                      <span className="eh-orders-node-label">Total Volume</span>
                      <p className="eh-orders-price-weight">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="eh-orders-meta-node">
                    <Layers size={16} />
                    <div>
                      <span className="eh-orders-node-label">Item Load</span>
                      <p>{order.items.length} {order.items.length === 1 ? "Product" : "Products"}</p>
                    </div>
                  </div>

                  <div className="eh-orders-meta-node">
                    <CreditCard size={16} />
                    <div>
                      <span className="eh-orders-node-label">Payment Channel</span>
                      <p>{order.paymentMethod.toUpperCase()} <span className="eh-orders-substatus">({order.paymentStatus})</span></p>
                    </div>
                  </div>
                </div>

                <div className="eh-orders-card-actions">
                  {order.status === "Pending" && (
                    <button
                      className="eh-orders-btn eh-orders-btn-danger"
                      onClick={async () => {
                        if (await cancelOrder(order._id)) {
                          setOrders((prev) => prev.filter((o) => o._id !== order._id));
                        }
                      }}
                    >
                      <XCircle size={14} />
                      <span>Revoke Order</span>
                    </button>
                  )}
                  <button
                    className="eh-orders-btn eh-orders-btn-primary"
                    onClick={() => navigate(`/my-orders/${order._id}`)}
                  >
                    <span>View Node Metrics</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default MyOrders;