// ecommerce/frontend/src/pages/MainPages/HomePage/Components/PopularCategories.jsx
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useCategories } from "../../../../hooks/useCategories";

import {
  FaMobileAlt,
  FaGamepad,
  FaHeadphones,
  FaPlaystation,
  FaPhone,
  FaClock,
  FaTag,
} from "react-icons/fa";

import "swiper/css";
import "swiper/css/pagination";

const categoryIconMap = {
  "Mobile Accessories": FaMobileAlt,
  "Video Games":        FaGamepad,
  "Headphones":         FaHeadphones,
  "Consoles":           FaPlaystation,
  "Smartphones":        FaPhone,
  "Watches":            FaClock,
};

const PopularCategories = () => {
  const { categories } = useCategories();

  return (
    <section className="ecom-home-categories-section">
      <div className="ecom-home-section-container">
        <div className="ecom-home-section-header">
          <h2 className="ecom-home-section-title" style={{color : 'white'}}>Popular Categories</h2>
          <p className="ecom-home-section-subtitle">Navigate through precision hardware classifications.</p>
        </div>

        <Swiper
          modules={[Pagination]}
          spaceBetween={16}
          slidesPerView={2}
          pagination={{ clickable: true, el: '.categories-custom-pagination' }}
          loop={true}
          breakpoints={{
            480:  { slidesPerView: 3, spaceBetween: 16 },
            768:  { slidesPerView: 4, spaceBetween: 24 },
            1024: { slidesPerView: 5, spaceBetween: 24 },
            1280: { slidesPerView: 6, spaceBetween: 32 },
          }}
          className="ecom-home-categories-slider"
        >
          {categories.map((cat) => {
            const IconComponent = categoryIconMap[cat.name] || FaTag;
            return (
              <SwiperSlide key={cat._id}>
                <Link to={`/category/${cat._id}`} className="ecom-home-category-card">
                  <div className="category-icon-wrapper">
                    <IconComponent className="category-icon" />
                  </div>
                  <h3 className="ecom-home-category-name">{cat.name}</h3>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="categories-custom-pagination swiper-pagination-custom" />

        <div className="ecom-home-section-footer">
          <Link to="/shop" className="ecom-home-secondary-btn" style={{color : 'white'}}>
            Browse All Categories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;