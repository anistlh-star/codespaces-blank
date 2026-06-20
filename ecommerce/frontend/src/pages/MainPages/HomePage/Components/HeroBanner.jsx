//ecommerce/frontend/src/pages/MainPages/HomePage/Components/HeroBanner.jsx
import { Link } from "react-router-dom";

const HeroBanner = () => {
  return (
    <section className="ecom-home-hero">
      <div className="ecom-home-hero-content">
        <h1 className="ecom-home-hero-title">
          Premium Tech, <span className="ecom-home-highlight">Reimagined</span>
        </h1>
        <p className="ecom-home-hero-subtitle">
          Curated collection of the finest gadgets and accessories.
        </p>
        <div className="ecom-home-hero-actions">
          <Link to="/shop" className="ecom-home-cta ecom-home-cta-primary">
            Shop Now
          </Link>
        
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;