// ecommerce/frontend/src/pages/Misc/Returns&Refunds.jsx
import React from 'react';
import './Returns&Refunds.css';

const ReturnsRefunds = () => {
  return (
    <div className="misc-page returns-page">
      <div className="misc-hero">
        <h1>Returns & Refunds</h1>
        <p>Hassle-free returns within 30 days</p>
      </div>

      <div className="misc-container">
        <section className="misc-section">
          <h2>Return Policy</h2>
          <p>You may return most items within 30 days of delivery for a full refund or exchange. Items must be unused, in original packaging, and with all tags attached.</p>
        </section>

        <section className="misc-section">
          <h2>Non-Returnable Items</h2>
          <ul className="misc-list">
            <li>Gift cards</li>
            <li>Personal care items (e.g., headphones, if hygiene seal broken)</li>
            <li>Downloadable software</li>
            <li>Customized products</li>
          </ul>
        </section>

        <section className="misc-section">
          <h2>How to Initiate a Return</h2>
          <ol className="misc-list numbered">
            <li>Log into your account and go to Orders.</li>
            <li>Select the item and click "Return Item".</li>
            <li>Choose a reason and submit.</li>
            <li>You'll receive a return shipping label via email.</li>
            <li>Pack the item securely and drop it off at the nearest courier center.</li>
          </ol>
        </section>

        <section className="misc-section">
          <h2>Refund Process</h2>
          <p>Once we receive and inspect your return, we'll notify you of the approval. If approved, your refund will be processed to the original payment method within 5–7 business days.</p>
        </section>

        <section className="misc-section">
          <h2>Exchanges</h2>
          <p>To exchange an item, return it for a refund and place a new order. This ensures fastest processing.</p>
        </section>

        <section className="misc-section">
          <h2>Damaged or Defective Items</h2>
          <p>If you receive a damaged or defective item, contact us within 48 hours of delivery at returns@yourstore.com with your order number and photos. We'll arrange a replacement or full refund.</p>
        </section>

        <section className="misc-section">
          <h2>Shipping Costs for Returns</h2>
          <p>If the return is due to our error (wrong item, damaged), we'll cover the shipping cost. Otherwise, the customer pays return shipping.</p>
        </section>

        <section className="misc-section">
          <h2>Contact</h2>
          <p>For return questions, email returns@yourstore.com or call +92 300 1234567.</p>
        </section>
      </div>
    </div>
  );
};

export default ReturnsRefunds;