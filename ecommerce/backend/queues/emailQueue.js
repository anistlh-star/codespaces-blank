import { Queue } from "bullmq";
import {  redisClient } from "../config/redis/redisClient.js";

export const emailQueue = new Queue("email-queue", {
  connection: redisClient,
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
