// ecommerce/backend/workers/orderWorker.js
import { Queue, Worker } from "bullmq";
import { createWorkerConnection } from "../config/redis/redisClient.js";

export const deadLetterQueue = new Queue("dead-letter-queue", { 
  connection: createWorkerConnection(),
});

export const startOrderWorker = () => {
  console.log("Starting orders worker...");

  const worker = new Worker(
    "orders",
    async (job) => {
      try {
        console.log("Processing order:", job.data);
        await new Promise((resolve) => setTimeout(resolve, 5000));
        console.log("Order completed");
      } catch (error) {
        console.log(`Attempt ${job.attemptsMade} failed`);
        const randomFailure = Math.random() < 0.5;
        if (randomFailure) throw new Error("Payment service failed");
        
        if (job.attemptsMade === 1) {
          throw error;
        } else if (job.attemptsMade === 2) {
          throw error;
        }
      }

      const randomFailure = Math.random() < 0.5;
      if (randomFailure) throw new Error("Payment service failed");
    },
    {
      connection: createWorkerConnection(),
      concurrency: 1,
    }
  );

  worker.on("active", (job) => console.log(`Order job ${job.id} is active`));
  worker.on("completed", (job) => console.log(`order ${job.id} completed`));
  worker.on("error", (err) => console.error("Orders worker error:", err));

  worker.on("failed", async (job, error) => {
    const attempts = job?.attemptsMade ?? 0;
    const maxAttempts = job?.opts?.attempts ?? 3;
    if (attempts >= maxAttempts) {
      try {
        await deadLetterQueue.add("failed Order", job.data);
        console.log(`Order ${job.id} moved to dead letter queue`);
      } catch (dqErr) {
        console.error("Failed to add to dead-letter queue:", dqErr);
      }
    }
    console.log(`Job ${job.id} failed after ${attempts} attempts`);
  });

  console.log("orders worker started and connected to Redis");
  return worker;
};