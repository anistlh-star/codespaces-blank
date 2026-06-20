//ecommerce/backend/routes/categoryRoutes.js
import express from "express";
import {
  createCategory,
  deleteCategory,
  editCategory,
  getAllCategories,
  getSingleCategory,
} from "../controllers/categoryController.js";

import { uploadSingle } from "../middleware/multer.js";
import { admin, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// Public reads
router.get("/all", getAllCategories);
router.get("/:id", getSingleCategory);

// Admin only writes
router.use(protect);
router.use(admin);

router.post("/create", uploadSingle, createCategory);
router.put("/:id", uploadSingle, editCategory);
router.delete("/:id", deleteCategory);

export default router;