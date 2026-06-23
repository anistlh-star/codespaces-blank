//ecommerce/frontend/src/pages/AdminPages/OrdersComponent/OrderFormModal.jsx
import React, { useState, useEffect } from "react";
import API from "../../../../api";
import "./OrderFormModal.css";

const OrderFormModal = ({ order, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    status: "pending",
    paymentStatus: "unpaid",
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    subTotal: 0,
    tax: 0,
    totalAmount: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form with existing order metrics safely
  useEffect(() => {
    if (order) {
      setForm({
        status: order.status || "pending",
        paymentStatus: order.paymentStatus || "unpaid",
        shippingAddress: {
          street: order.shippingAddress?.street || "",
          city: order.shippingAddress?.city || "",
          state: order.shippingAddress?.state || "",
          zip: order.shippingAddress?.zip || "",
        },
        subTotal: order.subTotal || 0,
        tax: order.tax || 0,
        totalAmount: order.totalAmount || 0,
      });
    }
  }, [order]);

  // Recalculate values dynamically if subtotal changes
  const handleSubTotalChange = (value) => {
    const sub = parseFloat(value) || 0;
    const computedTax = parseFloat((sub * 0.05).toFixed(2)); // Matches your 5% tax rule
    const computedTotal = parseFloat((sub + computedTax).toFixed(2));

    setForm((prev) => ({
      ...prev,
      subTotal: sub,
      tax: computedTax,
      totalAmount: computedTotal,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Endpoint architecture mirrors /admin/orders setup
      await API.put(`/admin/orders/${order._id}`, form);
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "An unexpected error occurred modifying this order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-modal-overlay">
      <div className="order-modal-content">
        <div className="order-modal-header">
          <h2>Modify Order Ledger</h2>
          <p className="order-modal-subtitle">
            ID: <span className="order-id-highlight">{order?._id}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="order-input-row">
            <div className="order-input-group">
              <label>Fulfillment Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="on hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="order-input-group">
              <label>Payment State</label>
              <select
                value={form.paymentStatus}
                onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div className="order-section-divider">Fulfillment Allocation</div>
          
          <div className="order-input-group">
            <label>Street Address</label>
            <input
              type="text"
              placeholder="123 Main St"
              value={form.shippingAddress.street}
              onChange={(e) =>
                setForm({
                  ...form,
                  shippingAddress: { ...form.shippingAddress, street: e.target.value },
                })
              }
            />
          </div>

          <div className="order-input-row custom-three-col">
            <div className="order-input-group">
              <label>City</label>
              <input
                type="text"
                value={form.shippingAddress.city}
                onChange={(e) =>
                  setForm({
                    ...form,
                    shippingAddress: { ...form.shippingAddress, city: e.target.value },
                  })
                }
              />
            </div>
            <div className="order-input-group">
              <label>State</label>
              <input
                type="text"
                value={form.shippingAddress.state}
                onChange={(e) =>
                  setForm({
                    ...form,
                    shippingAddress: { ...form.shippingAddress, state: e.target.value },
                  })
                }
              />
            </div>
            <div className="order-input-group">
              <label>Postal Code</label>
              <input
                type="text"
                value={form.shippingAddress.zip}
                onChange={(e) =>
                  setForm({
                    ...form,
                    shippingAddress: { ...form.shippingAddress, zip: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="order-section-divider">Financial Accounting</div>

          <div className="order-input-row">
            <div className="order-input-group">
              <label>Base Subtotal ($)</label>
              <input
                type="number"
                step="0.01"
                value={form.subTotal}
                onChange={(e) => handleSubTotalChange(e.target.value)}
              />
            </div>
            <div className="order-input-group">
              <label>Tax Calculated (5%)</label>
              <input type="number" value={form.tax} readOnly className="read-only-field" />
            </div>
          </div>

          <div className="order-total-banner">
            <span>Aggregated Gross Total</span>
            <span className="banner-amount">${form.totalAmount.toFixed(2)}</span>
          </div>

          <div className="order-modal-buttons">
            <button type="button" onClick={onClose} className="order-btn secondary">
              Dismiss
            </button>
            <button type="submit" className="order-btn primary" disabled={isSubmitting}>
              {isSubmitting ? "Committing records..." : "Update Order Registry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderFormModal;