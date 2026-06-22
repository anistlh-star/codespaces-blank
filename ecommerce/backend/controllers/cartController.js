// ecommerce/backend/controllers/cartController.js
import asyncHandler from "../utils/asyncHandler.js";
import Cart from "../models/Cart.js";
import { cacheOrchestrator } from "../cache/cacheOrchestrator.js";
import { TTL } from "../cache/ttl.js";
import { delCache } from "../cache/cacheService.js";
import logger from "../config/logger.js";
import {
  addItemToCart,
  getUserCart,
  removeUserCartItem,
  updateItemsInCart,
} from "../services/cartService.js";

const getCartQuery = (req) => {
  logger.info("🔍 getCartQuery Debug:", {
    hasUser: !!req.user,
    userId: req.user?.id,
  });
  if (req.user) {
    return { userId: req.user.id };
  }
  return null;
};

// Reusable Service Error Mapper for HTTP consistency
const handleServiceError = (res, err) => {
  const statusMap = {
    INVALID_PRODUCT_ID: 400,
    INVALID_QUANTITY: 400,
    INSUFFICIENT_STOCK: 409, // 409 Conflict
    PRODUCT_NOT_FOUND: 404,
    CART_NOT_FOUND: 404,
    ITEM_NOT_FOUND: 404,
  };
  return res.status(statusMap[err.message] || 500).json({
    success: false,
    message: err.message,
  });
};

// ─── GET CART ───────────────────────────────────────────────────────────────
export const getCart = asyncHandler(async (req, res) => {
  const query = getCartQuery(req);
  const emptyCartStructure = { items: [], totalAmount: 0, totalItems: 0 };

  if (!query || !query.userId) {
    return res.status(200).json({
      success: true,
      cart: emptyCartStructure,
    });
  }

  const cartCacheKey = `cart:${query.userId}`;

  let cart = await cacheOrchestrator({
    key: cartCacheKey,
    ttl: TTL.cart,
    fetch: async () => {
      const dbCart = await getUserCart(query.userId);
      console.log("Fetched cart from DB:", dbCart);
      return dbCart || emptyCartStructure;
    },
  });

  if (!cart) {
    cart = emptyCartStructure;
  }

  return res.status(200).json({
    success: true,
    cart: cart,
  });
});

// ─── ADD TO CART ────────────────────────────────────────────────────────────
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  console.log("Received addToCart request:", { productId, quantity });
  const query = getCartQuery(req);

  if (!query?.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    const populatedCart = await addItemToCart(query.userId, productId, quantity);

    // FIX 1: Cache invalidation happens safely AFTER the write operation completes
    await delCache(`cart:${query.userId}`);

    return res.status(200).json({
      success: true,
      cart: populatedCart,
    });
  } catch (err) {
    return handleServiceError(res, err);
  }
});

// ─── UPDATE CART ITEM ───────────────────────────────────────────────────────
export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  console.log("Received updateCartItem request:", { productId, quantity });
  const query = getCartQuery(req);

  if (!query || !query.userId) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  try {
    // FIX 2: Execute service first before wiping the cache
    const populated = await updateItemsInCart(
      query.userId,
      productId,
      quantity,
    
    );
console.log("Updated cart from service:", populated);
    // Wipe cache second to block out read race conditions completely
    const cartCacheKey = `cart:${query.userId}`;
    await delCache(cartCacheKey);

    return res.status(200).json({ success: true, cart: populated });
  } catch (err) {
    return handleServiceError(res, err);
  }
});

// ─── REMOVE CART ITEM ───────────────────────────────────────────────────────
export const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const query = getCartQuery(req);

  if (!query || !query.userId) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  try {
    // FIX 3: Mutate data first
    const updatedCart = await removeUserCartItem({
      userId: query.userId,
      productId,
    });
    
    // FIX 4: Delete the cache key after data mutation completes
    const cartCacheKey = `cart:${query.userId}`;
    await delCache(cartCacheKey);

    const finalCart = updatedCart || { items: [], totalAmount: 0, totalItems: 0 };

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully.",
      cart: finalCart,
    });
  } catch (err) {
    return handleServiceError(res, err);
  }
});

// ─── CLEAR CART ─────────────────────────────────────────────────────────────
export const clearCart = asyncHandler(async (req, res) => {
  const query = getCartQuery(req);

  if (!query || !query.userId) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  const { userId } = query;
  const cartCacheKey = `cart:${userId}`;

  await Cart.findOneAndUpdate(
    { userId },
    { $set: { items: [], totalAmount: 0, totalItems: 0 } }
  );

  await delCache(cartCacheKey);

  return res.status(200).json({
    success: true,
    cart: { items: [], totalAmount: 0, totalItems: 0 },
  });
});
