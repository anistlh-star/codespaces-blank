//ecommerce/frontend/src/pages/AdminPages/DashboardPage.jsx
import { useEffect } from "react";
import Dashboard from "./AdminComponents1/Dashboard";
import PopularProducts from "./AdminComponents1/PopularProducts";
import OrderStats from "./AdminComponents1/OrderStats";
import RecentOrders from "./AdminComponents1/RecentOrder";
import SalesByCategory from "./AdminComponents1/SalesByCategory";

export default function DashboardPage() {
  // Smooth fade-in animation for each section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("admin-visible");
          }
        });
      },
      { threshold: 0.15 },
    );

    document.querySelectorAll(".admin-dashboard-section").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="admin-dashboard-page">
      {/* Header */}
      <div className="admin-dashboard-header">
        <div>
          <h1 className="admin-dashboard-title">Dashboard Overview</h1>
          <p className="admin-dashboard-subtitle">
            Here's what's happening with your store today
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="admin-dashboard-grid">
        {/* 1. Stats Overview - Full width on top */}
        <div className="admin-dashboard-section admin-dashboard-stats">
          <Dashboard />
        </div>

        {/* 2. Charts Row - Side by side on large screens */}
        <div className="admin-dashboard-section admin-dashboard-charts">
          <div className="admin-chart-col">
            <OrderStats />
          </div>
          <div className="admin-chart-col">
            <SalesByCategory />
          </div>
        </div>

        {/* 3. Tables Row - Popular Products + Recent Orders */}
        <div className="admin-dashboard-section admin-dashboard-tables">
          <div className="admin-table-col">
            <PopularProducts />
          </div>
          <div className="admin-table-col">
            <RecentOrders />
          </div>
        </div>
      </div>
    </div>
  );
}
