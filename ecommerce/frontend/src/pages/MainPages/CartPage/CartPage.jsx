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

  const subtotal = cart.items.reduce(
    (acc, item) => acc + (item.price || 0) * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>

      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.productId} className="cart-item">
            <div className="cart-item-image">
              <img
                src={item.images?.[0] || "/images/placeholder.jpg"}
                alt={item.name || "Product"}
              />
            </div>

            <div className="cart-item-details">
              <h4 className="cart-item-name">
                {item.name || "Unknown Product"}
              </h4>
              <p className="cart-item-price">
                ${(item.price || 0).toFixed(2)}
              </p>
              <p className="cart-item-quantity">Qty: {item.quantity}</p>
            </div>

            <button
              className="cart-item-remove"
              onClick={() => removeFromCart(item.productId)}
            >
              Remove
            </button>

            <div className="quantity-control">
              <button
                onClick={() =>
                  updateCartItem(item.productId, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span className="quantity-display">{item.quantity}</span>

              <button
                onClick={() =>
                  updateCartItem(item.productId, item.quantity + 1)
                }
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        ))}
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