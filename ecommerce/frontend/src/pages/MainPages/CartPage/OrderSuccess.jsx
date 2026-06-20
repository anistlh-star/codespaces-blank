//ecommerce/frontend/src/pages/MainPages/CartPage/OrderSuccess.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './OrderSuccess.css';
import { useAuth } from '../../../../context/AuthContext';

const OrderSuccess = () => {
  const {user} = useAuth();
  return (
    <div className="order-success-container">
      <div className="success-card">
        <div className="check-circle">
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark-circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark-check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>

        <h1>Order Placed Successfully!</h1>
        
    <p className="thank-you">
  Thank you for your purchase, {user?.name || "there"}!
</p>

        <div className="order-info">
          <p>Your order has been received and is now being processed.</p>
          <p>You will receive a confirmation email/SMS shortly.</p>
          <p className="eta">
            Expected delivery: <strong>3–5 business days</strong>
          </p>
        </div>

        <div className="action-buttons">
          <Link to="/my-orders" className="btn primary">
            View My Orders
          </Link>
          
          <Link to="/" className="btn secondary">
            Continue Shopping
          </Link>
        </div>

        <div className="support-note">
          <p>Need help? Contact us at</p>
          <a href="mailto:support@yourstore.pk">support@yourstore.pk</a>
          <span> | </span>
          <a href="tel:+923001234567">+92 300 1234567</a>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;