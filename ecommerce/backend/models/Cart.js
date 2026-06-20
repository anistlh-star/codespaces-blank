// models/Cart.js
import mongoose from "mongoose";
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      sparse: true,
      default: null, // ← null for guest carts
    },

    sessionId: {
      type: String,
      sparse: true,
      default: null,
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    totalAmount: { type: Number, default: 0 },
    totalItems: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Compound index: enforces uniqueness for logged-in users, allows multiple guests
cartSchema.index({ userId: 1, sessionId: 1 }, { unique: true, sparse: true });

// Auto-delete abandoned guest carts after 14 days
cartSchema.index({ updatedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 14 });

export default mongoose.model("Cart", cartSchema);
