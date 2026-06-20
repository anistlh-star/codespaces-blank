// backend/tool/addToCartTool.js
import dotenv from "dotenv";
dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:5000`;

export const addToCartTool = async ({ productId, userId, token }) => {
  try {
    console.log("🛒 addToCartTool called with:", { productId, userId, hasToken: !!token });

    if (!productId || !userId) {
      return "❌ Missing product or user information";
    }

    const res = await fetch(`${BACKEND_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,   // ← This is crucial
      },
      body: JSON.stringify({
        productId,
        quantity: 1,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      console.error("Add to cart failed:", data);
      return `❌ Failed to add to cart (${res.status})`;
    }

    return "✅ Product added to your cart successfully!";
  } catch (err) {
    console.error("Tool error:", err.message);
    return "❌ Sorry, I couldn't add that to your cart right now.";
  }
};