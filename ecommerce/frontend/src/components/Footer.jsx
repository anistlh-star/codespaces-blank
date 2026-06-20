//ecommerce/frontend/src/components/Footer.jsx
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
    <footer className="site-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-top">
          {/* Column 1 - About */}
          <div className="footer-column">
            <h3 className="footer-title">About Us</h3>
            <p className="footer-text">
              We offer the best products at the most affordable prices. Shop
              with confidence and enjoy fast delivery across the country.
            </p>
            <div className="footer-socials">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="footer-column">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/shop">Shop</Link>
              </li>
              <li>
                <Link to="/categories">Categories</Link>
              </li>
              <li>
                <Link to="/aboutus">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/faq">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Customer Service */}
          <div className="footer-column">
            <h3 className="footer-title">Customer Service</h3>
            <ul className="footer-links">
              <li>
                <Link to="/shipping">Shipping & Delivery</Link>
              </li>
              <li>
                <Link to="/returns">Returns & Refunds</Link>
              </li>
              <li>
                <Link to="/terms">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
             
            </ul>
          </div>

          {/* Column 4 - Contact Info */}
          <div className="footer-column">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="footer-contact">
              <li>
                <FaMapMarkerAlt className="footer-icon" />
                <span>123 Shopping Street, Rawalpindi, Punjab, Pakistan</span>
              </li>
              <li>
                <FaPhone className="footer-icon" />
                <span>+92 300 1234567</span>
              </li>
              <li>
                <FaEnvelope className="footer-icon" />
                <span>support@yourstore.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            © {currentYear} ElectroHub. All Rights Reserved.
          </div>

          <div className="footer-payment">
            <img
              src="/images/payment-methods.png"
              alt="Payment Methods: Visa, Mastercard, JazzCash, EasyPaisa, Bank Transfer"
              className="payment-img"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
