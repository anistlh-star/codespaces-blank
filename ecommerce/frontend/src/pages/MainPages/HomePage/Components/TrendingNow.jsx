// ecommerce/frontend/src/pages/MainPages/HomePage/Components/TrendingNow.jsx
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useProducts } from "../../../../hooks/useProducts";
import ProductImageSlider from "../../../../components/ProductImageSlider";

const TrendingNow = () => {
  const { trendingProducts } = useProducts();

  const formatPrice = (price) =>
    price ? `$${Number(price).toFixed(2)}` : "$0.00";

  return (
    <section className="ecom-home-trending-section">
      <div className="ecom-home-section-container">
        <div className="ecom-home-section-header">
          <h2 className="ecom-home-section-title">Trending Now</h2>
          <p className="ecom-home-section-subtitle">Highly sought-after items with rapid ecosystem adoption.</p>
        </div>

        <Swiper
          modules={[Pagination]}
          loop={true}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{ clickable: true, el: '.trending-custom-pagination' }}
          breakpoints={{
            480:  { slidesPerView: 2, spaceBetween: 16 },
            768:  { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="ecom-home-trending-swiper"
        >
          {trendingProducts.map((product) => (
            <SwiperSlide key={product._id}>
              <article className="ecom-home-product-card">
                <div className="ecom-home-product-image-container">
                  <ProductImageSlider
                    images={product.images}
                    productName={product.name}
                    discount={product.discount}
                    showThumbnails={false}
                  />
                </div>
                <div className="ecom-home-product-details">
                  <span className="ecom-home-product-brand-label">{product.brand || "In Demand"}</span>
                  <h3 className="ecom-home-product-heading">
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                  </h3>
                  <div className="ecom-home-product-pricing-wrapper">
                    <span className="ecom-home-product-current-price">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <Link to={`/product/${product._id}`} className="ecom-home-product-action-link">
                    View Details
                  </Link>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="trending-custom-pagination swiper-pagination-custom" />

        <div className="ecom-home-section-footer">
          <Link to="/shop" className="ecom-home-secondary-btn">
            See All Trending
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingNow;