///workspaces/codespaces-blank/ecommerce/backend/workers/emailWorker.js
import { Worker } from "bullmq";
import { redisConnection } from "../config/redis/redisClient.js";
import { deadLetterQueue } from "./orderWorker.js";
import { sendEmail } from "../services/email/emailService.js";

const worker = new Worker(
  "email-queue",
  async (job) => {
    console.log("📧 Processing email job:", job.id, job.data);
    try {
      const result = await sendEmail(job.data);
      console.log("✅ Email sent, messageId:", result.messageId);
    } catch (err) {
      console.error("❌ sendEmail failed:", err.message); // ← will tell you exactly why
      throw err; // re-throw so BullMQ marks job as failed and retries
    }
  },
  { connection: redisConnection }, // ← your fix from before
);
worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});
worker.on("failed", async (job, err) => {
  if (attemptsMade >= 3) await deadLetterQueue.add("failed-email", job.data);
  console.log(`Job ${job.id} (${job.name}) failed: ${err.message}`);
});
