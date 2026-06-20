// backend/scripts/ingestProducts.js
//this file is responsible for ingesting product data from MongoDB into ChromaDB as vector embeddings for use in the RAG system.
import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

import getVectorStore, { COLLECTION_NAME } from "../config/vectorStore.js";
import { Document } from "@langchain/core/documents";
import { ChromaClient } from "chromadb";

const ingestProducts = async () => {
  try {
    await connectDB();
    console.log("📊 Connected to MongoDB");

    const products = await Product.find({}).populate("category" , 'name').lean();

    if (products.length === 0) {
      console.log("❌ No products found in database");
      process.exit(1);
    }

    console.log(`📦 Found ${products.length} products. Starting ingestion...`);

    const vectorStore = await getVectorStore();

    // Prepare documents for ChromaDB
    const documents = [];

    for (const product of products) {
      const text = `
Product: ${product.name}
Category: ${product.category.name}
Brand: ${product.brand}

Price Info:
- Price: $${product.price}
- Sale Price: $${product.salePrice || "N/A"}
- Discount: ${product.discountPercentage || 0}%

Stock Info:
- Stock: ${product.stock}
- Status: ${product.stockStatus}

Description:
${product.description}

Key Features:
${product.specifications?.map((s) => `${s.label}: ${s.value}`).join("\n") || "N/A"}
`.trim();

      documents.push(
        new Document({
          pageContent: text,
          metadata: {
            productId: product._id.toString(),
            name: product.name,
            brand: product.brand || "",
            category: product.category?.name || "",
            price: product.price || 0,
            salePrice: product.salePrice || null,
            discountPercentage: product.discountPercentage || null,
            description: product.description || "",
            stock: product.stock || 0,
            stockStatus: product.stockStatus || "in-stock",
            rating: product.rating || 0,
            reviews: product.reviews || 0,
            featured: product.featured || false,
            onSale: product.onSale || false,
            countryOfOrigin: product.countryOfOrigin || "",
            releaseDate: product.releaseDate
              ? product.releaseDate.toISOString()
              : null,
            specifications: product.specifications
              ? JSON.stringify(product.specifications)
              : "[]",
          },
        }),
      );
    }

    // Delete all existing documents
    const chromaClient = new ChromaClient({ host: "localhost", port: 8000 });
    const collection = await chromaClient.getCollection({
      name: COLLECTION_NAME,
    });
    const allData = await collection.get();
    const allIds = allData.ids || [];
    if (allIds.length > 0) {
      await collection.delete({ ids: allIds });
    }

    await vectorStore.addDocuments(documents);

    console.log(
      `🎉 Successfully ingested ${products.length} products into ChromaDB!`,
    );
  } catch (error) {
    console.error("❌ Ingestion failed:", error.message);
    process.exit(1);
  }
};

ingestProducts();
