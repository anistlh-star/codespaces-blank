//ecommerce/backend/controllers/adminController.js
import Order from "../models/Order.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getAdminStats = asyncHandler(async (req, res) => {
  // 1. Total Users
  const totalUsers = await User.countDocuments({});

  // 2. Single aggregation for all order stats
  const [orderStats] = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
        totalItemsSold: { $sum: { $sum: "$items.quantity" } },

        // Count by status (will be 0 if no documents match)
        pending: {
          $sum: {
            $cond: [{ $in: ["$status", ["Pending", "pending"]] }, 1, 0],
          },
        },
        processing: {
          $sum: {
            $cond: [{ $in: ["$status", ["Processing", "processing"]] }, 1, 0],
          },
        },
        onHold: {
          $sum: {
            $cond: [{ $in: ["$status", ["On Hold", "on hold"]] }, 1, 0],
          },
        },
        completed: {
          $sum: {
            $cond: [{ $in: ["$status", ["Completed", "completed"]] }, 1, 0],
          },
        },
        cancelled: {
          $sum: {
            $cond: [{ $in: ["$status", ["Cancelled", "cancelled"]] }, 1, 0],
          },
        },
        delivered: {
          $sum: {
            $cond: [{ $in: ["$status", ["Delivered", "delivered"]] }, 1, 0],
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalOrders: { $ifNull: ["$totalOrders", 0] },
        totalRevenue: { $ifNull: ["$totalRevenue", 0] },
        totalItemsSold: { $ifNull: ["$totalItemsSold", 0] },

        pendingOrders: { $ifNull: ["$pending", 0] },
        processingOrders: { $ifNull: ["$processing", 0] },
        onHoldOrders: { $ifNull: ["$onHold", 0] },
        completedOrders: { $ifNull: ["$completed", 0] },
        cancelledOrders: { $ifNull: ["$cancelled", 0] },
        deliveredOrders: { $ifNull: ["$delivered", 0] },

        // Derived fields
        inProgressOrders: {
          $add: ["$pending", "$confirmed", "$shipped"],
        },
        completedOrders: {
          $add: ["$delivered", "$cancelled", "$completed"],
        },

        // Success Rate: delivered / totalOrders (excluding cancelled optional)
        successRate: {
          $cond: [
            { $eq: ["$totalOrders", 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$delivered", "$totalOrders"] },
                    100,
                  ],
                },
                0,
              ],
            },
          ],
        },
      },
    },
  ]);

  // If no orders exist, orderStats will be undefined → fallback to zeros
  const stats = orderStats || {
    totalOrders: 0,
    totalRevenue: 0,
    totalItemsSold: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    inProgressOrders: 0,
    completedOrders: 0,
    successRate: 0,
  };

  // Final response
  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      ...stats,
    },
  });
});

export const SalesByCategory = asyncHandler(async (req, res) => {
  const getStats = await Order.aggregate([
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productInfo",
      },
    },
    { $unwind: "$productInfo" },
    {
      $lookup: {
        from: "categories",
        localField: "productInfo.category",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    { $unwind: "$categoryInfo" },
    {
      $group: {
        _id: "$categoryInfo.name",
        totalRevenue: {
          $sum: { $multiply: ["$items.quantity", "$items.price"] },
        },
        totalSold: { $sum: "$items.quantity" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { totalRevenue: -1 } },
    {
      $project: {
        _id: 0,
        category: "$_id",
        totalSold: 1,
        totalRevenue: 1,
        orderCount: 1,
      },
    },
  ]);
  res.json({ stats: getStats });
});

export const RecentOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("user", "name email phone address")
    .lean();

  res.json({
    success: true,
    orders
  });
});