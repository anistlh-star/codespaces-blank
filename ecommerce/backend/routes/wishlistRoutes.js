import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.use(protect);

router.post("/", addToWishlist);
router.delete("/:productId", removeFromWishlist);
router.get("/", getWishlist);

export default router;