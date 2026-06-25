//ecommerce/backend/controllers/imageController.js
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { delCacheByPattern } from "../cache/cacheService.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteImage = async (product) => {
  if (product.images && product.images.length > 0) {
    for (const img of product.images) {
      const fileName = path.basename(img);
      const imgPath = path.join(process.cwd(), "uploads", "images", fileName);

      try {
        await fs.access(imgPath);
      } catch (error) {
        continue;
      }

      await fs.unlink(imgPath);
    }
    await delCacheByPattern("products:list:*");
  }
};
