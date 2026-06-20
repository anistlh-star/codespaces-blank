//ecommerce/backend/services/ai/errorHandler.js
//now instead of general error it will show us what type of error and what message should it display with errorCode as well
export class AIError extends Error {
  constructor(message, type, errorCode) {
    super(message);
    this.type = type;
    this.errorCode = errorCode;
  }
}

// to get the above function gets used we will create another function which we will tell the what message to display for tpye and error code
export const classifyAiError = (error) => {
  // Rate limit
  if (error.status === 429) {
    return new AIError("Too many requests", "rate_limit", 429);
  }

  // Timeout
  if (error.code === "ETIMEDOUT" || error.message?.includes("timeout")) {
    return new AIError("AI request timed out", "timeout", 408);
  }

  // Content filtering
  if (error.message?.includes("content") || error.message?.includes("policy")) {
    return new AIError("Content blocked", "content_filter", 400);
  }

  // Authentication
  if (error.status === 401) {
    return new AIError("Invalid API key", "auth", 401);
  }

  // Default
  return new AIError("AI service failed", "server_error", 500);
};
// [ ] Task 2: Implement retry with exponential backoff
export const withRetry = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      if (error.type === "rate_limit") {
        await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
      }
    }
  }
};
export const FALLBACK_RESPONSES = {
  rate_limit: "I'm a bit busy right now. Please try again in a moment.",

  timeout: "That took longer than expected. Please try again.",

  content_filter: "I can't respond to that request.",

  auth: "AI service configuration issue.",

  server_error: "Something went wrong with the AI service.",

  default: "I'm having trouble right now. Please try again later.",
};
