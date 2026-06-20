//ecommerce/backend/queues/orderController.js
import express from 'express'
import { orderQueue } from "./orderQueue.js";

export const placeOrder = async (req, res) => {
    console.log('orderData:', req.body);

  const { orderData } = req.body;
  await orderQueue.add("add-order", orderData, { attempts: 3 });

  return res.json({
    message: "order added in queue",
  });
};
const router = express.Router()
router.post("/place-order", placeOrder);

export default router