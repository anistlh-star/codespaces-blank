// ecommerce/frontend/src/pages/MainPages/HomePage/Components/CtaBanner.jsx
import { Link } from "react-router-dom";

const CtaBanner = () => {
  return (
    <section className="ecom-home-cta-section">
      <div className="ecom-home-cta-inner">
        <h2 className="ecom-home-cta-title">Ready for the Next Level?</h2>
        <p className="ecom-home-cta-text">
          Upgrade your daily workspace with professional instruments built for computational elite performance.
        </p>
        <Link to="/shop" className="ecom-home-cta-button">
          Shop the Full Collection
        </Link>
      </div>
    </section>
  );
};

export default CtaBanner;