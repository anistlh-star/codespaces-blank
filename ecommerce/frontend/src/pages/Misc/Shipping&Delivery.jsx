// ecommerce/frontend/src/pages/Misc/Shipping&Delivery.jsx
import React from 'react';
import './Shipping&Delivery.css';

const ShippingDelivery = () => {
  return (
    <div className="misc-page shipping-page">
      <div className="misc-hero">
        <h1>Shipping & Delivery</h1>
        <p>Fast, reliable delivery across Pakistan</p>
      </div>

      <div className="misc-container">
        <section className="misc-section">
          <h2>Shipping Options</h2>
          <div className="shipping-grid">
            <div className="shipping-card">
              <h3>Standard Shipping</h3>
              <p className="price">$5.99</p>
              <p>Delivery in 5–7 business days</p>
            </div>
            <div className="shipping-card featured">
              <h3>Express Shipping</h3>
              <p className="price">$12.99</p>
              <p>Delivery in 2–3 business days</p>
            </div>
            <div className="shipping-card">
              <h3>Free Shipping</h3>
              <p className="price">$0.00</p>
              <p>On orders over $50 (Standard)</p>
            </div>
          </div>
        </section>

        <section className="misc-section">
          <h2>Processing Time</h2>
          <p>Orders are processed within 1–2 business days after payment confirmation. You will receive a tracking number once your order ships.</p>
        </section>

        <section className="misc-section">
          <h2>Delivery Areas</h2>
          <p>We deliver to all cities across Pakistan. Remote areas may take additional 2–3 days.</p>
        </section>

        <section className="misc-section">
          <h2>Tracking Your Order</h2>
          <p>Once shipped, you'll receive an email with a tracking link. You can also track your order from your account dashboard.</p>
        </section>

        <section className="misc-section">
          <h2>International Shipping</h2>
          <p>Currently, we only ship within Pakistan. International shipping will be available soon.</p>
        </section>

        <section className="misc-section">
          <h2>Shipping Delays</h2>
          <p>Occasionally, unforeseen circumstances may cause delays. We'll notify you if this happens and work to resolve it quickly.</p>
        </section>

        <section className="misc-section">
          <h2>Contact</h2>
          <p>For shipping inquiries, email shipping@yourstore.com or call +92 300 1234567.</p>
        </section>
      </div>
    </div>
  );
};

export default ShippingDelivery;