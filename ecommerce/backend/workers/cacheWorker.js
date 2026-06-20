//ecommerce/backend/workers/cacheWorker.js
//worker or consumer job is to process the data which is added in the queueu

import { Worker } from "bullmq";
import { redisClient, redisConnection } from "../config/redis/redisClient.js";
import { deadLetterQueue } from "./orderWorker.js";

//this is the bullmq setup
const worker = new Worker("cache-warming", async () => {
  console.log("Running cache-warmer Job...");
  const popularProducts = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.product",
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
  //store in redis 
  await redisClient.set("popular-products", popularProducts, { EX: 3600 });
    console.log(
      "✅ Popular products cache refreshed"
    );
} , 
    {connection : redisConnection}
);

worker.on('completed' , (job) => {
    console.log(`Job with id ${job.id} has been completed`);
})

worker.on("failed", async (job) => {
  if (job.attemptsMade >= 3) {
    await deadLetterQueue.add("failed Order", job.data);
    console.log(`Order ${job.id} moved to dead letter queue`);
  }
  console.log(`Job ${job.id} failed after ${job.attemptsMade} attempts`);
});
//what we did above is called pro active caching it will update cache after every 1 hour and it will make sure that the cache is updated and fresh and users will not get stale or old cached data .It will reduce the load on database sheet  nad it will improve the performance and whenever the popular proucts will be fetched it try to get it first from the cache then if not there then it will be from database 