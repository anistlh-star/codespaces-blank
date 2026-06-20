//ecommerce/backend/services/extractProductService.js

import { groq } from "../config/aiProvider.js";

export const extractProductFromMessage = async (message) => {
  const prompt = `
Extract only the main product name from this message.
Return just the product name, nothing else.

Message: "${message}"
`;

  const res = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    max_tokens: 30,
  });

  return res.choices[0].message.content.trim();
};