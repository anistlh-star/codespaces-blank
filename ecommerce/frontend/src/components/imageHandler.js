//ecommerce/frontend/src/components/imageHandler.js
export const API_BASE = import.meta.env.VITE_API_URL || "";
export const placeholder =
  "https://png.pngtree.com/png-vector/20210604/ourmid/pngtree-gray-network-placeholder-png-image_3416659.jpg";
export const getImageSrc = (imgInput) => {
  if (!imgInput) return placeholder;

  let imgPath = imgInput;

  // If it's an array, take first element
  if (Array.isArray(imgInput) && imgInput.length > 0) {
    imgPath = imgInput[0];
  }

  const isExternal =
    imgPath.startsWith("http://") || imgPath.startsWith("https://");
  if (isExternal) return imgPath;

  const cleanFilename = imgPath
    .replace(/^\/?uploads\/images\//i, "")
    .replace(/^\/?images\//i, "");

  return `${API_BASE}/images/${cleanFilename}`;
};
