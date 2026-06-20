// ecommerce/backend/config/aiProvider.js
import OpenAI from "openai";
import dotenv from "dotenv";
import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

dotenv.config();

console.log("🤖 Initializing AI providers...");
console.log("GROQ API Key exists:", !!process.env.GROQ_API_KEY);
console.log("HuggingFace API Key exists:", !!process.env.HUGGINGFACE_API_KEY);

export const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

console.log("✅ Groq client initialized");

export const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACE_API_KEY,
  model: "sentence-transformers/all-MiniLM-L6-v2",
});

export const INTENTS = {
  PRODUCT_SEARCH: "product_search",
  SUPPORT: "support",
  ADD_TO_CART: "add_to_cart",
  UNKNOWN: "unknown",
};

export const rewriteQuery = async (question) => {
  console.log("🔄 Rewriting query:", question);
  const prompt = `Rewrite this as a clear product search query (short):\n${question}`;
  
  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
    max_tokens: 50,
  });
  const rewritten = res.choices[0].message.content.trim();
  console.log("✅ Rewritten query:", rewritten);
  return rewritten;
};