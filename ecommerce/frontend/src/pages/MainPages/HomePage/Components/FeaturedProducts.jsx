//ecommerce/frontend/src/pages/MainPages/HomePage/Components/FeaturedProducts.jsx
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { getImageSrc } from "../../../../components/imageHandler";
import { useProducts } from "../../../../hooks/useProducts";
import ProductImageSlider from "../../../../components/ProductImageSlider";

const FeaturedProducts = () => {
  const { featuredProducts } = useProducts();

  const formatPrice = (price) => (price ? `$${Number(price).toFixed(2)}` : "$0.00");

  return (
    <section className="ecom-home-featured-section">
      <div className="ecom-home-section-container">
        <h2 className="ecom-home-section-title">Featured Products</h2>

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4200, disableOnInteraction: false, pauseOnMouseEnter: true }}
          loop={true}
          spaceBetween={20}    
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
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
                <div className="ecom-home-product-card">
                  <div className="ecom-home-product-image-wrapper">
                       <ProductImageSlider
                    images={product.images}
                    productName={product.name}
                    discount={product.discount} // if you have discount field
                    showThumbnails={false} // ← hides thumbnails in product list
                  />
                    {discount > 0 && (
                      <span className="ecom-home-product-badge">-{discount}%</span>
                    )}
                  </div>
                  <div className="ecom-home-product-info">
                    <h3 className="ecom-home-product-name">
                      <Link to={`/product/${product._id}`}>{product.name}</Link>
                    </h3>
                    <div className="ecom-home-product-price-row">
                      <span className="ecom-home-product-price">
                        {formatPrice(product.salePrice || product.price)}
                      </span>
                      {hasDiscount && (
                        <span className="ecom-home-product-old-price">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>
                    <Link to={`/product/${product._id}`} className="ecom-home-product-view-btn">
                      View Details
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="ecom-home-section-footer">
          <Link to="/shop" className="ecom-home-view-all-btn">View All Featured</Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;