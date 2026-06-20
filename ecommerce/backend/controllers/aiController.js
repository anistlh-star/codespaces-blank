import { redisClient } from "../config/redis/redisClient.js";
import getVectorStore from "../config/vectorStore.js";
import Chat from "../models/Chat.js";
import { streamCustomerSupport } from "../services/chatService.js";
import { extractProductFromMessage } from "../services/extractProductService.js";
import { detectIntent } from "../services/intentService.js";
import askRAG from "../services/ragService.js";
import { addToCartTool } from "../tool/addToCartTool.js";
import { getQueryHash } from "../utils/hash.js";

export const askAI = async (req, res) => {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const { message, sessionId } = req.body;
  const userId = req.user?.id;
  const queryHash = getQueryHash(message || "");
  const key = `ai:response:${queryHash}`;

  // FIXED: Redis get operation
  const cached = await redisClient.get(key);

  if (!message?.trim()) {
    res.write("Error: Message is required");
    return res.end();
  }

  try {
    const intent = await detectIntent(message.trim());

    if (cached) {
      // FIXED: For text/plain response, send as string
      res.write(`Cached response: ${cached}`);
      return res.end();
    }

    let result; // FIXED: Declare result variable

    if (intent === "product_search") {
      result = await askRAG(message.trim());
      res.write(result);
      return res.end();
    }

    if (intent === "add_to_cart") {
      const productName = await extractProductFromMessage(message);
      const vectorStore = await getVectorStore();
      const docs = await vectorStore.similaritySearch(productName, 1);

      const productId = docs[0]?.metadata?.productId;

      if (!productId) {
        res.write("I couldn't find that product.");
        return res.end();
      }

      result = await addToCartTool({
        productId,
        userId,
        token: req.headers.authorization?.replace("Bearer ", ""),
      });
      res.write(result);
      return res.end();
    }

    // Default: General Support
    result = await streamCustomerSupport(sessionId, message.trim(), res);

    // FIXED: Cache the result if it's a string
    if (typeof result === "string") {
      await redisClient.set(key, result, { EX: 60 * 60 * 24 });
    }
  } catch (error) {
    console.error("Chat Error:", error);
    res.write("Sorry, something went wrong. Please try again.");
    res.end();
  }
};

export const resetAI = async (req, res) => {
  // FIXED: Remove extra function wrapper
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({ error: "Session ID is required" });
  }

  try {
    await Chat.findOneAndUpdate(
      {
        sessionId: sessionId,
      },
      {
        messages: [],
      },
    );
    console.log(`Chat reset for session: ${sessionId}`);
    return res.json({ message: "Chat reset successfully." });
  } catch (error) {
    console.error("Error resetting chat:", error);
    return res.status(500).json({ error: "Failed to reset chat." });
  }
};
