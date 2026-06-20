// ecommerce/backend/app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import passwordRoutes from "./routes/passwordResetRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ====================== MIDDLEWARE  ======================
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "https://cautious-umbrella-q75gpxgxpgxw365ww-5173.app.github.dev",
      "http://localhost:5173",
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/images", express.static(path.join(__dirname, "uploads", "images")));
app.set("trust proxy", 1);

// ====================== ROUTES ======================
app.get("/", (_req, res) => res.json({ message: "API is running" }));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/password", passwordRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/otp", otpRoutes);

// ====================== GLOBAL ERROR HANDLER (Must be LAST) ======================
app.use((err, _req, res, _next) => {
  console.error("🔥 Global Error:", err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;