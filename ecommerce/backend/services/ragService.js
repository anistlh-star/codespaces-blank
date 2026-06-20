// backend/services/ragService.js
import { groq, rewriteQuery } from "../config/aiProvider.js";
import getVectorStore from "../config/vectorStore.js";
import { trackGroqCost } from "../middleware/groqTrackerMiddleware.js";
import Usage from "../models/Usage.js";
import { RAG_SYSTEM_PROMPT } from "../prompts/ragPrompt.js";
import {
  classifyAiError,
  FALLBACK_RESPONSES,
  withRetry,
} from "./ai/errorHandler.js";

export const askRAG = async (question, userId) => {
  try {
    console.log(`🔍 RAG Search for: "${question}"`);

    const vectorStore = await getVectorStore();

    // Ai rewrites user query to improve search results, especially for vague or complex questions
    const improvedQuery = await rewriteQuery(question);
    console.log("🔎 Original:", question);
    console.log("✨ Improved:", improvedQuery);

    const docs = await vectorStore.similaritySearch(improvedQuery, 2);
    const inStock = docs.filter((doc) => Number(doc.metadata.stock) > 0);
    const outOfStock = docs.filter((doc) => Number(doc.metadata?.stock) <= 0);
    if (outOfStock.length > 0) {
      console.log(`❌ ${outOfStock.length} out-of-stock items filtered out:`);
      outOfStock.forEach((doc) =>
        console.log(`   - ${doc.metadata.name} (stock: ${doc.metadata.stock})`),
      );
    }
    const filteredDocs = docs.filter(
      (doc) =>
        doc.metadata?.stock !== undefined && Number(doc.metadata.stock) > 0,
    );
    if (filteredDocs.length === 0) {
      return "I couldn't find any relevant products for your question. Could you please rephrase it?";
    }
    if (inStock.length === 0) {
      const anyMatch = docs.some((doc) =>
        doc.metadata.name
          .toLowerCase()
          .includes(question.toLowerCase().replace(/[^a-z0-9\s]/g, "")),
      );
      if (anyMatch && outOfStock.length > 0) {
        return `I found some products matching your search but they're currently out of stock. Would you like me to suggest similar in-stock alternatives?`;
      }

      return "I couldn't find any in-stock products matching your search. Could you try different keywords or browse our categories?";
    }

    const context = filteredDocs
      .map((doc, i) => {
        const m = doc.metadata;
        const saleInfo = m.onSale && m.salePrice ? `${m.salePrice}` : "";
        return `
Product ${i + 1}:
Name: ${m.name}
Brand: ${m.brand}
Category: ${m.category}
Price: $${m.price}
Stock: ${m.stock}
Rating: ${m.rating}
`;
      })
      .join("\n");

    const response = await withRetry(() => {
      return groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: RAG_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Context:\n${context}\n\nQuestion: ${question}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 850,
      });
    });
    console.log("response : ", response);
    const usage = trackGroqCost(response, "llama-3.3-70b-versatile", userId);
    console.log("tracking usage .... ", usage);
    await Usage.create({ userId, model: "llama-3.3-70b-versatile", ...usage });
    return response.choices[0].message.content;
  } catch (error) {
    const classified = classifyAiError(error);

    console.error(" Error:", classified.type);
    return FALLBACK_RESPONSES[classified.type] || FALLBACK_RESPONSES.default;
  }
};

export default askRAG;
