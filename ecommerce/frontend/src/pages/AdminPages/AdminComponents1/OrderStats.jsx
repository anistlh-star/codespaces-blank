//ecommerce/frontend/src/pages/AdminPages/AdminComponents1/OrderStats.jsx
import { useEffect, useState, Suspense, lazy } from "react";
import API from "../../../../api";
const DonutPieChart = lazy(() => import("../../../components/PieChart"));

const OrderStats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/stats")
      .then((res) => setStats(res.data.data || res.data))
      .finally(() => setLoading(false));
  }, []);

  const chartData = [
    { label: "Total Orders", value: stats.totalOrders || 0 },
    { label: "Pending", value: stats.pendingOrders || 0 },
    { label: "Cancelled", value: stats.cancelledOrders || 0 },
    { label: "Confirmed", value: stats.confirmedOrders || 0 },
  ];

  return (
    <div className="admin-chart-card">
      <h3 className="admin-chart-title">Order Statistics</h3>
      <Suspense fallback={<div className="admin-chart-skeleton" />}>
        {loading ? (
          <div className="admin-chart-skeleton" />
        ) : (
          <DonutPieChart data={chartData} />
        )}
      </Suspense>
    </div>
  );
};

export default OrderStats;
