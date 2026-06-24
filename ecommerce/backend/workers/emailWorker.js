// ecommerce/backend/workers/emailWorker.js
import { Worker } from "bullmq";
import { createWorkerConnection } from "../config/redis/redisClient.js";
import { deadLetterQueue } from "./orderWorker.js";
import { sendEmail } from "../services/email/emailService.js";

export const startEmailWoker = () => {
  console.log("Starting email worker...");

  const worker = new Worker(
    "email-queue",
    async (job) => {
      console.log("📧 Processing email job:", job.id, job.data);
      try {
        const result = await sendEmail(job.data);
        console.log("✅ Email sent, messageId:", result.messageId);
      } catch (err) {
        console.error("❌ sendEmail failed:", err.message);
        throw err;
      }
    },
    { connection: createWorkerConnection() }
  );

  worker.on("active", (job) => console.log(`Email job ${job.id} is active`));
  worker.on("completed", (job) => console.log(`Job ${job.id} completed`));
  worker.on("error", (err) => console.error("Email worker error:", err));

  worker.on("failed", async (job, err) => {
    const attempts = job?.attemptsMade ?? 0;
    const maxAttempts = job?.opts?.attempts ?? 3;
    if (attempts >= maxAttempts) {
      try {
        await deadLetterQueue.add("failed-email", job.data);
        console.log(`Job ${job.id} moved to dead-letter queue after ${attempts} attempts`);
      } catch (dqErr) {
        console.error("Failed to add job to dead-letter queue:", dqErr);
      }
    }
    console.log(`Job ${job.id} (${job.name}) failed: ${err.message}`);
  });

  console.log("email-queue worker started and connected to Redis");
  return worker;
};