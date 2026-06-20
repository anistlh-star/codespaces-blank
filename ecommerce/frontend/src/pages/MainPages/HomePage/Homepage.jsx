//ecommerce/frontend/src/pages/MainPages/HomePage/Homepage.jsx
import { lazy, Suspense } from "react";
import "../../../../styles/pages/MainPages/HomePage.css";

// Lazy load heavy carousel sections for better performance
const HeroBanner = lazy(() => import("./Components/HeroBanner"));
const FeaturedProducts = lazy(() => import("./Components/FeaturedProducts"));
const PopularCategories = lazy(() => import("./Components/PopularCategories"));
const TrendingNow = lazy(() => import("./Components/TrendingNow"));
const CtaBanner = lazy(() => import("./Components/CtaBanner"));

const HomePage = () => {
  return (
    <div className="ecom-home-container">
      <Suspense fallback={<div className="ecom-home-skeleton" />}>
        <HeroBanner />
        <FeaturedProducts />
        <PopularCategories />
        <TrendingNow />
        <CtaBanner />
      </Suspense>
    </div>
  );
};

export default HomePage;