import { Queue } from "bullmq";
import {  redisConnection } from "../config/redis/redisClient.js";

export const emailQueue = new Queue("email-queue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 5000,
    },

    removeOnComplete: 50,
    removeOnFail: 100,
  },
});
