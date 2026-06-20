//ecommerce/frontend/src/utilis/imageHelper.js

export const imageHelper = (imagePath) => {
  // Default fallback image
  const FALLBACK =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDfSBB4Di2MBi7R34v9Qe_rN3WXGRCC223YA&s";

  // Handle all falsy values + non-string values safely
  if (!imagePath || typeof imagePath !== "string") {
    return FALLBACK;
  }

  // Already a full URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Relative path → prepend backend URL
  const BACKEND_URL =
    import.meta.env.VITE_API_URL ;

  // Make sure it starts with slash (optional but cleaner)
  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  return `${BACKEND_URL}${cleanPath}`;
};
