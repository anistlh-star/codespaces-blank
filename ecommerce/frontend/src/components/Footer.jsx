// ecommerce/frontend/src/components/Footer.jsx
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ecom-site-footer">
      <div className="ecom-footer-container">
        
        {/* Main Operational Data Grid */}
        <div className="ecom-footer-grid">
          
          {/* Section 1 - Brand Identity Focus */}
          <div className="ecom-footer-column broad">
            <h3 className="ecom-footer-title">ElectroHub</h3>
            <p className="ecom-footer-text">
              Engineered ecosystems and professional hardware designed for peak technical computation and minimalist setups.
            </p>
            <div className="ecom-footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook Link">
                <FaFacebookF size={14} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter Link">
                <FaTwitter size={14} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram Link">
                <FaInstagram size={14} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Link">
                <FaLinkedinIn size={14} />
              </a>
            </div>
          </div>

          {/* Section 2 - Marketplace Routers */}
          <div className="ecom-footer-column">
            <h4 className="ecom-footer-subtitle">Explore</h4>
            <ul className="ecom-footer-links">
              <li><Link to="/shop">All Collections</Link></li>
              <li><Link to="/featured">Featured Hardware</Link></li>
              <li><Link to="/trending">Trending Releases</Link></li>
            </ul>
          </div>

          {/* Section 3 - Legal Compliance & Parameters */}
          <div className="ecom-footer-column">
            <h4 className="ecom-footer-subtitle">Information</h4>
            <ul className="ecom-footer-links">
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/support">Customer Support</Link></li>
            </ul>
          </div>

          {/* Section 4 - Verified Coordinates */}
          <div className="ecom-footer-column queries">
            <h4 className="ecom-footer-subtitle">Corporate Office</h4>
            <ul className="ecom-footer-contact">
              <li>
                <FaMapMarkerAlt className="contact-icon" />
                <span>123 Shopping Street, Rawalpindi, Punjab, Pakistan</span>
              </li>
              <li>
                <FaPhone className="contact-icon" />
                <span>+92 300 1234567</span>
              </li>
              <li>
                <FaEnvelope className="contact-icon" />
                <span>support@electrohub.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Closing Sub-layer Block */}
        <div className="ecom-footer-bottom">
          <div className="ecom-footer-copyright">
            &copy; {currentYear} ElectroHub. Instruments of precision execution.
          </div>

          <div className="ecom-footer-payment">
            <img
              src="/images/payment-methods.png"
              alt="Supported Settlement Portals: Visa, Mastercard, Secure API Banking"
              className="payment-clearing-img"
              onError={(e) => { e.target.style.display = 'none'; }} // Hides safely if asset is absent
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;