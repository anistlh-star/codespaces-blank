// ecommerce/backend/routes/userRoutes.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getUserById,
  userRoleChange,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { getProductsByUser } from "../controllers/productController.js";

const router = express.Router();


router.use(protect);
router.get("/my-products", getProductsByUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);




router.use(admin);

router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:id/role", userRoleChange);
router.delete("/:id", deleteUser);

export default router;