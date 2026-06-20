import { redisClient } from "../config/redis/redisClient.js";

// /ecommerce/backend/controllers/otpController.js
export const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;
    const key = `otp:${phone}`;
    const otp = Math.floor(1000 + Math.random() * 9000);

    await redisClient.set(key, otp, { EX: 120 });
    res.json({ message: "OTP SENT", otp });
  } catch (error) {
    console.error("error sending OTP", error);
  }
};
export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const key = `otp:${phone}`;
    const storedOTP = await redisClient.get(key);
    if (!storedOTP) {
      return res.json({ message: "OTP EXPIRED" });
    }
    if (storedOTP !== otp) {
      return res.json({ message: "INVALID OTP" });
    }
    await redisClient.del(key); //// this is cache invalidation 

    res.json({ message: "OTP VERIFIED" });
  } catch (error) {
res.status(500).json({ error: " verifyOTP  error" });
  }
};
