// ecommerce/frontend/src/context/CartContext.jsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useLocation } from "react-router-dom";
import API from "../api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalAmount: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(false);

  const { isAuthenticated, loading: authLoading, token } = useAuth();
  const location = useLocation();

  // Helper to get authorization header
  const getCartHeaders = useCallback(() => {
    const headers = {};
    if (isAuthenticated && token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }, [isAuthenticated, token]);

  // Fetch cart for logged-in user
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
      return;
    }

    setLoading(true);
    try {
      const headers = getCartHeaders();
      console.log("🧑‍💼 Fetching cart for logged-in user");

      const res = await API.get("/cart/get", { headers });
console.log("📦 Cart fetched successfully:", res);
      const fetchedCart = res.data.cart || {
        items: [],
        totalAmount: 0,
        totalItems: 0,
      };

      setCart(fetchedCart);
      console.log("✅ Cart updated:", fetchedCart.totalItems, "items");
    } catch (err) {
      console.error("❌ Failed to fetch cart:", err.response?.data || err.message);
      // Optional: clear cart on fetch error
      setCart({ items: [], totalAmount: 0, totalItems: 0 });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, token, getCartHeaders]);

  // Auto-fetch cart when authentication state changes
  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;

    if (!authLoading) {
      if (isAuthenticated) {
        fetchCart();
      } else {
        // Clear cart when user logs out
        setCart({
          items: [],
          totalAmount: 0,
          totalItems: 0,
        });
      }
    }
  }, [isAuthenticated, authLoading, location.pathname, fetchCart]);

  // Add Item to Cart
  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated || !token) {
      alert("Please login to add items to your cart.");
      return;
    }

    try {
      const headers = getCartHeaders();
      console.log("Adding to cart:", { productId, quantity });
      const res = await API.post(
        "/cart/add",
        { productId, quantity },
        { headers }
      );
      setCart(res.data.cart);
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  // Update Cart Item Quantity
  const updateCartItem = async (productId, quantity) => {
    if (!isAuthenticated || !token || quantity < 1) return;
console.log("Updating cart item:", { productId, quantity });
    try {
      const headers = getCartHeaders();
      const res = await API.put(
        `/cart/update/${productId}`,
        { quantity },
        { headers }
      );
      console.log("Cart item updated successfully:", res);
      setCart(res.data.cart);
    } catch (err) {
      console.error("Update cart failed:", err);
    }
  };

  // Remove Item from Cart
  const removeFromCart = async (productId) => {
    if (!isAuthenticated || !token) return;

    try {
      const headers = getCartHeaders();
      const res = await API.delete(`/cart/remove/${productId}`, { headers });
      setCart(res.data.cart);
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  };

  // Clear Cart
  const clearCart = async () => {
    if (!isAuthenticated || !token) return;

    try {
      const headers = getCartHeaders();
      await API.delete("/cart/clear", { headers });

      setCart({
        items: [],
        totalAmount: 0,
        totalItems: 0,
      });
    } catch (err) {
      console.error("Clear cart failed:", err);
    }
  };

  const value = {
    cart,
    loading: loading || authLoading,
    addToCart,
    updateCartItem,
    removeFromCart,
    refreshCart: fetchCart,
    itemCount: cart?.totalItems || 0,
    cartTotal: cart?.totalAmount || 0,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};