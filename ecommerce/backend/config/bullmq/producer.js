//ecommerce/backend/config/bullmq/producer.js
//producer only job is to add to queue
import { Queue } from "bullmq";
import express from "express";

const router = express.Router();

const orderQueue = new Queue("orders", {
  connection: {
    host: "localhost",
    port: 6379,
  },
});
export const PRIORITY = {
  VIP: 1,
  HIGH: 5,
  NORMAL: 10,
  LOW: 20,
};
router.post("/order", async (req, res) => {
  const { order, userType } = req.body;

  let priority = PRIORITY.NORMAL;
  if (userType == "vip") {
    PRIORITY = PRIORITY.VIP;
  } else if (userType == "high") {
    PRIORITY = PRIORITY.HIGH;
  } else if (userType == "low") {
    PRIORITY = PRIORITY.LOW;
  }
  const job = await orderQueue.add("create-order", order, {
    priority: priority,
    attempts: 3,
    backoff: { type: "exponential", delay: 1000 },
  });
  console.log(`job : ${job} added to QUEUE with priorty : ${priority}`);
  return res.json({ message: "Order received", job, priority });
});
export default router;
