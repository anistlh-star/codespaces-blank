// ecommerce/backend/routes/aiRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { askAI, resetAI } from "../controllers/aiController.js";
const router = express.Router();


  

// Health check
router.get("/test", (req, res) => {
  res.json({ message: "AI route is working!" });
});

router.post("/chat", protect, askAI);
router.post("/chat/reset", resetAI);

export default router;
