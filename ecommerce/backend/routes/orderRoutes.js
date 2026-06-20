// ecommerce/backend/routes/orderRoutes.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";

import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
  getOrdersByUser,
  placeOrder,
  statusChange,
  UpdateOrder,
} from "../controllers/orderController.js";

const router = express.Router();

// ====================== PROTECTED USER ROUTES ======================
// route is starting as /api/orders
router.use(protect);

router.post("/place-order", placeOrder);

// My orders (recommended new route)
router.get("/my-orders", getOrdersByUser);

// ====================== ADMIN ONLY ======================
router.get("/all", admin, getAllOrders);
router.post("/create", admin, createOrder);
router.get("/user/:userId", admin, getOrdersByUser);
router.put("/:id/status", admin, statusChange);
router.put("/update/:id", admin, UpdateOrder);
router.delete("/:id", admin, deleteOrder);

// Generic param route stays LAST so it doesn't shadow the specific ones above.
router.get("/:id", getOrderById);

export default router;
