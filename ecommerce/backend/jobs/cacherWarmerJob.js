//ecommerce/backend/jobs/cacherWarmerJob.js
//we are adding cachewarmer job for popular products because it will more likely to be accessed by users
import { cacheWarmerQueue } from "../queues/cacheWarmerQueue.js";

export const cacheWarmerJob = async () => {
  await cacheWarmerQueue.add(
    "cache-warming",
    {},
    { repeat: { every: 60 * 60 * 1000 }, removeOnComplete: true },
  ); // every 1 hour
  console.log("cache warming  job will restart every 1 hour");
};
