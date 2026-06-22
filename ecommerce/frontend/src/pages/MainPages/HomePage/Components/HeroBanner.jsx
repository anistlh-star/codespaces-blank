// ecommerce/frontend/src/pages/MainPages/HomePage/Components/HeroBanner.jsx
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const HeroBanner = () => {
  return (
    <section className="ecom-home-hero">
      <div className="ecom-home-hero-content">
        <span className="ecom-home-hero-tagline">New Generation Tech</span>
        <h1 className="ecom-home-hero-title">
          Premium Tech, <span className="ecom-home-highlight">Reimagined</span>
        </h1>
        <p className="ecom-home-hero-subtitle">
          A deeply curated collection of the finest performance hardware and minimalist accessories.
        </p>
        <div className="ecom-home-hero-actions">
          <Link to="/shop" className="ecom-home-cta-primary">
            Explore Collection <ArrowRight size={16} />
          </Link>
          <p>{''}</p>
          <Link to="/newarrivals" className="ecom-home-cta-primary">
            New Arrivals <ArrowRight size={16} />
          </Link>

        </div>
      </div>
    </section>
  );
};

export default HeroBanner;