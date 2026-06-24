import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import bannerImage from "../../../../assets/images/1000_F_364410756_Ev3WoDfNyxO9c9n4tYIsU5YBQWAP3UF8.jpg";

const HeroBanner = () => {
  // Safe mapping of imported local asset directly into inline style rules
  const bannerStyle = bannerImage ? { backgroundImage: `url(${bannerImage})` } : {};

  return (
    <div className="ecom-home-hero" style={bannerStyle}>
      {/* Premium dark gradient overlay to ensure accessible text contrast over arbitrary graphic assets */}
      <div className="ecom-home-hero-overlay"></div>
      
      <div className="ecom-home-hero-content">
        {/* Premium Tagline */}
        <span className="ecom-home-hero-tagline">New Launch</span>
        
        {/* Title with custom interactive underline effect */}
        <h1 className="ecom-home-hero-title">
          Elevate Your <span className="ecom-home-highlight">Commercial Reach</span>
        </h1>
        
        {/* Subtitle description */}
        <p className="ecom-home-hero-subtitle">
          Manage inventory, break down processing logistics, and track user growth parameters from a singular desktop panel context.
        </p>
        
        {/* Interactive routing actions */}
        <div className="ecom-home-hero-actions">
          <Link to="/shop" className="ecom-home-cta-primary">
            Get Started 
            <ArrowRight size={16} className="cta-icon" />
          </Link>
          <Link to="/shop" className="ecom-home-secondary-btn hero-btn-secondary">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;