// ecommerce/backend/routes/productRoutes.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";

import {
  AddProduct,
  DeleteProduct,
  getAllProducts,
  UpdateProduct,
  getSingleProductById,
  getProductBrand,
  getTrendingProducts,
  getProductsByUser,
  featuredProducts,
  newArrivals,
} from "../controllers/productController.js";

import { uploadMultiple } from "../middleware/multer.js";

const router = express.Router();

// ── PUBLIC ROUTES ───────────────────────────────────────────────────────
router.get("/all", getAllProducts);
router.get("/brands", getProductBrand);
router.get("/trending", getTrendingProducts);
router.get("/featured", featuredProducts);
router.get("/new-arrivals", newArrivals);
// Single product detail (must come after named routes)
router.get("/:id", getSingleProductById);

// ── PROTECTED ROUTES (require authentication) ───────────────────────────
router.use(protect);

// User's own products (only visible to the logged-in user)
router.get("/my-products", getProductsByUser);

// Add new product (seller/admin)
router.post("/add", uploadMultiple, AddProduct);
router.put("/:id", uploadMultiple, UpdateProduct);

// ── ADMIN ONLY ROUTES ───────────────────────────────────────────────────
router.use(admin);

// Update & Delete product (admin only)
router.put("/:id", uploadMultiple, UpdateProduct);
router.delete("/:id", DeleteProduct);

export default router;
