//ecommerce/frontend/src/layouts/MainLayout.jsx

import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
const MainLayout = () => {
  return (
    <div className="site-wrapper">
      {/* Header / Navbar here */}
      <main>
        <Outlet /> {/* All page content goes here */}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
