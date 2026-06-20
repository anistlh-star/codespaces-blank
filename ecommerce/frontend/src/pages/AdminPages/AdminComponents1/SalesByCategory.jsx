//ecommerce/frontend/src/pages/AdminPages/AdminComponents1/SalesByCategory.jsx
import { useEffect, useState, Suspense, lazy } from "react";
import API from "../../../../api";
const DonutPieChart = lazy(() => import("../../../components/PieChart"));

const SalesByCategory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/salesbycategory")
      .then((res) => {
        const chartData = (res.data.stats || res.data).map((item) => ({
          label: item.category || "Other",
          value: Number(item.totalSold || 0),
        }));
        setData(chartData.sort((a, b) => b.value - a.value));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-chart-card">
      <h3 className="admin-chart-title">Sales by Category</h3>
      <Suspense fallback={<div className="admin-chart-skeleton" />}>
        {loading ? (
          <div className="admin-chart-skeleton" />
        ) : (
          <DonutPieChart data={data} />
        )}
      </Suspense>
    </div>
  );
};

export default SalesByCategory;
