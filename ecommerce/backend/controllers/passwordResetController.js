// backend/controllers/passwordResetController.js
import crypto from "crypto";
import nodemailer from "nodemailer";
import User from "../models/User.js";

// @desc    Request password reset
// @route   POST /api/password-reset/request
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // 1. Check if email exists
    const user = await User.findOne({ email });

    // Always return same message for security (don't reveal if email exists)
    if (!user) {
      return res.json({
        message: "If your email is registered, you will receive a reset link.",
      });
    }

    // 2. Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 3. Hash token before saving (security)
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 4. Save to database
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    // 5. Create reset URL
    const resetUrl = process.env.FRONTEND_URL
      ? `${process.env.FRONTEND_URL}/reset/${resetToken}`
      : `http://localhost:80/reset/${resetToken}`;

    // 6. Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 7. Email content
    const mailOptions = {
      from: '"Your Store" <your-email@gmail.com>',
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" style="padding: 10px 20px; background: blue; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>This link expires in 15 minutes.</p>
        <p>If you didn't request this, ignore this email.</p>
      `,
    };

    // 8. Send email
    await transporter.sendMail(mailOptions);

    res.json({ message: "Reset link sent to your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Reset password
// @route   POST /api/password-reset/reset/:token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // 1. Hash the token from URL
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    // 2. Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // Token not expired
    });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // 3. Update password
    user.password = password; // Will be hashed by pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
