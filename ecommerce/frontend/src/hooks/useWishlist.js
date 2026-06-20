// src/hooks/useWishlist.js
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api";

export const useWishlist = () => {
  const { user } = useAuth();

  const [wishlistIds, setWishlistIds] = useState([]); // array of product _id strings
  const [wishlistData, setWishlistData] = useState(null); // full wishlist object (optional)
  const [wishListloading, setwishListloading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch wishlist
  const fetchWishlist = useCallback(async () => {
    if (!user?._id) return;

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

  // Initial fetch when user changes
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Toggle (add/remove) item
  const toggleWishlist = useCallback(
    async (productId) => {
      if (!user?._id || !productId) return;

      const isCurrentlyInWishlist = wishlistIds.includes(productId);

      // Optimistic update (optional – makes UI feel faster)
      setWishlistIds((prev) =>
        isCurrentlyInWishlist
          ? prev.filter((id) => id !== productId)
          : [...prev, productId],
      );

      try {
        if (isCurrentlyInWishlist) {
          await API.delete(`/wishlist/${productId}`);
        } else {
          await API.post("/wishlist", { productId });
        }

        // Refetch to sync with server (or skip if optimistic is enough)
        await fetchWishlist();
      } catch (err) {
        console.error("Wishlist toggle failed:", err);
        // Rollback optimistic update on error
        setWishlistIds((prev) =>
          isCurrentlyInWishlist
            ? [...prev, productId]
            : prev.filter((id) => id !== productId),
        );
        setError(err.response?.data?.message || "Action failed");
      }
    },
    [user?._id, wishlistIds, fetchWishlist],
  );

  // Helper: check if a product is in wishlist
  const isInWishlist = useCallback(
    (productId) => wishlistIds.includes(productId),
    [wishlistIds],
  );

  return {
    wishlistIds, // array of product IDs
    wishlistData, // full wishlist object (with populated products)
    isInWishlist, // (productId) => boolean
    toggleWishlist, // async (productId) => void
    wishListloading,
    error,
    refetch: fetchWishlist,
  };
};
