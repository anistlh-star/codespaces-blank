import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Reusable Population String
const POPULATE_FIELDS = ["items.productId", "name price images slug stock"];

export const getUserCart = async (userId) => {
  return await Cart.findOne({ userId }).populate(...POPULATE_FIELDS);
};

export const addItemToCart = async (userId, productId, quantity) => {
  console.log("Adding item to cart:", { userId, productId, quantity });
  const pIdString = productId.toString();
  if (!mongoose.Types.ObjectId.isValid(pIdString)) {
    throw new Error("INVALID_PRODUCT_ID");
  }
  const pId = new mongoose.Types.ObjectId(pIdString);

  const qty = Number(quantity);
  if (isNaN(qty) || qty < 1) {
    throw new Error("INVALID_QUANTITY");
  }

  // 1. Product & Stock Validation
  const product = await Product.findById(pId).select("stock price");
  if (!product) {
    throw new Error("PRODUCT_NOT_FOUND");
  }
  //fetching the current cart to check if its have something or not 
  const cart = await Cart.findOne({ userId });
  let existingQty = 0;
  if (cart) {
    // console.log("Current cart items:", cart);
    const existingCart = cart.items.find(i => i.productId.toString() === pIdString)
    // console.log("Existing cart item found:", existingCart);
    existingQty = existingCart ? existingCart.quantity : 0
  }

  const proposedTotalQuantity = existingQty + qty
  if (product.stock < proposedTotalQuantity) {
    throw new Error("INSUFFICIENT_STOCK");
  }

  const costDelta = product.price * qty;

  // 2. Try updating the quantity if the product is already in the cart
  const updatedCart = await Cart.findOneAndUpdate(
    {
      userId,
      "items.productId": pId,
    },
    {
      $inc: {
        "items.$.quantity": qty,
        totalItems: qty,
        totalAmount: costDelta,
      },
    },
    { new: true }
  );

  // FIX 1: Populate before returning existing cart updates
  if (updatedCart) {
    return await updatedCart.populate(...POPULATE_FIELDS);
  }

  // 3. If product wasn't in cart, push it as a new array element
  const updatedNewCart = await Cart.findOneAndUpdate(
    { userId },
    {
      $push: { items: { productId: pId, quantity: qty } },
      $inc: {
        totalItems: qty,
        totalAmount: costDelta,
      },
    },
    { new: true, upsert: true }
  );

  return await updatedNewCart.populate(...POPULATE_FIELDS);
};

export const updateItemsInCart = async (userId, productId, quantity) => {
  const pIdString = productId.toString();
  if (!mongoose.Types.ObjectId.isValid(pIdString)) {
    throw new Error("INVALID_PRODUCT_ID");
  }
  const pId = new mongoose.Types.ObjectId(pIdString);
  const qty = Number(quantity);
  if (isNaN(qty) || qty < 0) throw new Error("INVALID_QUANTITY");

  // Fetch product price for amount calculations
  const product = await Product.findById(pId).select("price");
  const unitPrice = product ? product.price : 0;

  // Get current cart and existing item (if any)
  const cart = await Cart.findOne({ userId });
  let existingQty = 0;
  if (cart) {
    const existing = cart.items.find((i) => {
      const id = i.productId._id ? i.productId._id.toString() : i.productId.toString();
      return id === pIdString;
    });
    if (existing) existingQty = existing.quantity;
  }

  // Delta = new absolute qty minus existing qty
  const deltaQty = qty - existingQty;
  const deltaAmount = unitPrice * deltaQty;

  if (existingQty > 0) {
    // Update existing item: set absolute quantity and adjust totals by delta
    const updatedCart = await Cart.findOneAndUpdate(
      { userId, "items.productId": pId },
      {
        $set: { "items.$.quantity": qty },
        $inc: { totalItems: deltaQty, totalAmount: deltaAmount },
      },
      { new: true }
    );

    if (updatedCart) return await updatedCart.populate(...POPULATE_FIELDS);
  }

  // If item didn't exist, push it (qty may be zero -> no-op)
  const newCart = await Cart.findOneAndUpdate(
    { userId },
    {
      $push: { items: { productId: pId, quantity: qty } },
      $inc: { totalItems: qty, totalAmount: unitPrice * qty },
    },
    { new: true, upsert: true }
  );

  return await newCart.populate(...POPULATE_FIELDS);
};

export const removeUserCartItem = async ({ userId, productId }) => {
  const pIdString = productId.toString();
  if (!mongoose.Types.ObjectId.isValid(pIdString)) {
    throw new Error("INVALID_PRODUCT_ID");
  }
  const pId = new mongoose.Types.ObjectId(pIdString);

  // Use the helper service to make sure we parse fields identically
  const cart = await getUserCart(userId);
  if (!cart) throw new Error("CART_NOT_FOUND");

  const item = cart.items.find((i) => {
    const currentId = i.productId._id
      ? i.productId._id.toString()
      : i.productId.toString();
    return currentId === pIdString;
  });
  if (!item) throw new Error("ITEM_NOT_FOUND");

  const product = await Product.findById(pId).select("price");
  const productPrice = product ? product.price : 0;

  const updatedCart = await Cart.findOneAndUpdate(
    { userId },
    {
      $pull: {
        items: { productId: pId },
      },
      $inc: {
        totalItems: -item.quantity,
        totalAmount: -(productPrice * item.quantity),
      },
    },
    { new: true }
  );

  // Safety fallback if document becomes completely null
  if (!updatedCart) return null;

  return await updatedCart.populate(...POPULATE_FIELDS);
};
