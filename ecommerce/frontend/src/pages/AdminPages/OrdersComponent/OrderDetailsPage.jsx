//ecommerce/frontend/src/pages/AdminPages/OrdersComponent/OrderDetailsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../../../../api";
import "../../../../styles/pages/AdminPages/OrderComponent/OrderDetailsPage.css";
import { FaCreditCard } from "react-icons/fa6";
import { CiBank } from "react-icons/ci";
import { IoIosCash } from "react-icons/io";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [subTotal, setSubTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/admin/orders/${id}`);
        const data = res.data;

        setOrder(data.order || data);

        // Prefer backend-calculated values
        setSubTotal(data.subTotal || 0);
        setTax(data.tax || 0);
        setTotalAmount(data.totalAmount || 0);

      } catch (err) {
        setError("Failed to load order details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="order-details-page__loading">
        Loading order details...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-details-page__error">
        {error || "Order not found"}
      </div>
    );
  }

  const {
    _id,
    createdAt,
    status,
    shippingAddress = {},
    billingAddress = {},
    paymentMethod,
    items = [],
    user,
  } = order;

  // Fallback calculation only if backend didn't provide
  const calculatedSubtotal =
    subTotal ||
    items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0,
    );

  const calculatedTax = tax || calculatedSubtotal * 0.05;
  const calculatedTotal = totalAmount || calculatedSubtotal + calculatedTax;

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString("en-US", {
          dateStyle: "long",
          timeStyle: "short",
        })
      : "—";

  const getPaymentDisplay = () => {
    const method = (paymentMethod || "").toLowerCase();

    if (
      method.includes("card") ||
      method.includes("visa") ||
      method.includes("card payment")
    ) {
      return (
        <>
          <FaCreditCard className="order-details-page__payment-icon" />
          <span>Card Payment</span>
        </>
      );
    }

    if (method.includes("online") || method.includes("online payment")) {
      return (
        <>
          <CiBank className="order-details-page__payment-icon" />
          <span>Online Payment</span>
        </>
      );
    }

    if (
      method.includes("cash") ||
      method.includes("cod") ||
      method.includes("cash on delivery")
    ) {
      return (
        <>
          <IoIosCash className="order-details-page__payment-icon" />
          <span>Cash on Delivery</span>
        </>
      );
    }

    return <span>{paymentMethod || "Unknown"}</span>;
  };

  return (
    <div className="order-details-page">
      {/* Header */}
      <div className="order-details-page__header">
        <h1 className="order-details-page__title">
          Order Details: #{_id?.slice(-6) || "N/A"}
        </h1>
        <p className="order-details-page__date">{formatDate(createdAt)}</p>
        <div className="order-details-page__status">
          Status:{" "}
          <span
            className={`order-details-page__status-badge order-details-page__status--${status?.toLowerCase() || "unknown"}`}
          >
            {status || "Unknown"}
          </span>
        </div>
      </div>

      {/* Addresses & Payment */}
      <div className="order-details-page__grid">
        {/* Billing Address */}
        <div className="order-details-page__card">
          <h3 className="order-details-page__card-title">Billing Address</h3>
          <p className="order-details-page__name">
            {billingAddress?.name ||shippingAddress?.name }
          </p>
          <p>{billingAddress?.street ||shippingAddress?.street }</p>
          <p>
            {billingAddress?.city || shippingAddress?.city }, {billingAddress?.state ||shippingAddress?.state}{" "}
            {billingAddress?.zipCode || shippingAddress?.zipCode}
          </p>
          <p>Email: {user?.email || "—"}</p>
          <p>Phone: {user?.phone || "—"}</p>
        </div>

        {/* Shipping Address */}
        <div className="order-details-page__card">
          <h3 className="order-details-page__card-title">Shipping Address</h3>
          <p className="order-details-page__name">
            {shippingAddress?.name || "—"}
          </p>
          <p>{shippingAddress?.street || "—"}</p>
          <p>
            {shippingAddress?.city || "—"}, {shippingAddress?.state || "—"}{" "}
            {shippingAddress?.zipCode || "—"}
          </p>
          <p className="order-details-page__note">(Free Shipping)</p>
        </div>

        {/* Payment Method */}
        <div className="order-details-page__card">
          <h3 className="order-details-page__card-title">Payment Method</h3>
          <div className="order-details-page__payment">
            {getPaymentDisplay()}
          </div>
          <p className="order-details-page__name">
            {billingAddress?.name || "—"}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="order-details-page__products-section">
        <h2 className="order-details-page__section-title">Products</h2>

        <div className="order-details-page__table-wrapper">
          <table className="order-details-page__table">
            <thead>
              <tr>
                <th className="order-details-page__th">Products</th>
                <th className="order-details-page__th">Quantity</th>
                <th className="order-details-page__th">Rate</th>
                <th className="order-details-page__th">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="order-details-page__tr">
                  <td>
                    <strong>{item.name || "Unnamed Product"}</strong>
                    <br />
                    <small>{item.description || ""}</small>
                  </td>
                  <td>{item.quantity || 1}</td>
                  <td>${Number(item.price || 0).toFixed(2)}</td>
                  <td>
                    $
                    {(
                      Number(item.quantity || 1) * Number(item.price || 0)
                    ).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="order-details-page__tfoot-label">
                  Subtotal
                </td>
                <td>${subTotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan="3" className="order-details-page__tfoot-label">
                  Tax (5%)
                </td>
                <td>${tax.toFixed(2)}</td>
              </tr>
              <tr className="order-details-page__total-row">
                <td colSpan="3" className="order-details-page__tfoot-label">
                  Total
                </td>
                <td className="order-details-page__total-amount">
                  ${totalAmount.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
