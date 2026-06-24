//ecommerce/backend/queues/cacheWarmerQueue.js
// (Producer) it will only add jobs to queue
import { Queue } from "bullmq";
import { redisClient } from "../config/redis/redisClient.js";

export const cacheWarmerQueue = new Queue("cache-warming", {
  connection: redisClient,
});
