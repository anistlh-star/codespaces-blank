//ecommerce/backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* Protect routes */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, Please login" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const foundUser = await User.findById(decoded.id).select("-password");
    if (!foundUser) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = foundUser;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
/* Admin only */
export const admin = (req, res, next) => {
  if (req.user?.role?.toLowerCase() === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin access only" });
  }
};
export const guestOrUser = async (req, res, next) => {
  let user;

  // 1. Try JWT first (logged-in user)
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.id).select("-password");
    } catch (e) {
      // invalid token → continue as guest
    }
  }

  // 2. If no valid user → try session cookie
  if (!user) {
    const sessionId = req.cookies.sessionId;   // ← you'll need cookie-parser
    if (sessionId) {
      // You can store sessionId → cart in Redis / DB
      // For now let's assume you already do this in cart controller
      req.sessionId = sessionId;
    }
  }

  req.user = user || null;        // may be null for guests
  next();
};
