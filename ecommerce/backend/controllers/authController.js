// ecommerce/backend/controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { redisClient } from "../config/redis/redisClient.js";
import { emailQueue } from "../queues/emailQueue.js";
import { welcomeTemplate } from "../templates/emailTemplate.js";

/* Generate JWT */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

/* REGISTER */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name?.trim()) return res.status(400).json({ success: false, message: "Name is required" });
  if (!email?.trim()) return res.status(400).json({ success: false, message: "Email is required" });
  if (!password) return res.status(400).json({ success: false, message: "Password is required" });

  const normalizedEmail = email.toLowerCase().trim();

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    return res.status(400).json({ success: false, message: "Email already registered" });
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: "user",
  });

  // Send welcome email asynchronously
  await emailQueue.add(
    "welcome-email",
    { to: normalizedEmail, subject: "Welcome", html: welcomeTemplate(name.trim()) },
    { priority: 10, attempts: 3, backoff: { type: "exponential", delay: 5000 } }
  );

  res.status(201).json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

/* LOGIN */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email?.trim() || !password) {
    return res.status(400).json({ success: false, message: "Please provide email and password" });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const token = generateToken(user._id);
  const sessionID = `session:${user._id}`;

  // Store session in Redis
  await redisClient.set(
    sessionID,
    JSON.stringify({
      userId: user._id.toString(),
      email: normalizedEmail,
      token,
      loggedIn: true,
    }),
    "EX",
    60 * 60 // 1 hour
  );

  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(200).json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token,
    user: userResponse,
  });
});

/* PROFILE */
export const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      address: req.user.address,
    },
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  res.json({
    success: true,
    user: {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      address: req.user.address,
    },
  });
});