// ecommerce/backend/config/redis/redisClient.js

import { Redis } from "ioredis";

// Connection configuration
export const redisConnection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null, // Required for BullMQ
};

// Create Redis client - ioredis connects automatically
export const redisClient = new Redis(redisConnection);

// Redis connection handling
redisClient.on("connect", () => console.log("✔✔✔ REDIS Connected ✔✔✔"));
redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient.on("ready", () => console.log("Redis client is ready"));

// No need for explicit connect with ioredis
export const connectRedis = async () => {
  try {
    // ioredis auto-connects, just check if it's ready
    await redisClient.ping();
    console.log("✔✔✔ REDIS Connection Verified ✔✔✔");
    return redisClient;
  } catch (error) {
    console.error("Redis Connection Failed:", error);
    throw error;
  }
};
