// backend/config/vectorStore.js
import dotenv from "dotenv";
dotenv.config();

import { Chroma } from "@langchain/community/vectorstores/chroma";
import { embeddings } from "./aiProvider.js";

export const COLLECTION_NAME = "ecommerce_products"; // Consistent name

let vectorStoreInstance = null;

export const getVectorStore = async () => {
  if (vectorStoreInstance) {
    return vectorStoreInstance; // it will store the token once and it will reuse it again so nodejs dont have to reconnect chromadb every instance
  }

  try {
    vectorStoreInstance = await Chroma.fromExistingCollection(embeddings, {
      collectionName: COLLECTION_NAME,
      host: "localhost",
      port: 8000,
    });

    console.log("✅ Reusing existing Chroma connection");
    return vectorStoreInstance;
  } catch (error) {
    console.log("📂 Creating new collection...");

    vectorStoreInstance = await Chroma.fromDocuments([], embeddings, {
      collectionName: COLLECTION_NAME,
      host: "localhost",
      port: 8000,
    });

    return vectorStoreInstance;
  }
};

export default getVectorStore;
