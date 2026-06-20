// ecommerce/frontend/src/pages/Misc/PrivacyPolicy.jsx
import React from 'react';
import './Terms&Conditions.css';

const PrivacyPolicy = () => {
  return (
    <div className="misc-page privacy-page">
      <div className="misc-hero">
        <h1>Privacy Policy</h1>
        <p>How we protect your data</p>
      </div>

      <div className="misc-container">
        <section className="misc-section">
          <h2>Introduction</h2>
          <p>YourStore ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information.</p>
        </section>

        <section className="misc-section">
          <h2>Information We Collect</h2>
          <p>We may collect:</p>
          <ul className="misc-list">
            <li>Personal details: name, email, phone, address.</li>
            <li>Payment information (processed securely by third-party gateways).</li>
            <li>Order history and preferences.</li>
            <li>Technical data: IP address, browser type, device info.</li>
          </ul>
        </section>

        <section className="misc-section">
          <h2>How We Use Your Information</h2>
          <ul className="misc-list">
            <li>To process and deliver orders.</li>
            <li>To communicate about your orders and promotions (with consent).</li>
            <li>To improve our website and services.</li>
            <li>To comply with legal obligations.</li>
          </ul>
        </section>

        <section className="misc-section">
          <h2>Sharing Your Information</h2>
          <p>We do not sell your data. We may share with trusted third parties for order fulfillment (couriers, payment processors) and legal requirements.</p>
        </section>

        <section className="misc-section">
          <h2>Data Security</h2>
          <p>We use industry-standard encryption and security measures. However, no method of transmission over the Internet is 100% secure.</p>
        </section>

        <section className="misc-section">
          <h2>Your Rights</h2>
          <p>You may access, correct, or delete your personal data by contacting us. You can opt out of marketing emails at any time.</p>
        </section>

        <section className="misc-section">
          <h2>Cookies</h2>
          <p>We use cookies to enhance your browsing experience. You can disable cookies in your browser settings.</p>
        </section>

        <section className="misc-section">
          <h2>Changes to Policy</h2>
          <p>We may update this policy. Continued use after changes constitutes acceptance.</p>
        </section>

        <section className="misc-section">
          <h2>Contact Us</h2>
          <p>For privacy concerns, email privacy@yourstore.com.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;