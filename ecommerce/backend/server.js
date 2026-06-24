// ecommerce/backend/server.js
// Load environment variables as early as possible
import "dotenv/config";

import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis/redisClient.js";
import { cacheWarmerJob } from "./jobs/cacherWarmerJob.js";

import app from "./app.js";
import { startCacheWorker } from "./workers/cacheWorker.js";
import { startOrderWorker } from "./workers/orderWorker.js";
import { startEmailWoker } from "./workers/emailWorker.js";

connectDB();
connectRedis();
startOrderWorker();
startEmailWoker();
startCacheWorker();
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await cacheWarmerJob();
});