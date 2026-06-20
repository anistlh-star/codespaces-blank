//ecommerce/frontend/src/components/CartWrapper.js
import { useAuth } from "../../context/AuthContext";
import { CartProvider } from "../../context/CartContext";

export const CartWrapper = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <p>Please log in to view your cart.</p>;
  }
  const userId = user?._id || null; // null if not logged in
  return <CartProvider userId={userId}>{children}</CartProvider>;
};
