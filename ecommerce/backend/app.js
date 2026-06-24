// ecommerce/backend/app.js
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors"; // ✅ FIXED: Added missing package import
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
import { limiter } from "./config/limiter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ====================== PROXY SETTING (MUST BE FIRST) ======================
// Instructs Express to trust proxy-forwarded secure headers (e.g., X-Forwarded-Proto)
app.set("trust proxy", 1);

// ====================== MIDDLEWARE  ======================
app.use(express.json());
app.use(cookieParser());
// app.use(limiter)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://ecommerce092.netlify.app",
  "https://cautious-umbrella-q75gpxgxpgxw365ww-5173.app.github.dev",
  "http://localhost:5173",
].filter(Boolean);

// 1. Standard CORS Middleware configuration wrapper
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow servers/postman
      if (allowedOrigins.includes(origin) || origin.endsWith(".github.dev")) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS Policy configuration"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With", "Cookie"],
    optionsSuccessStatus: 204,
  })
);

// 2. ✅ FIXED: Custom Gateway Preflight Bypass Hook
// Intercepts and ensures preflights pass through the GitHub Codespaces router cleanly
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || (origin && origin.endsWith(".github.dev"))) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, Origin, X-Requested-With, Cookie");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use("/images", express.static(path.join(__dirname, "uploads", "images")));

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