// ecommerce/frontend/src/pages/MainPages/HomePage/Components/PopularCategories.jsx
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import {  Pagination } from "swiper/modules";
import { useCategories } from "../../../../hooks/useCategories";

// Import icons from react-icons
import {
  FaMobileAlt,
  FaGamepad,
  FaHeadphones,
  FaPlaystation,
  FaPhone,
  FaClock,
  FaTag,
} from "react-icons/fa";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./PopularCategories.css";

// Map category names to icons and gradient colors
const categoryIconMap = {
  "Mobile Accessories": { icon: FaMobileAlt},
  "Video Games":        { icon: FaGamepad },
  "Headphones":         { icon: FaHeadphones},
  "Consoles":           { icon: FaPlaystation },
  "Smartphones":        { icon: FaPhone },
  "Watches":            { icon: FaClock },
};

// Default icon & color for any other category
// const defaultIcon = { icon: FaTag, color: "linear-gradient(135deg, #757f9a 0%, #d7dde8 100%)" };

const PopularCategories = () => {
  const { categories } = useCategories();
  const getCategoryStyle = (catName) => {
    return categoryIconMap[catName] || defaultIcon;
  };

  return (
    <section className="ecom-home-categories-section">
      <div className="ecom-home-section-container">
        <h2 className="ecom-home-section-title">Popular Categories</h2>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Pagination]}
          spaceBetween={20}
          slidesPerView={2}
          
          pagination={{ clickable: true }}
          // autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 25 },
            1024: { slidesPerView: 5, spaceBetween: 30 },
          }}
          className="ecom-home-categories-slider"
        >
          {categories.map((cat) => {
            const { icon: IconComponent, color } = getCategoryStyle(cat.name);
            return (
              <SwiperSlide key={cat._id}>
                <Link to={`/category/${cat._id}`} className="ecom-home-category-card">
                  <div className="category-icon-wrapper" style={{ background: color }}>
                    <IconComponent className="category-icon" />
                  </div>
                  <div className="ecom-home-category-overlay">
                    <h3 className="ecom-home-category-name">{cat.name}</h3>
                  
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>

        <div className="ecom-home-section-footer">
          <Link to="/shop" className="ecom-home-view-all-btn">
            Browse All Categories
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;