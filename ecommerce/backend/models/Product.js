//ecommerce/backend/models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Product name
    name: {
      type: String,
      required: true,
      trim: true,
    },
   
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    brand: {
      type: String,
      trim: true,
      index: true,
    },
    // Product description
    description: {
      type: String,
      required: true,
    },

    // Product price
    price: {
      type: Number,
      required: true,
    },

    // Sale price (nullable)
    salePrice: {
      type: Number,
      default: null,
    },

    // Discount percentage (nullable)
    discountPercentage: {
      type: Number,
      default: null,
    },

    // Product stock quantity
    stock: {
      type: Number,
      required: true,
    },

    // Featured product flag
    featured: {
      type: Boolean,

      default: false,
    },

    // On sale flag
    onSale: {
      type: Boolean,
      required: true,
      default: false,
    },

    // Product images
    images: {
      type: [String],
    },

    // Product rating (int or double)
    rating: {
      type: Number,
      required: true,
      default: 0,
    },

    // Total reviews count
    reviews: {
      type: Number,
      required: true,
      default: 0,
    },

    // Category reference
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    countryOfOrigin: {
      type: String,
      trim: true,
      default: null,
    },

    // NEW: Release Date
    releaseDate: {
      type: Date,
      default: null,
    },

    // UPDATED: Specifications (already good, just confirming)
    specifications: [
      {
        label: {
          type: String,
          required: [true, "Specification label is required"],
          trim: true,
        },
        value: {
          type: String,
          required: [true, "Specification value is required"],
          trim: true,
        },
      },
    ],
    // NEW: Stock Status (enum for controlled values)
    stockStatus: {
      type: String,
      enum: ["in-stock", "unavailable", "to-be-announced"],
      default: "in-stock",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Product", productSchema);
