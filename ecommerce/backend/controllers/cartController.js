// ecommerce/backend/controllers/cartController.js
import asyncHandler from "../utils/asyncHandler.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import { cacheOrchestrator } from "../cache/cacheOrchestrator.js";
import { TTL } from "../cache/ttl.js";
import { delCache } from "../cache/cacheService.js";
import logger from "../config/logger.js";

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
// ─── GET CART ───────────────────────────────────────────────────────────────
export const getCart = asyncHandler(async (req, res) => {
  const query = getCartQuery(req);
  logger.info("getCart query:", query);
  if (!query) {
    return res.status(200).json({
      success: true,
      cart: { items: [], totalAmount: 0, totalItems: 0 },
    });
  }
  const cartCacheKey = `cart:${query.userId}`;
  const cart = await cacheOrchestrator({
    key: cartCacheKey,
    ttl: TTL.cart,
    fetch: async () => {
      let cart = await Cart.findOne(query).populate("items.productId");

      logger.info("Found cart:", cart ? cart._id : "none");

      if (!cart) {
        logger.info("Attempting to create cart with query:", query);
        try {
          cart = await Cart.create(query);
          logger.info("Cart created successfully, ID:", cart._id);
          cart = await Cart.findById(cart._id).populate("items.productId");
        } catch (err) {
          logger.error("Cart creation error:", err);
          throw new Error("Cart creation failed");
        }
      }

      return cart;
    },
  });
  logger.info("cart : ", cart);

  res.json({ success: true, cart: formatCartResponse(cart) });
});

// ─── ADD TO CART ────────────────────────────────────────────────────────────
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const qty = Number(quantity);

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }
  if (isNaN(qty) || qty < 1) {
    return res
      .status(400)
      .json({ success: false, message: "Quantity must be ≥ 1" });
  }

  const product = await Product.findById(productId);
  if (!product)
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });

  const query = getCartQuery(req);
  if (!query)
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });

  let cart = await Cart.findOne(query);
  if (!cart) {
    cart = new Cart({ ...query, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (i) => i.productId.toString() === productId,
  );

  const newQty = itemIndex >= 0 ? cart.items[itemIndex].quantity + qty : qty;

  if (newQty > product.stock) {
    return res.status(400).json({
      success: false,
      message: `Only ${product.stock} in stock (requested: ${newQty})`,
    });
  }

  if (itemIndex >= 0) {
    cart.items[itemIndex].quantity = newQty;
  } else {
    cart.items.push({ productId, quantity: qty });
  }
  const cartCacheKey = `cart:${query.userId}`;
  await delCache(cartCacheKey);
  await updateCartTotals(cart);
  await cart.save();

  const populated = await Cart.findById(cart._id).populate(
    "items.productId",
    "name price images slug stock",
  );
  res.json({ success: true, cart: formatCartResponse(populated) });
});

// ─── UPDATE CART ITEM ───────────────────────────────────────────────────────
export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const qty = Number(quantity);

  if (isNaN(qty) || qty < 1) {
    return res
      .status(400)
      .json({ success: false, message: "Quantity must be ≥ 1" });
  }

  const query = getCartQuery(req);
  if (!query)
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });

  const cart = await Cart.findOne(query);
  if (!cart)
    return res.status(404).json({ success: false, message: "Cart not found" });

  const item = cart.items.find((i) => i.productId.toString() === productId);
  if (!item)
    return res
      .status(404)
      .json({ success: false, message: "Item not in cart" });

  const product = await Product.findById(productId);
  if (qty > product.stock) {
    return res
      .status(400)
      .json({ success: false, message: `Only ${product.stock} available` });
  }

  item.quantity = qty;
  const cartCacheKey = `cart:${query.userId}`;
  await delCache(cartCacheKey);
  await updateCartTotals(cart);
  await cart.save();

  const populated = await Cart.findById(cart._id).populate(
    "items.productId",
    "name price images",
  );
  res.json({ success: true, cart: formatCartResponse(populated) });
});

// ─── REMOVE CART ITEM ───────────────────────────────────────────────────────
export const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  logger.info("Removing productId:", productId);
  const query = getCartQuery(req);
  if (!query)
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });

  const cart = await Cart.findOne(query);
  logger.info("Query used to find cart:", JSON.stringify(query, null, 2));
  logger.info("Current cart items before removal:", cart);

  if (!cart) {
    return res.status(404).json({ success: false, message: "Cart not found" });
  }
  cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
  const cartCacheKey = `cart:${query.userId}`;
  await delCache(cartCacheKey);
  await updateCartTotals(cart);
  await cart.save();

  const populated = await Cart.findById(cart._id).populate(
    "items.productId",
    "name price images",
  );
  res.json({ success: true, cart: formatCartResponse(populated) });
});

// ─── CLEAR CART ─────────────────────────────────────────────────────────────
export const clearCart = asyncHandler(async (req, res) => {
  const query = getCartQuery(req);
  if (!query)
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  const cartCacheKey = `cart:${query.userId}`;
  await delCache(cartCacheKey);
  await Cart.findOneAndUpdate(query, {
    $set: { items: [], totalAmount: 0, totalItems: 0 },
  });

  res.json({
    success: true,
    cart: { items: [], totalAmount: 0, totalItems: 0 },
  });
});
// Helpers (unchanged from your code)
async function updateCartTotals(cartDoc) {
  // If cartDoc is a plain object or partial doc, fetch populated cart by id
  let cart = cartDoc;
  if (cartDoc && cartDoc._id) {
    cart = await Cart.findById(cartDoc._id).populate("items.productId");
  }

  let totalItems = 0;
  let totalAmount = 0;

  (cart.items || []).forEach((item) => {
    const price = item.productId?.price || 0;
    totalItems += item.quantity || 0;
    totalAmount += price * (item.quantity || 0);
  });

  // Update both the populated cart and the original cartDoc reference if different
  if (cart) {
    cart.totalItems = totalItems;
    cart.totalAmount = totalAmount;
  }
  if (cartDoc && cartDoc !== cart) {
    cartDoc.totalItems = totalItems;
    cartDoc.totalAmount = totalAmount;
  }
}

function formatCartResponse(cart) {
  return {
    _id: cart._id,
    items: cart.items.map((item) => ({
      productId: item.productId?._id || item.productId,
      name: item.productId?.name,
      price: item.productId?.price,
      images: item.productId?.images,
      quantity: item.quantity,
    })),
    totalItems: cart.totalItems,
    totalAmount: cart.totalAmount,
    updatedAt: cart.updatedAt,
  };
}
