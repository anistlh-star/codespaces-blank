//ecommerce/backend/workers/orderWorker.js
//worker or consumer job is to process the data which is added in the queueu
//this is the bullmq setup
import { Queue, Worker } from "bullmq";
import { redisConnection } from "../config/redis/redisClient.js";

//we deadLetterQueue because if jobs lost after 3 attempt then we cant investigate why it failed then we Can't manually retry later so deadLetterQueue store the failed jobs so we can check 
//then we will GET and POST a route for admin to get failed jobs and then so he can retry them  , or user can retry order or paying the payment again 

export const deadLetterQueue = new Queue("dead-letter-queue", { 
  connection: redisConnection,
});
export const startOrderWorker =()=>{
  console.log("Starting orders worker...");

  const worker = new Worker(
  "orders",

  async (job) => {
    try {
      console.log("Processing order:", job.data);
      console.log(`Priority: ${job.opts.priority}`);
      await new Promise((resolve) => {
        setTimeout(resolve, 5000);
      });

      console.log("Order completed");
    } catch (error) {
      console.log(`Attempt ${job.attemptsMade} failed`);
      // Randomly fail jobs
      const randomFailure = Math.random() < 0.5;

      if (randomFailure) {
        throw new Error("Payment service failed");
      }
      if (job.attemptsMade === 1) {
        // First failure - maybe temporary network issue
        throw error; // Will retry
      } else if (job.attemptsMade === 2) {
        // Second failure - maybe payment gateway is down  , the notifyAdmin is just a presumed function to let the admin now about the issue

        await notifyAdmin("Payment gateway issue", error);
        throw error; // One more try
      }
    }

    // Randomly fail jobs
    const randomFailure = Math.random() < 0.5;

    if (randomFailure) {
      throw new Error("Payment service failed");
    }
  },

  {
    connection: redisConnection,

    concurrency: 1,
  },
);

worker.on("active", (job) => {
  console.log(`Order job ${job.id} is active`);
});

worker.on("completed", (job) => {
  console.log(`order ${job.id} completed`);
});

worker.on("error", (err) => {
  console.error("Orders worker error:", err);
});

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

console.log("orders worker started and connected to Redis (if Redis is ready)");

return worker;

}
