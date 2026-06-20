//ecommerce/backend/config/bullmq/consumer.js
import { Worker } from "bullmq";

new Worker(
  "orders",
  async (job) => {
    console.log("Processing order:", job.data);
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);
