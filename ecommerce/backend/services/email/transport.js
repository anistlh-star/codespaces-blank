//ecommerce/backend/services/email/transport.js

import nodemailer from "nodemailer";

// transport.js — add this temporarily
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

console.log("EMAIL_USER:", EMAIL_USER);
console.log("EMAIL_PASS length:", EMAIL_PASS?.length);

let transporter;
if (!EMAIL_USER || !EMAIL_PASS) {
  console.warn(
    "⚠️  EMAIL_USER or EMAIL_PASS not set — falling back to stub (JSON) transport. No real emails will be sent."
  );

  transporter = nodemailer.createTransport({ jsonTransport: true });
  // Stub transport always 'verifies' in practice.
  console.log("ℹ️  Email transporter: JSON stub transport active");
} else {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  transporter.verify((err) => {
    if (err) console.error("❌ Email Service Error:", err.message);
    else console.log("✅ Email Service Ready!");
  });
}

export { transporter };
