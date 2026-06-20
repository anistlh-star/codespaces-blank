//ecommerce/backend/queues/orderQueue.js
// (Producer) it will only add jobs to queue
import { Queue } from "bullmq";
import { redisConnection } from "../config/redis/redisClient.js";

export const orderQueue = new Queue("orders", {
  redisConnection,
});
