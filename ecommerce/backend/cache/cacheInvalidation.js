//ecommerce/backend/cache/cacheInvalition.js
import { delCache } from "./cacheService.js";



export const invalidateProductCache = async ({ productId, userId } = {}) => {
  const operations = [
    delCache("products:list:*"), // Assumes backend service supports pattern/scan clearing
    delCache("products:featured"),
    delCache("products:trending"),
    delCache("products:newArrivals"),
    delCache("products:brand"),
    delCache("products:popular")
  ];

  // Safely target the precise single item profile cache layout if provided
  if (productId) {
    operations.push(delCache(`product:${productId}`));
  }

  // Safely clear the specific seller's inventory screen cache structure if provided
  if (userId) {
    operations.push(delCache(`products:user:${userId}:*`));
  }

  console.log(`Executing product cache evictions for Product: ${productId || 'Any'}, User: ${userId || 'Any'}`);
  await Promise.all(operations);
};
export const invalidateCategoryCache = async (id) => {
  console.log(`Invalidating cache for category ID: ${id}`);
  await Promise.all([delCache(`category:${id}`), delCache("categories:list")]);
};
export const invalidateUserCache = async (id) => {
  console.log(`Invalidating cache for user ID: ${id}`);
  await Promise.all([delCache(`user:${id}`), delCache("users:list")]);
};
