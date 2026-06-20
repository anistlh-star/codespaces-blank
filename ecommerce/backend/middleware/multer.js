//ecommerce/backend/middleware/multer.js
import fs from "fs";
import multer from "multer";
import path from 'path'
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {recursive: true});
  }
};

const storage = multer.diskStorage({
  // it contains 2 sides one determines the destination and filename determines the file name
  destination: function (req, file, cb) {
    ensureDir("uploads/images");
    cb(null, "uploads/images");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
// ✅ single image
export const uploadSingle = multer({ storage }).single("image");

// ✅ multiple images
export const uploadMultiple = multer({ storage }).array("images", 5);