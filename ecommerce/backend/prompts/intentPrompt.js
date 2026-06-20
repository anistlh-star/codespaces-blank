//ecommerce/backend/prompts/intentPrompt.js
export const getIntentPrompt = (message) => `
Classify this message into one intent. Return only one word.

Intents: product_search, support, add_to_cart, unknown

Message: "${message}"
`;