import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./HeroBanner.css";

const HeroBanner = ({
  badge,
  title ,
  highlightText,
  subtitle ,
  backgroundImage,
  ctaText = "Get Started",
  ctaLink = "/products",
  secondaryCtaText,
  secondaryCtaLink,
}) => {
  // Gracefully handles inline background images dynamically per page layout
  const bannerStyle = backgroundImage 
    ? { backgroundImage: `url(${backgroundImage})` } 
    : {};

  return (
    <div className="reusable-hero-banner" style={bannerStyle}>
      {/* High-contrast gradient mask shield */}
      <div className="hero-banner-overlay"></div>
      
      <div className="hero-banner-content">
        {/* Dynamic Badge Component */}
        {badge && <span className="hero-banner-tagline">{badge}</span>}
        
        {/* Dynamic Typography Header System */}
        <h1 className="hero-banner-title">
          {title}{" "}
          {highlightText && (
            <span className="hero-banner-highlight">{highlightText}</span>
          )}
        </h1>
        
        {/* Dynamic Context Subtitle */}
        {/* {subtitle && <p className="hero-banner-subtitle">{subtitle}</p>} */}
        
        {/* Polymorphic Action Triggers */}
        <div className="hero-banner-actions">
          {/* {ctaText && ctaLink && (
            <Link to={ctaLink} className="hero-banner-cta-primary">
              {ctaText} 
              <ArrowRight size={16} className="hero-cta-icon" />
            </Link>
          )} */}
          
          {secondaryCtaText && secondaryCtaLink && (
            <Link to={secondaryCtaLink} className="hero-banner-cta-secondary">
              {secondaryCtaText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;