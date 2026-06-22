// ecommerce/backend/controllers/orderController.js
import asyncHandler from "../utils/asyncHandler.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";


export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate("user", "name");
  res.json({ success: true, orders });
});
export const getOrdersByUser = asyncHandler(async (req, res) => {
  let userId = req.user._id;

  // If admin provided a userId in URL, use that instead
  if (
    req.params.userId &&
    (req.user.role === "admin" || req.user.role === "Admin")
  ) {
    userId = req.params.userId;
  }

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, orders });
});
export const statusChange = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status)
    return res
      .status(400)
      .json({ success: false, message: "Status is required" });

  const order = await Order.findById(id);
  if (!order)
    return res.status(404).json({ success: false, message: "Order not found" });

  // order.user is an unpopulated ObjectId here, not a document — compare directly.
  const isOwner = order.user.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin" || req.user.role === "Admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to view this order",
    });
  }
  order.status = status;

  await order.save();

  res.json({ success: true, message: "Order status updated", order });
});
export const UpdateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    items,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    status,
    totalAmount,
  } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ success: false, message: "Invalid order ID" });
  }

  const order = await Order.findById(id).populate("user", "name email phone");

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin" || req.user.role === "Admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  if (items !== undefined) {
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "Items must be an array" });
    }

    order.items = items.map((item) => ({
      product: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      quantity: item.quantity,
    }));
  }

  if (shippingAddress !== undefined) {
    order.shippingAddress.fullName = shippingAddress.fullName ?? order.shippingAddress.fullName;
    order.shippingAddress.phone = shippingAddress.phone ?? order.shippingAddress.phone;
    order.shippingAddress.street = shippingAddress.street ?? order.shippingAddress.street;
    order.shippingAddress.city = shippingAddress.city ?? order.shippingAddress.city;
    order.shippingAddress.state = shippingAddress.state ?? order.shippingAddress.state;
    order.shippingAddress.country = shippingAddress.country ?? order.shippingAddress.country;
    order.shippingAddress.zipCode = shippingAddress.zipCode ?? order.shippingAddress.zipCode;
  }

  if (paymentMethod !== undefined) order.paymentMethod = paymentMethod;
  if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;
  if (status !== undefined) order.status = status;
  if (totalAmount !== undefined) order.totalAmount = totalAmount;

  await order.save();

  res.json({ success: true, message: "Order updated", order });
});

export const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order)
    return res.status(404).json({ success: false, message: "Order not found" });

  res.json({ success: true, message: "Order deleted", order });
});
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Optional: early validation (good practice)
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID format",
    });
  }

  // Populate more useful fields
  const order = await Order.findById(id)
    .populate("user", "name email phone") // add phone if you have it
    .populate({
      path: "items.product",
      select: "name images price slug", // useful fields for frontend
    })
    .lean(); // faster when we don't need to modify the doc

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  // Permission check – allow owner OR admin
  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin" || req.user.role === "Admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "You do not have permission to view this order",
    });
  }

  // Calculations
  const subTotal = order.items.reduce((sum, item) => {
    // Use populated price if available, fallback to stored snapshot
    const itemPrice = item.product?.price || item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  // In real app: tax rate should come from order / settings / shipping country
  const taxRate = 0.05; // ← consider making this configurable later
  const tax = subTotal * taxRate;
  const totalAmount = subTotal + tax;

  // Optional: also return shipping cost, discount etc if your Order model has them
  res.json({
    success: true,
    order,
    subTotal: Number(subTotal.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
  });
});
// ─── ADMIN: CREATE ORDER ─────────────────────────────────────────────────
// Distinct from placeOrder: no cart involved, admin specifies the target
// user, and admin sets status/paymentStatus directly. Prices/stock are
// still re-derived from Product server-side — never trust client totals.
export const createOrder = asyncHandler(async (req, res) => {
  const {
    user,
    items,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    status,
  } = req.body;
  console.log("Admin order creation request:", req.body);
  if (!user || !mongoose.isValidObjectId(user)) {
    return res.status(400).json({ success: false, message: "Valid user ID is required" });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Order must contain at least one item" });
  }

  if (!shippingAddress?.street || !shippingAddress?.city ||
      !shippingAddress?.country || !shippingAddress?.zipCode ||
      !shippingAddress?.fullName) {
    return res.status(400).json({
      success: false,
      message: "Complete shipping address is required (fullName, street, city, country, zipCode)",
    });
  }

  if (!paymentMethod) {
    return res.status(400).json({ success: false, message: "Payment method is required" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let calculatedTotal = 0;
    const orderItems = [];
    const stockBulkOps = [];

    for (const item of items) {
      const productId = item.product || item.productId;
      if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID");
      }

      const product = await Product.findById(productId).session(session);
      if (!product) throw new Error("Product not found");

      if (product.stock < item.quantity) {
        throw new Error(`Only ${product.stock} left for ${product.name}`);
      }

      calculatedTotal += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: item.name || product.name,
        image: item.image || (product.images?.[0] || ""),
        price: product.price,
        quantity: item.quantity,
      });

      stockBulkOps.push({
        updateOne: {
          filter: { _id: product._id },
          update: { $inc: { stock: -item.quantity } },
        },
      });
    }

    const order = new Order({
      user,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state || "N/A",
        country: shippingAddress.country,
        zipCode: shippingAddress.zipCode,
        phone: shippingAddress.phone,
      },
      paymentMethod,
      paymentStatus: paymentStatus || "pending",
      status: status || "pending",
      totalAmount: calculatedTotal,
    });

    await order.save({ session });

    if (stockBulkOps.length > 0) {
      await Product.bulkWrite(stockBulkOps, { session });
    }

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    await session.abortTransaction();

    if (error.message.includes("Only") || error.message.includes("not found") || error.message.includes("Invalid product")) {
      return res.status(400).json({ success: false, message: error.message });
    }

    console.error("Admin order creation failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order. Please try again later.",
    });
  } finally {
    session.endSession();
  }
});

export const placeOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
console.log("Placing order for user:", userId, "with body:", req.body);
  // ─── 1. Extract & validate input ───────────────────────────────────────
  const {
    items,
    shippingAddress,
    paymentMethod,
  } = req.body;

  // Do NOT trust frontend totalAmount or paymentStatus
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Order must contain at least one item",
    });
  }

  if (!shippingAddress?.street || !shippingAddress?.city ||
      !shippingAddress?.country || !shippingAddress?.zipCode ||
      !shippingAddress?.fullName) {
    return res.status(400).json({
      success: false,
      message: "Complete shipping address is required (fullName, street, city, country, zipCode)",
    });
  }

  if (!paymentMethod || !["cod", "card"].includes(paymentMethod)) {
    return res.status(400).json({
      success: false,
      message: "Valid payment method required (cod or card)",
    });
  }

  // ─── 2. Validate products, stock & calculate real total ────────────────
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let calculatedTotal = 0;
    const orderItems = [];
    const stockBulkOps = [];
for (const item of items) {
  const productId = item.product || item.productId;
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("Invalid product ID");
  }

  const product = await Product.findById(productId).session(session);
  if (!product) throw new Error(`Product not found`);

  if (product.stock < item.quantity) {
    throw new Error(`Only ${product.stock} left for ${product.name}`);
  }

  calculatedTotal += product.price * item.quantity;

  orderItems.push({
    product: product._id,
    name: item.name || product.name,
    image: item.image || (product.images?.[0] || ""),
    price: product.price,
    quantity: item.quantity,
  });

  stockBulkOps.push({
    updateOne: {
      filter: { _id: product._id },
      update: { $inc: { stock: -item.quantity } },
    },
  });
}

    // ─── 3. Create order ───────────────────────────────────────────────────
    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state || "N/A",
        country: shippingAddress.country,
        zipCode: shippingAddress.zipCode,
        phone: shippingAddress.phone,
      },
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "processing", // sensible default
      status: "pending",
      totalAmount: calculatedTotal,
    });

    await order.save({ session });

    // ─── 4. Apply stock updates atomically ─────────────────────────────────
    if (stockBulkOps.length > 0) {
      await Product.bulkWrite(stockBulkOps, { session });
    }

    // ─── 5. Clear user's cart ──────────────────────────────────────────────
    await Cart.findOneAndUpdate(
      { userId },
      { $set: { items: [], totalAmount: 0, totalItems: 0 } },
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: {
        _id: order._id,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    await session.abortTransaction();

    // Distinguish between expected validation errors and real failures
    if (error.message.includes("Only") || error.message.includes("not found") || error.message.includes("Invalid product")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Order placement failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to place order. Please try again later.",
    });
  } finally {
    session.endSession();
  }
});