// /ecommerce/backend/index.js
import express from "express";
import { ExpressAdapter } from "@bull-board/express";
import { orderQueue } from "./queues/orderQueue.js";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import orderRoutes from "./queues/orderController.js";
import { connectRedis } from "./config/redis/redisClient.js";
const app = express();
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded bodies
connectRedis();

console.log("starting bull board server");
const serverAdapter = new ExpressAdapter();

app.get("/", (req, res) => {
  console.log("bull mq api is running");
  res.json({
    success: true,
    message: "BullMQ server running",
  });
});
serverAdapter.setBasePath("/admin/queues");
createBullBoard({
  queues: [new BullMQAdapter(orderQueue)],
  serverAdapter,
});

app.use("/admin/queues", serverAdapter.getRouter());
app.use("/api/orders", orderRoutes);
const PORT = 6000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  console.log(`Bull Board: http://localhost:${PORT}/admin/queues`);
});
