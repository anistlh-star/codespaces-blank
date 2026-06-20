import { Document } from "@langchain/core/documents";
import Product from "../models/Product.js";
import getVectorStore from "./vectorStore.js";

export const reIngestProduct = async (productId) => {
  try {
    const vectorStore = await getVectorStore();

    // 1️⃣ Fetch latest product from MongoDB
    const product = await Product.findById(productId)
      .populate("category")
      .lean();

    if (!product) {
      throw new Error("Product not found");
    }

    // 2️⃣ Build clean text representation
    const text = `
Product Name: ${product.name}
Brand: ${product.brand || "Generic"}
Category: ${product.category?.name || "Uncategorized"}
Price: ${product.price}
Stock: ${product.stock}
Description: ${product.description || ""}
Features: ${(product.specifications || [])
      .map((s) => `${s.label}: ${s.value}`)
      .join(", ")}
`.trim();

    // 3️⃣ Create document
    const doc = new Document({
      pageContent: text,
      metadata: {
        productId: product._id.toString(),
        name: product.name,
        category: product.category?.name || "Uncategorized",
        price: product.price,
        stock: product.stock,
      },
    });

    // 4️⃣ Remove old vector (important step)
    await vectorStore.delete({
      filter: {
        productId: product._id.toString(),
      },
    });

    // 5️⃣ Add updated version
    await vectorStore.addDocuments([doc]);

    console.log("✅ Product re-indexed:", product.name);
  } catch (error) {
    console.error("❌ reIngestProduct error:", error.message);
    throw error;
  }
};
