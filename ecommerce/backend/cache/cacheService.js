// ecommerce/backend/cache/cacheService.js

import { redisClient } from "../config/redis/redisClient.js";

export const getCache = async (key) => {
  const data = await redisClient.get(key); // ✅ Use redisClient
  return data ? JSON.parse(data) : null;
};

export const setCache = async (key, value, ttl) => {
  await redisClient.set(key, JSON.stringify(value), "EX", ttl); // ✅ Use redisClient
};

export const delCache = async (key) => {
  await redisClient.del(key); // ✅ Use redisClient
};
