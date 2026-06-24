//ecommerce/backend/workers/cacheWorker.js
//worker or consumer job is to process the data which is added in the queue

import { Worker } from "bullmq";
import Order from "../models/Order.js";
import { redisClient, redisConnection } from "../config/redis/redisClient.js";
import { deadLetterQueue } from "./orderWorker.js";

// Export a starter so the worker is created when explicitly started (like other workers)
export const startCacheWorker = () => {
  console.log("Starting cache-warming worker...");

  const worker = new Worker(
    "cache-warming",
    async (job) => {
      console.log("Running cache-warmer Job...", job.id || "(manual run)");
      const popularProducts = await Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.productId",
            totalSold: { $sum: "$items.quantity" },
            productName: { $first: "$items.name" }, // from order (snapshot)
            productImage: { $first: "$items.image" },
            productPrice: { $first: "$items.price" },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 10 }, // Top 10 popular products
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $project: {
            _id: 0,
            productId: "$_id",
            name: "$productName",
            image: "$productImage",
            price: "$productPrice",
            totalSold: 1,
            category: "$productDetails.category",
            createdAt: "$productDetails.createdAt",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        { $unwind: "$categoryInfo" },
        {
          $project: {
            name: 1,
            image: 1,
            price: 1,
            totalSold: 1,
            categoryName: "$categoryInfo.name",
            dateAdded: "$createdAt",
          },
        },
        { $sort: { totalSold: -1 } },
      ]);

      // store in redis as JSON string
      try {
        await redisClient.set("popular-products", JSON.stringify(popularProducts), "EX", 3600);
        console.log("✅ Popular products cache refreshed");
      } catch (err) {
        console.error("Failed to update popular-products cache:", err);
        throw err;
      }
    },
    { connection: redisConnection }
  );

  worker.on("completed", (job) => {
    console.log(`Job with id ${job.id} has been completed`);
  });

  worker.on("active", (job) => {
    console.log(`Job ${job.id} is now active`);
  });

  worker.on("error", (err) => {
    console.error("Cache worker error:", err);
  });

  worker.on("failed", async (job) => {
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

  console.log("cache-warming worker started and connected to Redis (if Redis is ready)");
  return worker;
};
