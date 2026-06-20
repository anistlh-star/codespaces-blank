// backend/scripts/debugRAG.js
import dotenv from "dotenv";
import getVectorStore from "../config/vectorStore.js";
dotenv.config();


const debugSearch = async () => {
  try {
    console.log("🔍 Starting RAG Debug...\n");

    const vectorStore = await getVectorStore();

    const query = " headphones";   // Change this to test different queries
    console.log(`Searching for: "${query}"\n`);

    // Step-by-step visibility
    const docs = await vectorStore.similaritySearch(query, 3); // top 3 results

    console.log(`✅ Found ${docs.length} documents:\n`);

    docs.forEach((doc, index) => {
      console.log(`=== Result ${index + 1} ===`);
      console.log(`Product Name : ${doc.metadata.name}`);
      console.log(`Price        : $${doc.metadata.price}`);
      console.log(`Stock        : ${doc.metadata.stock}`);
      console.log(`Category     : ${doc.metadata.category}`);
      console.log(`Product ID   : ${doc.metadata.productId}`);
      console.log(`\nPreview Text :`);
      console.log(doc.pageContent.substring(0, 300) + "...\n");
      console.log("-".repeat(80));
    });

    // Bonus: See similarity score (if you want more control)
    // const resultsWithScore = await vectorStore.similaritySearchWithScore(query, 3);
    // console.log("With Scores:", resultsWithScore);

  } catch (error) {
    console.error("Debug Error:", error.message);
  }
};

debugSearch();