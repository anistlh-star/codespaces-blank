// ecommerce/frontend/src/pages/AdminPages/OtherPages/OrderDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../../../context/AuthContext";
import API from "../../../../api";
import { 
  ArrowLeft, 
  Hash, 
  Clock, 
  MapPin, 
  CreditCard, 
  Package, 
  ShieldAlert,
  Disc
} from "lucide-react";
import "./OrderDetails.css";
import { imageHelper } from "../../../utilis/imageHelper";

const OrderDetails = () => {
  const { id } = useParams();
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
            "Failed to synchronize targeting architecture matching this order ID configuration node."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user]);

  if (!user) {
    return (
      <div className="eh-details-page eh-details-centered">
        <div className="eh-details-fallback">
          <ShieldAlert size={40} className="eh-details-err-icon" />
          <h2>Client Context Unassigned</h2>
          <p>Please establish security credentials prior to inspecting this route mapping.</p>
          <button className="eh-details-btn eh-details-btn-primary" onClick={() => navigate("/login")}>
            Authorize Account
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="eh-details-page eh-details-centered">
        <div className="eh-details-spinner-block">
          <div className="eh-details-spinner"></div>
          <p>Analyzing parameters for order record allocation...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="eh-details-page eh-details-centered">
        <div className="eh-details-fallback">
          <ShieldAlert size={40} className="eh-details-err-icon" />
          <h2>Query Exception</h2>
          <p>{error || "The targeted object reference could not be localized on current cluster configurations."}</p>
          <button className="eh-details-btn eh-details-btn-secondary" onClick={() => navigate("/my-orders")}>
            <ArrowLeft size={14} />
            <span>Return to Orders Index</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="eh-details-page"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="eh-details-wrapper">
        
        {/* Navigation / Header Actions Row */}
        <div className="eh-details-header">
          <button className="eh-details-back-trigger" onClick={() => navigate("/my-orders")}>
            <ArrowLeft size={16} />
            <span>Back to Orders List</span>
          </button>
          <h1>ORDER DETAILS</h1>
        </div>

        {/* Master Details Metadata Layout Card */}
        <div className="eh-details-grid-layout">
          
          <div className="eh-details-main-rail">
            <div className="eh-details-card eh-details-meta-summary">
              <div className="eh-details-summary-row">
                <div className="eh-details-meta-pill">
                  <Hash size={14} />
                  <span>ID: {order._id.toUpperCase()}</span>
                </div>
                <div className="eh-details-meta-pill">
                  <Clock size={14} />
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </span>
                </div>
                <span className={`eh-details-tag eh-details-tag-${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Hardware Items Distribution Array mapping */}
            <div className="eh-details-card">
              <div className="eh-details-card-title">
                <Package size={18} />
                <h2>Allocated Payload Items</h2>
              </div>
              <div className="eh-details-items-list">
                {order.items.map((item) => (
                  <div key={item._id || item.product} className="eh-details-item-row">
                    <div className="eh-details-item-thumb">
                      <img
                       src={imageHelper(item.images)}
                        alt={item.name}
                        onError={(e) => (e.target.src = "/images/placeholder.jpg")}
                      />
                    </div>
                    <div className="eh-details-item-info">
                      <h4>
                        <Link to={`/product/${item.product?._id || item.product}`}>{item.name}</Link>
                      </h4>
                      <div className="eh-details-item-meta-metrics">
                        <span>Unit Matrix: ${item.price.toFixed(2)}</span>
                        <Disc size={4} />
                        <span>Load Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <div className="eh-details-item-valuation">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Component Nodes */}
          <div className="eh-details-side-rail">
            
            {/* Financial Invoice Breakdown mapping block */}
            <div className="eh-details-card eh-details-invoice-card">
              <h2>Pricing</h2>
              <div className="eh-details-invoice-metrics">
                <div className="eh-details-invoice-line">
                  <span>Calculated Cost</span>
                  <span>${order.subTotal?.toFixed(2) || order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="eh-details-invoice-line">
                  <span>Surcharge Fee / Tax (5%)</span>
                  <span>${order.tax?.toFixed(2) || "0.00"}</span>
                </div>
                <div className="eh-details-invoice-line eh-details-invoice-grand">
                  <span>Total price</span>
                  <span>${order.calculatedTotal?.toFixed(2) || order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Logistics Address node mappings */}
            <div className="eh-details-card">
              <div className="eh-details-card-title">
                <MapPin size={16} />
                <h2>Shipping address</h2>
              </div>
              <div className="eh-details-address-block">
                <p className="eh-details-recipient">{order.shippingAddress.fullName || user.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
                <p className="eh-details-country-line">{order.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Context Parameters blocks */}
            <div className="eh-details-card">
              <div className="eh-details-card-title">
                <CreditCard size={16} />
                <h2>Payment Method</h2>
              </div>
              <div className="eh-details-payment-block">
                <div className="eh-details-payment-line">
                  <span>Processing Method</span>
                  <strong>{order.paymentMethod.toUpperCase()}</strong>
                </div>
                <div className="eh-details-payment-line">
                  <span>Settlement Status</span>
                  <span className={`eh-details-payment-status eh-details-pay-${order.paymentStatus.toLowerCase()}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default OrderDetails;