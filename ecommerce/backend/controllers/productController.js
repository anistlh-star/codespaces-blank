//ecommerce/backend/controllers/productController.js
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Category from "../models/Category.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteImage } from "./imageController.js";
import mongoose from "mongoose";
import { reIngestProduct } from "../config/vectorService.js";
import { getQueryHash } from "../utils/hash.js";
import { KEYS } from "../cache/keys.js";
import { TTL } from "../cache/ttl.js";
import { cacheOrchestrator } from "../cache/cacheOrchestrator.js";
import { delCache } from "../cache/cacheService.js";
import { invalidateProductCache } from "../cache/cacheInvalidation.js";
import logger from "../config/logger.js";

export const getAllProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    search,
    priceMin = 0,
    priceMax = 100000,
    category,
    sortField = "createdAt",
    sortOrder = "desc",
    rating,
    brand,
  } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const queryHash = getQueryHash(JSON.stringify(req.query));

  const cacheKey = KEYS.productList(queryHash);
  const sort = {
    [sortField]: sortOrder === "desc" ? -1 : 1,
  };

  const result = await cacheOrchestrator({
    key: cacheKey,
    ttl: TTL.list,

    fetch: async () => {
      const filter = {
        price: {
          $gte: Number(priceMin),
          $lte: Number(priceMax),
        },
      };

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      if (brand) filter.brand = brand;

      if (category) {
        if (!mongoose.isValidObjectId(category)) {
          throw new Error("Invalid category ID");
        }
        filter.category = category;
      }

      if (rating) {
        filter.rating = { $gte: Number(rating) };
      }

      const products = await Product.find(filter)
        .populate("category", "name")
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean();

      const totalProducts = await Product.countDocuments(filter);
      const totalAll = await Product.countDocuments();

      return {
        products,
        totalProducts,
        totalAll,
        currentPage: pageNum,
        totalPages: Math.ceil(totalProducts / limitNum),
      };
    },
  });
  return res.json({
    success: true,
    source: result.source,
    data: result,
  });
});
export const getProductsByUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const sortField = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder || "desc";

  const allowedFields = ["createdAt", "price", "rating"];
  if (!allowedFields.includes(sortField)) {
    return res.status(400).json({ success: false, message: "Invalid sort field" });
  }

  const sortDir = sortOrder === "asc" ? 1 : -1;
  const queryHash = getQueryHash(JSON.stringify({ userId, sortField, sortOrder }));
  const cacheKey = KEYS.userProducts(userId, queryHash);
  const result = await cacheOrchestrator({
    key: cacheKey,
    ttl: TTL.list,
    fetch: async () => {
      // Changed from .findOne() to .find() to handle array collections cleanly
      const products = await Product.find({ createdBy: userId })
        .sort({ [sortField]: sortDir })
        .populate("category", "name")
        .lean();

      return {
        products: products || [],
        count: products ? products.length : 0
      };
    },
  });

  return res.json({
    success: true,
    source: result.source,
    data: result,
  });
});
export const getPopularProducts = asyncHandler(async (req, res) => {
  const cacheKey = KEYS.popularProducts;
  const result = await cacheOrchestrator({
    key: cacheKey,
    ttl: TTL.list,
    fetch: async () => {
      const popularProducts = await Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            totalSold: { $sum: "$items.quantity" },
            productName: { $first: "$items.name" },
            productImage: { $first: "$items.image" },
            productPrice: { $first: "$items.price" },
          },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 10 },
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
      return popularProducts;
    },
  });
  return res.json({
    success: true,
    source: result.source,
    data: result,
  });
});
export const getSingleProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid product ID" });
  }

  const cacheKey = KEYS.product(id);
  const result = await cacheOrchestrator({
    key: cacheKey,
    ttl: TTL.single,
    fetch: async () => {
      const product = await Product.findById(id).populate("category", "name");
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    },
  });

  return res.json({
    success: true,
    source: result.source,
    data: result,
  });
});
export const AddProduct = asyncHandler(async (req, res) => {
  const {
    name, description, price, stock, category,
    releaseDate, countryOfOrigin, brand, specifications,
  } = req.body;

  let specsArray = [];
  if (specifications && typeof specifications == "string") {
    try {
      const parsed = JSON.parse(specifications);
      specsArray = parsed.filter((item) => item?.label?.trim() && item?.value?.trim());
    } catch (error) {
      logger.error("error parsing the specifications ", error);
    }
  }

  if (!name || !description) {
    logger.warn("name or description required !! ");
    return res.json({ success: false, message: "name or description required !! " });
  }

  const images = req.files ? req.files.map((file) => `/images/${file.filename}`) : [];

  const product = await Product.create({
    name: name.trim(),
    description: description.trim(),
    price: Number(price) || 0,
    stock: Number(stock) || 0,
    category,
    images,
    releaseDate: releaseDate || undefined,
    countryOfOrigin: countryOfOrigin?.trim(),
    brand: brand?.trim(),
    specifications: specsArray,
    createdBy: req.user._id,
  });

  const populatedProduct = await Product.findById(product._id).populate("category", "name");

  // Properly invoke the revamped, targeted cache invalidation cycle
  await invalidateProductCache({
    productId: populatedProduct._id,
    userId: req.user._id
  });

  res.json({
    success: true,
    message: `product ${name} added `,
    product: populatedProduct,
  });
});
export const UpdateProduct = asyncHandler(async (req, res) => {
  logger.info("Full req.body:", req.body); // ← Add this
  logger.info("req.body type:", typeof req.body); // should be "object"
  const {
    name,
    description,
    price,
    stock,
    category,
    brand,
    countryOfOrigin,
    releaseDate,
    specifications,
  } = req.body;
  logger.info("Received update data:", req.body.name);

  const updateData = {};
  const { id } = req.params;
  // Only set fields that are provided
  if (name) updateData.name = name;
  if (description) updateData.description = description;
  if (price) updateData.price = Number(price);
  if (stock) updateData.stock = Number(stock);
  if (category) updateData.category = category;
  if (brand) updateData.brand = brand;
  if (countryOfOrigin) updateData.countryOfOrigin = countryOfOrigin;
  if (releaseDate)
    updateData.releaseDate = releaseDate ? new Date(releaseDate) : undefined;
  let specsArray = [];

  if (specifications && typeof specifications == "string") {
    try {
      const parsed = JSON.parse(specifications);
      specsArray = parsed.filter(
        (item) => item?.label?.trim() && item?.value?.trim(),
      );
    } catch (error) {
      logger.error("error parsing the specifications ", error);
    }
  }

  if (specsArray.length > 0 || specifications === "[]") {
    updateData.specifications = specsArray;
  }
  if (req.files?.length > 0) {
    updateData.images = req.files.map((file) => `/images/${file.filename}`);
  }
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true },
  ).populate("category", "name");
  logger.info("Updated product:", updated); // ← Add this
  if (!updated) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  await invalidateProductCache({ productId: id });

  // await reIngestProduct(updated._id);
  res.json({
    success: true,
    product: updated,
  });
});

// DeleteProduct — improved response
export const DeleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }
  await invalidateProductCache({ productId: id });

  await deleteImage(product); // should handle array of images

  await Product.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: `Product "${product.name}" deleted successfully`,
  });
});
export const getProductBrand = asyncHandler(async (req, res) => {
  const brands = await Product.distinct("brand");
  const key = KEYS.brands;

  const result = await cacheOrchestrator({
    key: key,
    ttl: TTL.product,
    fetch: async () => {
      const brandsWithCount = await Product.aggregate([
        {
          $group: {
            _id: {
              $cond: [
                {
                  $or: [
                    { $eq: ["$brand", null] },
                    { $eq: ["$brand", ""] },
                    { $not: { $ne: ["$brand", "$$REMOVE"] } },
                  ],
                },
                "Miscellaneous",
                "$brand",
              ],
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 1,
            brandName: "$_id",
            count: 1,
          },
        },
        {
          $sort: {
            brandName: 1, // alphabetical order (A → Z), including "Miscellaneous"
          },
        },
      ]);
      return brandsWithCount;
    },
  });

  res.json({ success: true, brands, result: result });
});
export const getTrendingProducts = asyncHandler(async (req, res) => {
  const key = KEYS.trending;
  const result = await cacheOrchestrator({
    key: key,
    ttl: TTL.trending,
    fetch: async () => {
      const trendingProducts = await Order.aggregate([
        {
          $match: {
            status: {
              $in: ["completed", "delivered", "Completed", "Delivered"],
            },
          },
        },

        { $unwind: "$items" },

        {
          $group: {
            _id: "$items.product", // product ObjectId
            totalSold: { $sum: "$items.quantity" },
          },
        },

        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },

        { $unwind: "$product" },

        {
          $project: {
            _id: "$_id",
            name: "$product.name",
            images: "$product.images",
            price: "$product.price",
            salePrice: "$product.salePrice",
            discountPercentage: "$product.discountPercentage",
            stockStatus: "$product.stockStatus",
            rating: "$product.rating",
            totalSold: 1,
            originalPrice: "$product.price",
          },
        },

        { $sort: { totalSold: -1 } },

        { $limit: 8 },
      ]);
      return trendingProducts;
    },
  });
  logger.info("Trending products fetched");
  const imageandName = await Product.find({}, { name: 1, images: 1, _id: 0 });
  res.json({ success: true, data: result, imageandName });
});

export const featuredProducts = asyncHandler(async (req, res) => {
  try {
    const key = KEYS.featured;
    const result = await cacheOrchestrator({
      key: key,
      ttl: TTL.featured,
      fetch: async () => {
        const featuredProducts = await Product.find({ featured: true });
        return featuredProducts;
      },
    });
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
export const newArrivals = asyncHandler(async (req, res) => {
  try {
    const key = KEYS.newArrivals;
    const result = await cacheOrchestrator({
      key: key,
      ttl: TTL.newArrivals,
      fetch: async () => {
        const newArrivals = await Product.find()
          .populate("category", "name")
          .sort({ createdAt: -1 })
          .limit(10);
        return newArrivals;
      },
    });

    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
