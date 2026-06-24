// src/hooks/useWishlist.js

import { useWishlistContext } from "../../context/WishlistContext";

export const useWishlist = () => {
  // Now calls the centralized context data instead of isolating local state instance loops
  return useWishlistContext()
};