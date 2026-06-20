//ecommerce/backend/services/email/transport.js

import nodemailer from "nodemailer";

// transport.js — add this temporarily
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);

export const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,

    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) console.error("❌ Email Service Error:", err.message);
  else console.log("✅ Email Service Ready!");
});
