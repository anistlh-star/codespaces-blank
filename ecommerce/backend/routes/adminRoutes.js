// ecommerce/backend/routes/adminRoutes.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";

import {
  getAdminStats,
  RecentOrders,
  SalesByCategory,
} from "../controllers/adminController.js";

import {
  DeleteProduct,
  getAllProducts,
  getPopularProducts,
  getSingleProductById,
  UpdateProduct,
} from "../controllers/productController.js";

import { getCategoriesWithCount } from "../controllers/categoryController.js";

import {
  deleteOrder,
  getAllOrders,
  getOrderById,
  statusChange,
} from "../controllers/orderController.js";

import {
  deleteUser,
  getAllUsers,
  getUserById,
  userRoleChange,
} from "../controllers/userController.js";
import { uploadMultiple } from "../middleware/multer.js";

const router = express.Router();

// 🔥 All admin routes are now protected + admin-only
router.use(protect);
router.use(admin);

// Dashboard & Analytics
router.get("/stats", getAdminStats);
router.get("/salesbycategory", SalesByCategory);
router.get("/recent-orders", RecentOrders);

// Products
router.get("/products/all", getAllProducts);
router.get("/products/popular", getPopularProducts);
router.get("/products/:id",uploadMultiple, getSingleProductById);
router.put("/products/:id",uploadMultiple, UpdateProduct);           // multer already in controller
router.delete("/products/:id", DeleteProduct);

// Categories
router.get("/products/categories", getCategoriesWithCount);

// Orders
router.get("/orders/all", getAllOrders);
router.get("/orders/:id", getOrderById);
router.put("/orders/:id/status", statusChange);
router.delete("/orders/:id", deleteOrder);

// Users
router.get("/users/all", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id/role", userRoleChange);
router.delete("/users/:id",deleteUser)
export default router;