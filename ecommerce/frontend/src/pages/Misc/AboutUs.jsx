// ecommerce/frontend/src/pages/Misc/AboutUs.jsx
import React from 'react';
import './AboutUs.css';
import { FaBullseye, FaEye, FaHeart } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="misc-page about-page">
      <div className="misc-hero">
        <h1>About Us</h1>
        <p>Your trusted online store since 2025</p>
      </div>

      <div className="misc-container">
        <section className="about-story misc-section">
          <h2>Our Story</h2>
          <p>Founded in 2025, YourStore began with a simple mission: to make quality products accessible to everyone in Pakistan. What started as a small team of passionate individuals has grown into a trusted online destination for thousands of customers.</p>
          <p>We believe in offering not just products, but an exceptional shopping experience. From carefully curated collections to fast delivery and responsive customer support, every detail matters.</p>
        </section>

        <div className="about-values-grid">
          <div className="value-card">
            <FaBullseye className="value-icon" />
            <h3>Our Mission</h3>
            <p>To provide high-quality products at affordable prices with seamless service, while building lasting relationships with our customers.</p>
          </div>
          <div className="value-card">
            <FaEye className="value-icon" />
            <h3>Our Vision</h3>
            <p>To become Pakistan's most loved online shopping destination, known for reliability, innovation, and customer-centricity.</p>
          </div>
          <div className="value-card">
            <FaHeart className="value-icon" />
            <h3>Our Values</h3>
            <p>Integrity, transparency, and a genuine care for our customers and community guide everything we do.</p>
          </div>
        </div>

        <section className="about-team misc-section">
          <h2>Meet the Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <img src="https://placehold.co/200x200/2563eb/white?text=Ali" alt="Ali" />
              <h4>Ali Raza</h4>
              <p>Founder & CEO</p>
            </div>
            <div className="team-member">
              <img src="https://placehold.co/200x200/2563eb/white?text=Sara" alt="Sara" />
              <h4>Sara Khan</h4>
              <p>Head of Operations</p>
            </div>
            <div className="team-member">
              <img src="https://placehold.co/200x200/2563eb/white?text=Usman" alt="Usman" />
              <h4>Usman Ahmed</h4>
              <p>Customer Experience</p>
            </div>
          </div>
        </section>

        <section className="about-cta misc-section">
          <h2>Join Our Journey</h2>
          <p>We're just getting started. Follow us on social media or sign up for our newsletter to stay updated on new arrivals, exclusive offers, and more.</p>
          <div className="cta-buttons">
            <a href="/shop" className="btn btn-primary">Shop Now</a>
            <a href="/contact" className="btn btn-secondary">Contact Us</a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;