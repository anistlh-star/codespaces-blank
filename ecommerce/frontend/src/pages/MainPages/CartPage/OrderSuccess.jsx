// ecommerce/frontend/src/pages/MainPages/CartPage/OrderSuccess.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../../../context/AuthContext';
import { ShieldCheck, ArrowRight, ShoppingCart, HelpCircle, Mail, Phone } from 'lucide-react';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { user } = useAuth();

  return (
    <div className="eh-success-page">
      <motion.div 
        className="eh-success-card"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15, duration: 0.5 }}
      >
        {/* Animated Checkmark Indicator Container */}
        <div className="eh-success-icon-shield">
          <div className="eh-success-pulse-ring"></div>
          <ShieldCheck size={52} className="eh-success-vector" />
        </div>

        <h1>Allocation Successful</h1>
        
        <p className="eh-success-greeting">
          Thank you for choosing ElectroHub, <strong>{user?.name || "Client Matrix User"}</strong>. Your device allocation order has been integrated.
        </p>

        <div className="eh-success-info-panel">
          <p>Your payload processing sequences are currently running.</p>
          <p>An administrative dispatch notification will be relayed via secure email pipelines shortly.</p>
          <div className="eh-success-eta-tag">
            <span>Logistics Priority Window:</span>
            <strong>3–5 Business Days</strong>
          </div>
        </div>

        {/* Action Route Navigation Switches */}
        <div className="eh-success-action-group">
          <Link to="/my-orders" className="eh-success-nav-btn eh-success-btn-filled">
            <span>Access Orders Ledger</span>
            <ArrowRight size={16} />
          </Link>
          
          <Link to="/" className="eh-success-nav-btn eh-success-btn-border">
            <ShoppingCart size={16} />
            <span>Continue Procurement</span>
          </Link>
        </div>

        {/* Administrative Technical Support Elements */}
        <div className="eh-success-support-tray">
          <div className="eh-success-support-label">
            <HelpCircle size={14} />
            <span>Need Systems Assistance?</span>
          </div>
          <div className="eh-success-support-links">
            <a href="mailto:support@yourstore.pk" className="eh-success-channel">
              <Mail size={13} />
              <span>support@yourstore.pk</span>
            </a>
            <span className="eh-success-divider-pipe">|</span>
            <a href="tel:+923001234567" className="eh-success-channel">
              <Phone size={13} />
              <span>+92 300 1234567</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;