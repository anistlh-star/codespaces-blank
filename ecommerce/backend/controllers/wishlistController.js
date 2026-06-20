import Wishlist from "../models/Wishlist.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ success: false, message: "Invalid product ID" });
  }

  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = new Wishlist({
      user: userId,
      products: [{ product: productId }],
    });
  } else {
    // Check if already exists
    const exists = wishlist.products.some((item) => item.product.toString() === productId);
    if (exists) {
      return res.status(400).json({ success: false, message: "Product already in wishlist" });
    }
    wishlist.products.push({ product: productId });
  }

  await wishlist.save();
  await wishlist.populate("products.product", "name price images");

  res.status(200).json({
    success: true,
    message: "Added to wishlist",
    wishlist,
  });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  const wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    return res.status(404).json({ success: false, message: "Wishlist not found" });
  }

  wishlist.products = wishlist.products.filter(
    (item) => item.product.toString() !== productId
  );

  await wishlist.save();
  await wishlist.populate("products.product", "name price images");

  res.status(200).json({
    success: true,
    message: "Removed from wishlist",
    wishlist,
  });
});

export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ user: userId })
    .populate("products.product", "name price images stock")
    .lean();

  if (!wishlist) {
    return res.status(200).json({ success: true, wishlist: { products: [] } });
  }

  res.status(200).json({ success: true, wishlist });
});