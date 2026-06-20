// ecommerce/frontend/src/components/ProductImageSlider.jsx
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, FreeMode } from "swiper/modules";
import "./ProductImageSlider.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

import { imageHelper } from "../utilis/imageHelper";

const ProductImageSlider = ({
  images = [],
  productName = "",
  discount = 0,
  showThumbnails = true, // new prop – hide thumbnails in product lists
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // Normalize images
  const validImages =
    Array.isArray(images) && images.length > 0
      ? images
      : ["/images/placeholder-product.jpg"];

  const hasMultipleImages = validImages.length > 1;

  return (
    <div className="product-image-slider">
      {/* Main image + badge */}
      <div className="slider-main-wrapper">
        {discount > 0 && (
          <span className="discount-badge">-{Math.round(discount)}%</span>
        )}

        <Swiper
          modules={[Navigation, Pagination, Thumbs]}
          navigation={hasMultipleImages}
          pagination={
            hasMultipleImages
              ? { clickable: true, dynamicBullets: true }
              : false
          }
          thumbs={{
            swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          spaceBetween={0}
          slidesPerView={1}
          loop={hasMultipleImages}
          className="main-swiper"
        >
          {validImages.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={imageHelper(img)}
                alt={`${productName || "Product"} — image ${idx + 1}`}
                className="main-product-image"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.target.src = "https://placehold.co/800x800?text=Image+Not+Found";
                  e.target.onerror = null;
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnails — only when enabled and multiple images exist */}
      {showThumbnails && hasMultipleImages && (
        <Swiper
          onSwiper={setThumbsSwiper}
          modules={[Thumbs, FreeMode]}
          watchSlidesProgress
          slidesPerView={4.5}
          spaceBetween={10}
          freeMode
          watchOverflow
          breakpoints={{
            320: { slidesPerView: 3.8, spaceBetween: 8 },
            480: { slidesPerView: 4.5, spaceBetween: 10 },
            768: { slidesPerView: 5, spaceBetween: 12 },
          }}
          className="thumbs-swiper"
        >
          {validImages.map((img, idx) => (
            <SwiperSlide key={idx} className="thumb-slide">
              <img
                src={imageHelper(img)}
                alt={`${productName || "Product"} thumbnail ${idx + 1}`}
                loading="lazy"
                decoding="async"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ProductImageSlider;
