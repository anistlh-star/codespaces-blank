// ecommerce/backend/config/redis/redisClient.js
import { Redis } from "ioredis";

const redisUrl = process.env.REDIS_URL;

// Main client instance for general caching operations
export const redisClient = redisUrl 
  ? new Redis(redisUrl) 
  : new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: parseInt(process.env.REDIS_PORT) || 6379,
    });

redisClient.on("connect", () => console.log("✔✔✔ REDIS Connected ✔✔✔"));
redisClient.on("error", (err) => console.error("Redis Error:", err));

export const connectRedis = async () => {
  try {
    await redisClient.ping();
    console.log("✔✔✔ REDIS Connection Verified ✔✔✔");
    return redisClient;
  } catch (error) {
    console.error("Redis Connection Failed:", error);
    throw error;
  }
};

/**
 * Factory helper to generate separate client connections for BullMQ.
 * This guarantees the mandatory maxRetriesPerRequest rule is applied 
 * seamlessly across both local and production string-based cloud clusters.
 */
export const createWorkerConnection = () => {
  return redisUrl
    ? new Redis(redisUrl, { maxRetriesPerRequest: null })
    : new Redis({
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: parseInt(process.env.REDIS_PORT) || 6379,
        maxRetriesPerRequest: null,
      });
};