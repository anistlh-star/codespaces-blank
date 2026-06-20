//ecommerce/backend/analytics/aiCostCalculator.js
//now we will calculate groq cost or ai cost we will need a controller and middleware to do 
export const GROQ_MODEL_COSTS = {
  "llama-3.3-70b-versatile": {
    input: 0.00027,
    output: 0.00027,
  },
};
export const calculateGroqCost = (model, inputTokens, outputTokens) => {
  const cost = GROQ_MODEL_COSTS[model];

  const inputCost = (inputTokens / 1000) * cost.input;
  const outputCost = (outputTokens / 1000) * cost.output;

  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
  };
};
