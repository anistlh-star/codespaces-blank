//ecommerce/backend/routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  getProfile,
  getCurrentUser,
  // getSession,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { transporter } from "../services/email/transport.js";

const router = express.Router();

/* Public */
router.post("/register", register);
router.post("/login", login);
// router.get("/get-session", getSession);
router.get("/test-email", async (req, res) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,

    to: "yourtestemail@gmail.com",

    subject: "BullMQ Test",

    html: "<h1>Email working</h1>",
  });

  res.send("Email sent");
});

/* Protected */
router.get("/profile", protect, getProfile);
router.get("/me", protect, getCurrentUser);
export default router;
