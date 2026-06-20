//ecommerce/backend/cache/cacheInvalition.js
import { delCache } from "./cacheService.js";

export const invalidateProductCache = async (id) => {
  console.log(`Invalidating cache for product ID: ${id}`);
  await Promise.all([
    delCache(`product:${id}`),
    delCache("products:list:*"),
    delCache("products:featured"),
    delCache("products:trending"),
    delCache("products:newArrivals"),
    delCache("products:brand"),
  ]);
};
export const invalidateCategoryCache = async (id) => {
  console.log(`Invalidating cache for category ID: ${id}`);
  await Promise.all([delCache(`category:${id}`), delCache("categories:list")]);
};
export const invalidateUserCache = async (id) => {
  console.log(`Invalidating cache for user ID: ${id}`);
  await Promise.all([delCache(`user:${id}`), delCache("users:list")]);
};
