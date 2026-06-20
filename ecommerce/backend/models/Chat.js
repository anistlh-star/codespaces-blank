//ecommerce/backend/models/Chat.js
import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true, // one session per user
    index: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // optional if we want to support anonymous chats
    default: null,
  },
  messages: [
    {
      role: { type: String, enum: ["user", "assistant"], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  title: { type: String, default: "New Chat" },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
chatSchema.pre("save", function () {
  this.updatedAt = Date.now();
});
const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
