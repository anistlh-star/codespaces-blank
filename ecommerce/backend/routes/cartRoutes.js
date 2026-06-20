// ecommerce/backend/routes/cartRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cartController.js";

const router = express.Router();
router.get("/get", protect, getCart);

router.post("/add", protect, addToCart);
router.put("/update/:productId", protect, updateCartItem);
router.delete("/remove/:productId", protect, removeCartItem);
router.delete("/clear", protect, clearCart);

export default router;
