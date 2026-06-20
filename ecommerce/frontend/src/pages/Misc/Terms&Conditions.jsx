// ecommerce/frontend/src/pages/Misc/Terms&Conditions.jsx
import React from 'react';
import './Terms&Conditions.css';

const TermsConditions = () => {
  return (
    <div className="misc-page terms-page">
      <div className="misc-hero">
        <h1>Terms & Conditions</h1>
        <p>Last updated: January 2025</p>
      </div>

      <div className="misc-container">
        <section className="misc-section">
          <h2>1. Introduction</h2>
          <p>Welcome to YourStore. By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our services.</p>
        </section>

        <section className="misc-section">
          <h2>2. Definitions</h2>
          <p>"Account" means a registered user account. "Products" means items offered for sale. "Services" means all features offered on this site.</p>
        </section>

        <section className="misc-section">
          <h2>3. Eligibility</h2>
          <p>You must be at least 18 years old to make a purchase. By using this site, you represent that you are legally capable of entering into binding contracts.</p>
        </section>

        <section className="misc-section">
          <h2>4. Account Registration</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use.</p>
        </section>

        <section className="misc-section">
          <h2>5. Orders and Payment</h2>
          <p>All orders are subject to availability and acceptance. We reserve the right to cancel any order due to pricing errors or stock issues. Payment must be made at checkout via available methods.</p>
        </section>

        <section className="misc-section">
          <h2>6. Pricing</h2>
          <p>Prices are displayed in USD (or local currency) and include applicable taxes unless stated otherwise. We may change prices at any time without notice.</p>
        </section>

        <section className="misc-section">
          <h2>7. Shipping</h2>
          <p>Delivery times are estimates only. Risk of loss passes to you upon delivery. See our Shipping & Delivery page for details.</p>
        </section>

        <section className="misc-section">
          <h2>8. Returns and Refunds</h2>
          <p>You may return most items within 30 days. See our Returns & Refunds page for full policy.</p>
        </section>

        <section className="misc-section">
          <h2>9. Intellectual Property</h2>
          <p>All content on this site (text, images, logos) is our property and may not be used without written permission.</p>
        </section>

        <section className="misc-section">
          <h2>10. Limitation of Liability</h2>
          <p>We are not liable for indirect or consequential damages arising from use of our products or site.</p>
        </section>

        <section className="misc-section">
          <h2>11. Governing Law</h2>
          <p>These Terms are governed by the laws of Pakistan. Any disputes shall be resolved in the courts of Rawalpindi.</p>
        </section>

        <section className="misc-section">
          <h2>12. Changes to Terms</h2>
          <p>We may update these Terms. Continued use after changes constitutes acceptance.</p>
        </section>

        <section className="misc-section">
          <h2>13. Contact Us</h2>
          <p>If you have questions, contact us at support@yourstore.com or via our Contact page.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;