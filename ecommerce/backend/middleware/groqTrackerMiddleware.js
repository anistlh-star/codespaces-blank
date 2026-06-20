import { calculateGroqCost } from "../analytics/aiCostCalculator.js";

//ecommerce/backend/middleware/groqTrackerMiddleware.js
export const trackGroqCost = async (response, model, userId) => {
  try {
    const inputTokens = response.usage?.prompt_tokens || 0;
    const outputTokens = response.usage?.completion_tokens || 0;

    const costData = calculateGroqCost(model, inputTokens, outputTokens);
    console.log("📊 GROQ USAGE REPORT");

    console.log("User:", userId);

    console.log("Input Tokens:", inputTokens);

    console.log("Output Tokens:", outputTokens);

    console.log("Total Cost:", costData.totalCost);

    return {
      inputTokens,
      outputTokens,
      ...costData,
    };
  } catch (error) {}
};
