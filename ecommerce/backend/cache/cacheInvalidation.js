import { delCache, delCacheByPattern } from "./cacheService.js";
import { KEYS } from "./keys.js";

export const invalidateProductCache = async ({ productId, userId } = {}) => {
  const operations = [
    delCacheByPattern(KEYS.productList("*")),
    delCache(KEYS.featured),
    delCache(KEYS.trending),
    delCache(KEYS.newArrivals),
    delCache(KEYS.brands),
    delCache(KEYS.popularProducts),
  ];

  if (productId) {
    operations.push(delCache(KEYS.product(productId)));
  }

  if (userId) {
    operations.push(delCacheByPattern(`products:user:${userId}:*`));
  }

  console.log(`Executing product cache evictions for Product: ${productId || 'Any'}, User: ${userId || 'Any'}`);
  await Promise.all(operations);
};

export const invalidateCategoryCache = async (id) => {
  console.log(`Invalidating cache for category ID: ${id}`);
  await Promise.all([delCache(KEYS.singleCategory(id)), delCache(KEYS.categoryList)]);
};

export const invalidateUserCache = async (id) => {
  console.log(`Invalidating cache for user ID: ${id}`);
  await Promise.all([delCache(KEYS.singleUser(id)), delCache(KEYS.userList)]);
};
