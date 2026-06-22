// ecommerce/frontend/src/pages/MainPages/HomePage/Components/FeaturedProducts.jsx
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { useProducts } from "../../../../hooks/useProducts";
import ProductImageSlider from "../../../../components/ProductImageSlider";

const FeaturedProducts = () => {
  const { featuredProducts } = useProducts();

  const formatPrice = (price) => (price ? `$${Number(price).toFixed(2)}` : "$0.00");

  return (
    <section className="ecom-home-featured-section">
      <div className="ecom-home-section-container">
        <div className="ecom-home-section-header">
          <h2 className="ecom-home-section-title">Featured Products</h2>
          <p className="ecom-home-section-subtitle">Handpicked technical engineering masterworks.</p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          loop={true}
          spaceBetween={24}    
          slidesPerView={1}
          pagination={{ clickable: true, el: '.featured-custom-pagination' }}
          breakpoints={{
            480:  { slidesPerView: 2, spaceBetween: 16 },
            768:  { slidesPerView: 2, spaceBetween: 24 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 4, spaceBetween: 24 },
          }}
          className="ecom-home-featured-swiper"
        >
          {featuredProducts.map((product) => {
            const hasDiscount = product.salePrice && product.price > product.salePrice;
            const discount = hasDiscount
              ? Math.round(((product.price - product.salePrice) / product.price) * 100)
              : 0;

            return (
              <SwiperSlide key={product._id}>
                <article className="ecom-home-product-card">
                  <div className="ecom-home-product-image-container">
                    <ProductImageSlider
                      images={product.images}
                      productName={product.name}
                      discount={product.discount}
                      showThumbnails={false}
                    />
                    {discount > 0 && (
                      <span className="ecom-home-product-badge-tag">-{discount}%</span>
                    )}
                  </div>
                  <div className="ecom-home-product-details">
                    <span className="ecom-home-product-brand-label">{product.brand || "Premium Spec"}</span>
                    <h3 className="ecom-home-product-heading">
                      <Link to={`/product/${product._id}`}>{product.name}</Link>
                    </h3>
                    <div className="ecom-home-product-pricing-wrapper">
                      <span className="ecom-home-product-current-price">
                        {formatPrice(product.salePrice || product.price)}
                      </span>
                      {hasDiscount && (
                        <span className="ecom-home-product-slashed-price">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                    <Link to={`/product/${product._id}`} className="ecom-home-product-action-link">
                      View Details
                    </Link>
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="featured-custom-pagination swiper-pagination-custom" />

        <div className="ecom-home-section-footer">
          <Link to="/shop" className="ecom-home-secondary-btn">
            View All Featured
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;