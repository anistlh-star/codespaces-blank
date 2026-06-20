// ecommerce/backend/utils/asyncHandler.js

/**
 * Async Handler Wrapper
 * Catches any error thrown in async controller functions and passes it to Express error handler
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;