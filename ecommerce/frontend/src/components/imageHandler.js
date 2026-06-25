// ecommerce/frontend/src/components/imageHandler.js

// Dynamically extract the backend root URL by stripping out any trailing "/api"
const rawBase = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "";
export const API_BASE = rawBase.replace(/\/api\/?$/, "");

export const placeholder =
  "https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg";

export const getImageSrc = (imgInput) => {
  if (!imgInput) return placeholder;

  let imgPath = imgInput;

  // 1. Handle image arrays seamlessly (e.g., product.images)
  if (Array.isArray(imgInput)) {
    if (imgInput.length === 0) return placeholder;
    imgPath = imgInput[0]; 
  }

  // 2. Handle external absolute URLs if any exist in the database
  if (typeof imgPath === "string" && (imgPath.startsWith("http://") || imgPath.startsWith("https://"))) {
    return imgPath;
  }

  if (typeof imgPath !== "string") return placeholder;

  // 3. Extract just the pure filename (e.g., "uploads/images/file.png" -> "file.png")
  const filename = imgPath.split("/").pop();
  
  // 4. Construct the precise Option B format that successfully loaded
  return `${API_BASE}/images/${filename}`;
};