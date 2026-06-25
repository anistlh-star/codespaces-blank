// ecommerce/frontend/src/pages/MainPages/CartPage/CartPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../../../context/CartContext";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, CreditCard } from "lucide-react";
import "./CartPage.css";
import { getImageSrc } from "../../../components/imageHandler";

const CartPage = () => {
  const { cart, removeFromCart, updateCartItem } = useCart();

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <motion.div 
        className="eh-cart-page eh-cart-empty"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="eh-empty-card">
          <div className="eh-empty-icon-wrapper">
            <ShoppingBag className="eh-empty-icon" size={48} />
          </div>
          <h2>Your Cart is Empty</h2>
          <p>Explore ElectroHub's premium gadgets and power up your setup today.</p>
          <div className="eh-empty-actions">
            <Link to="/products" className="eh-btn eh-btn-primary">
              Browse Tech Specs
            </Link>
            <Link to="/my-orders" className="eh-btn eh-btn-secondary">
              View My Orders
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  const subtotal = cart.totalAmount || 0;

  return (
    <motion.div 
      className="eh-cart-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="eh-cart-container">
        <div className="eh-cart-header">
          <ShoppingBag className="eh-header-icon" />
          <h2>Your Shopping Cart</h2>
          <span className="eh-cart-count">{cart.items.length} Items</span>
        </div>

        <div className="eh-cart-layout">
          {/* Cart Items Column */}
          <div className="eh-cart-items-column">
            <AnimatePresence mode="popLayout">
              {cart.items.map((item) => {
                const productInfo = item.productId || {};
                const trueProductId = productInfo._id || item.productId;

                return (
                  <motion.div 
                    key={trueProductId} 
                    className="eh-cart-item"
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <div className="eh-cart-item-image">
                      <img
                        src={getImageSrc(productInfo.images?.[0])}
                        alt={productInfo.name || "Product"}
                        onError={(e) => { e.target.src = "https://placehold.co/90x90?text=No+Image"; e.target.onerror = null; }}
                      />
                    </div>

                    <div className="eh-cart-item-details">
                      <h4 className="eh-cart-item-name">
                        {productInfo.name || "Unknown Product"}
                      </h4>
                      <p className="eh-cart-item-price">
                        ${(productInfo.price || 0).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Adjustment Controls */}
                    <div className="eh-quantity-control">
                      <button
                        onClick={() => updateCartItem(trueProductId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="eh-qty-btn"
                        aria-label="Decrease quantity"
                      >
                       -
                      </button>

                      <span className="eh-quantity-display">{item.quantity}</span>

                      <button
                        onClick={() => updateCartItem(trueProductId, item.quantity + 1)}
                        className="eh-qty-btn"
                        aria-label="Increase quantity"
                      >
                     +
                      </button>
                    </div>

                    <div className="eh-cart-item-subtotal">
                      ${((productInfo.price || 0) * item.quantity).toFixed(2)}
                    </div>

                    <button
                      className="eh-cart-item-remove"
                      onClick={() => removeFromCart(trueProductId)}
                      aria-label="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Checkout Summary Card Sidebar */}
          <div className="eh-cart-summary-column">
            <div className="eh-summary-card">
              <h3>Order Summary</h3>
              
              <div className="eh-summary-row">
                <span>Subtotal</span>
                <span className="eh-summary-price">${subtotal.toFixed(2)}</span>
              </div>
              
              <div className="eh-summary-row eh-shipping-row">
                <span>Shipping</span>
                <span className="eh-free-badge">{subtotal > 100 ? "FREE" : "Calculated at next step"}</span>
              </div>

              <div className="eh-summary-divider" />

              <div className="eh-summary-total-row">
                <span>Estimated Total</span>
                <span className="eh-grand-total">${subtotal.toFixed(2)}</span>
              </div>

              <Link to="/checkout" className="eh-checkout-cta-btn">
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </Link>

              <div className="eh-security-badge">
                <CreditCard size={14} />
                <span>SSL Secured & Encrypted Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CartPage;