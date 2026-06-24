// src/context/WishlistContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext"; // Ensure path matches your setup
import API from "../api"; // Ensure path matches your setup

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [wishlistData, setWishlistData] = useState(null);
  const [wishListloading, setwishListloading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch wishlist from database
  const fetchWishlist = useCallback(async () => {
    if (!user?._id) {
      setWishlistIds([]);
      setWishlistData(null);
      return;
    }

    setwishListloading(true);
    setError(null);

    try {
      const res = await API.get("/wishlist");
      const products = res.data.wishlist?.products || [];
      const ids = products.map((item) => item.product?._id).filter(Boolean);

      setWishlistIds(ids);
      setWishlistData(res.data.wishlist);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
      setError(err.response?.data?.message || "Failed to load wishlist");
      setWishlistIds([]);
    } finally {
      setwishListloading(false);
    }
  }, [user?._id]);

  // Handle initialization on mount/auth state change
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Toggle items globally
  const toggleWishlist = useCallback(async (productId) => {
    if (!user?._id || !productId) return;

    const isCurrentlyInWishlist = wishlistIds.includes(productId);

    // Optimistic Update: Instantly change state for live UI feedback
    setWishlistIds((prev) =>
      isCurrentlyInWishlist
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );

    try {
      if (isCurrentlyInWishlist) {
        await API.delete(`/wishlist/${productId}`);
      } else {
        await API.post("/wishlist", { productId });
      }
      
      // Re-sync with database records
      await fetchWishlist();
    } catch (err) {
      console.error("Wishlist toggle failed:", err);
      // Rollback UI changes immediately on failure
      setWishlistIds((prev) =>
        isCurrentlyInWishlist
          ? [...prev, productId]
          : prev.filter((id) => id !== productId)
      );
      setError(err.response?.data?.message || "Action failed");
    }
  }, [user?._id, wishlistIds, fetchWishlist]);

  const isInWishlist = useCallback((productId) => {
    return wishlistIds.includes(productId);
  }, [wishlistIds]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistData,
        isInWishlist,
        toggleWishlist,
        wishListloading,
        error,
        refetch: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => useContext(WishlistContext);