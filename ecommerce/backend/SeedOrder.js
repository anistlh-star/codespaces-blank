//ecommerce/backend/SeedOrder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";

dotenv.config();

const orderStatuses = [
  "pending",
  "processing",
  "on hold",
  "completed",
  "cancelled",
  "delivered",
];

const paymentMethods = [
  "Cash on Delivery",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "EasyPaisa",
  "JazzCash",
];

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomDate = (daysBack = 180) => {
  const now = new Date();
  const past = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);
  return new Date(
    past.getTime() + Math.random() * (now.getTime() - past.getTime()),
  );
};

const seedOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding orders...");

    // Clear previous orders
    await Order.deleteMany({});
    console.log("Existing orders cleared.");

    const users = await User.find().select("_id name");
    if (users.length === 0)
      throw new Error("No users found. Please seed users first.");

    const products = await Product.find().select("name images price salePrice");
    if (products.length === 0)
      throw new Error("No products found. Please seed products first.");

    console.log(`Found ${users.length} users and ${products.length} products`);

    const orders = [];
    const targetOrders = 10; // feel free to change to 50, 120, etc.

    for (let i = 0; i < targetOrders; i++) {
      const user = users[randomInt(0, users.length - 1)];

      // 1–4 items per order (realistic)
      const numItems = randomInt(1, 4);
      const selectedProducts = [...products]
        .sort(() => 0.5 - Math.random())
        .slice(0, numItems);

      const orderItems = [];
      let totalAmount = 0;

      for (const p of selectedProducts) {
        const quantity = randomInt(1, 3);
        // Prefer sale price sometimes
        const price =
          p.salePrice && Math.random() > 0.35 ? p.salePrice : p.price;

        orderItems.push({
          product: p._id,
          name: p.name,
          image: p.images?.[0] || "https://via.placeholder.com/300",
          price: Number(price.toFixed(2)),
          quantity,
        });

        totalAmount += price * quantity;
      }

      const status = orderStatuses[randomInt(0, orderStatuses.length - 1)];

      // Slightly realistic payment status mapping
      let paymentStatus;
      if (status === "cancelled") {
        paymentStatus = Math.random() > 0.5 ? "Failed" : "Refunded";
      } else if (status === "pending" || status === "on hold") {
        paymentStatus = "Pending";
      } else {
        paymentStatus = "Paid";
      }

      // More Pakistani-like addresses
      const cities = [
        "Karachi",
        "Lahore",
        "Islamabad",
        "Rawalpindi",
        "Faisalabad",
        "Multan",
        "Peshawar",
        "Quetta",
      ];
      const areas = [
        "DHA",
        "Gulberg",
        "Bahria Town",
        "Johar Town",
        "Model Town",
        "F-11",
        "Clifton",
        "PECHS",
        "Saddar",
        "G-9",
      ];

      const shippingAddress = {
        fullName: user.name || user._id.toString(),
        phone: `+92${randomInt(300, 345)}-${randomInt(1000000, 9999999)}`,
        street: `${randomInt(10, 999)} ${areas[randomInt(0, areas.length - 1)]}`,
        city: cities[randomInt(0, cities.length - 1)],
        state: randomInt(0, 1) === 0 ? "Punjab" : "Sindh",
        country: "Pakistan",
        zipCode: randomInt(10000, 99999).toString(),
      };

      orders.push({
        user: user._id,
        items: orderItems,
        shippingAddress,
        paymentMethod: paymentMethods[randomInt(0, paymentMethods.length - 1)],
        paymentStatus,
        status,
        totalAmount: Number(totalAmount.toFixed(2)),
        createdAt: randomDate(180),
        updatedAt: new Date(),
      });
    }
// delete
await Order.deleteMany({});
console.log("Existing orders cleared.");
    // Insert all at once
    await Order.insertMany(orders);
    console.log(`\nSuccessfully seeded ${orders.length} realistic orders!`);

    // Show nice distribution
    const stats = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    console.log("\nOrder Status Distribution:");
    stats.forEach((s) => {
      console.log(`  ${s._id.padEnd(12)} : ${s.count}`);
    });

    const paymentStats = await Order.aggregate([
      { $group: { _id: "$paymentStatus", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    console.log("\nPayment Status Distribution:");
    paymentStats.forEach((s) => {
      console.log(`  ${s._id.padEnd(12)} : ${s.count}`);
    });

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seedOrders();
