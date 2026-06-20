//ecommerce/backend/controllers/imageController.js
import fs from "fs/promises";
import path from "path";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deleteImage = async (product) => {
  if (product.images && product.images.length > 0) {
    for (const img of product.images) {
      //it will loop through every image and what to do with it

      const imgPath = (imagePath) => {
        const filename = path.basename(imagePath); // works for /images/xxx.jpg or xxx.jpg
        return path.join(process.cwd(), 'uploads', 'images', filename);
      };
      // Check if the file exists before attempting to delete
      try {
        await fs.access(imgPath);
      } catch (error) {
        continue;
      }
      //  deleting the image file
      await fs.unlink(imgPath);
    }
  }
};
