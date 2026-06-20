//ecommerce/backend/models/Usage.js
import mongoose from "mongoose";

const usageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
    ref: "User",
  },
  model: String,
  inputTokens: Number,
  outputTokens: Number,
  totalCost: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("Usage", usageSchema);
