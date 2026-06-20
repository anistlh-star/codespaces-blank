// ecommerce/backend/controllers/categoryController.js
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import path from "path";
import fs from "fs/promises";
import asyncHandler from "../utils/asyncHandler.js";
import { KEYS } from "../cache/keys.js";
import { cacheOrchestrator } from "../cache/cacheOrchestrator.js";
import { TTL } from "../cache/ttl.js";

export const getAllCategories = asyncHandler(async (req, res) => {
  const cacheKey = KEYS.categoryList;

  const result = await cacheOrchestrator({
    key: cacheKey,
    ttl: TTL.category,
    fetch: async () => {
      const categories = await Category.find({}).lean();

      const productsPerCategory = await Product.aggregate([
        {
          $group: {
            _id: "$category",
            totalProducts: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "_id",
            foreignField: "_id",
            as: "category_info",
          },
        },
        { $unwind: "$category_info" },
        {
          $project: {
            _id: 1,
            categoryName: "$category_info.name",
            totalProducts: 1,
            image: "$category_info.image",
            description: "$category_info.description",
          },
        },
        { $sort: { categoryName: 1 } },
      ]);
      return { categories, productsPerCategory };
    },
  });
  res.json({ success: true, data: result });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const existing = await Category.findOne({ name: name.trim() });
  if (existing) {
    return res
      .status(409)
      .json({ success: false, message: "Category already exists" });
  }

  const image = req.file ? `/images/${req.file.filename}` : null;
  const category = await Category.create({
    name: name.trim(),
    description: description?.trim() || "",
    image,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

export const editCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const updateData = {};
  if (name) updateData.name = name.trim();
  if (description !== undefined) updateData.description = description.trim();
  if (req.file) updateData.image = `/uploads/images/${req.file.filename}`;

  const updated = await Category.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  );

  if (!updated) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });
  }

  res.json({ success: true, category: updated });
});

export const getSingleCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });
  }
  res.json({ success: true, category });
});

export const getCategoriesWithCount = asyncHandler(async (req, res) => {
  const categories = await Product.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "categoryInfo",
      },
    },
    { $unwind: "$categoryInfo" },
    {
      $project: {
        _id: "$categoryInfo._id",
        name: "$categoryInfo.name",
        count: 1,
      },
    },
    { $sort: { name: 1 } },
  ]);

  res.json({ success: true, categories });
});

// 🔥 Fixed critical bug
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });
  }

  const productCount = await Product.countDocuments({ category: id });
  if (productCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete category used in ${productCount} products`,
    });
  }

  await Category.findByIdAndDelete(id);

  // Delete image if exists
  if (category.image) {
    const imagePath = path.join(
      process.cwd(),
      category.image.replace(/^\//, ""),
    );
    try {
      await fs.unlink(imagePath);
    } catch (err) {
      console.warn(`Image not found or already deleted: ${imagePath}`);
    }
  }

  res.json({ success: true, message: "Category deleted successfully" });
});
