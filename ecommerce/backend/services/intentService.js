//ecommerce/backend/services/intentService.js
// backend/services/ai/intentService.js
import { groq, INTENTS } from "../config/aiProvider.js";
import { getIntentPrompt } from "../prompts/intentPrompt.js";

export const detectIntent = async (message) => {
  try {
    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: getIntentPrompt(message) }],
      temperature: 0,
      max_tokens: 10,
    });

    const intent = res.choices[0].message.content.trim().toLowerCase();
    return Object.values(INTENTS).includes(intent) ? intent : INTENTS.UNKNOWN;
  } catch (error) {
    console.error("Intent detection failed:", error);
    return INTENTS.SUPPORT; // fallback
  }
};