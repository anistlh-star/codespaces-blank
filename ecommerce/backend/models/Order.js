//ecommerce/backend/models/Order.js
import mongoose from "mongoose";

/*
  Order Schema
  Fully aligned with provided JSON schema
*/
const orderSchema = new mongoose.Schema(
  {
    // User who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      sparse: true,
      required: true,
    },

    // Ordered items
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    // Shipping address
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
    },

    // Payment method
    paymentMethod: {
      type: String,
      required: true,
    },

    // Payment status
    paymentStatus: {
      type: String,
      required: true,
    },

    // Order status
    status: {
      type: String,
      enum: [
        "pending",
        "processing",

        "on hold",

        "completed",

        "cancelled",

        "delivered",
      ],
      default: "pending",
    },

    // Total order amount
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);
