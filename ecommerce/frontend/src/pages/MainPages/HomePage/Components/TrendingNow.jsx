//ecommerce/frontend/src/pages/MainPages/HomePage/Components/TrendingNow.jsx
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { getImageSrc } from "../../../../components/imageHandler";
import { useProducts } from "../../../../hooks/useProducts";
import ProductImageSlider from "../../../../components/ProductImageSlider";

const TrendingNow = () => {
  const { trendingProducts } = useProducts();

  const formatPrice = (price) =>
    price ? `$${Number(price).toFixed(2)}` : "$0.00";

  return (
    <section className="ecom-home-trending-section">
      <div className="ecom-home-section-container">
        <h2 className="ecom-home-section-title">Trending Now</h2>

        <Swiper
          modules={[]}
          loop={true}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="ecom-home-trending-swiper"
        >
          {trendingProducts.map((product) => (
            <SwiperSlide key={product._id}>
              <div className="ecom-home-product-card">
                <div className="ecom-home-product-image-wrapper">
                  <ProductImageSlider
                    images={product.images}
                    productName={product.name}
                    discount={product.discount} // if you have discount field
                    showThumbnails={false} // ← hides thumbnails in product list
                  />
                </div>
                <div className="ecom-home-product-info">
                  <h3 className="ecom-home-product-name">
                    <Link to={`/product/${product._id}`}>{product.name}</Link>
                  </h3>
                  <div className="ecom-home-product-price-row">
                    <span className="ecom-home-product-price">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <button className="ecom-home-product-add-btn">
                    {" "}
                    <Link
                      to={`/product/${product._id}`}
                      className="electronics-home-product-view-btn"
                    >
                      View Details
                    </Link>
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="ecom-home-section-footer">
          <Link to="/shop" className="ecom-home-view-all-btn">
            See All Trending
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingNow;
