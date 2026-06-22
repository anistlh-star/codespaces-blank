// ecommerce/frontend/src/pages/MainPages/CartPage/CartPage.jsx
import { useCart } from "../../../../context/CartContext";
import "./CartPage.css";
import { Link } from "react-router-dom";

const CartPage = () => {
  const { cart, removeFromCart, updateCartItem } = useCart();

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="checkout-button">
          <button>
            <Link to="/my-orders">My Orders</Link>
          </button>
        </div>
        <p className="empty-cart-message">Your cart is empty</p>
      </div>
    );
  }

  const subtotal = cart.totalAmount || 0;

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      <div className="cart-items">
        {cart.items.map((item) => {
          // Extract the populated product data safely
          const productInfo = item.productId || {};
          // Extract the true string ID safely regardless of population state
          const trueProductId = productInfo._id || item.productId;

          return (
            <div key={trueProductId} className="cart-item">
              <div className="cart-item-image">
                {/* FIX: Read images from the populated productInfo object */}
                <img
                  src={productInfo.images?.[0] || "/images/placeholder.jpg"}
                  alt={productInfo.name || "Product"}
                />
              </div>

              <div className="cart-item-details">
                {/* FIX: Read name and price from productInfo */}
                <h4 className="cart-item-name">
                  {productInfo.name || "Unknown Product"}
                </h4>
                <p className="cart-item-price">
                  ${(productInfo.price || 0).toFixed(2)}
                </p>
                <p className="cart-item-quantity">Qty: {item.quantity}</p>
              </div>

              {/* FIX: Pass the true string ID to your context action methods */}
              <button
                className="cart-item-remove"
                onClick={() => removeFromCart(trueProductId)}
              >
                Remove
              </button>

              <div className="quantity-control">
                <button
                  onClick={() =>
                    updateCartItem(trueProductId, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  −
                </button>

                <span className="quantity-display">{item.quantity}</span>

                <button
                  onClick={() =>
                    updateCartItem(trueProductId, item.quantity + 1)
                  }
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-total">
        <h3>Subtotal</h3>
        <span className="cart-total-amount">${subtotal.toFixed(2)}</span>
      </div>

      <div className="checkout-button">
        <button>
          <Link to="/checkout">Proceed to Checkout</Link>
        </button>
      </div>
    </div>
  );
};

export default CartPage;
