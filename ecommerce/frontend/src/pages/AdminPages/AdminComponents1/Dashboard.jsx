//ecommerce/frontend/src/pages/AdminPages/AdminComponents1/Dashboard.jsx
import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import API from "../../../../api";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/stats")
      .then((res) => setStats(res.data.data || res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="admin-skeleton" style={{ height: "420px" }}>
        <ProgressSpinner />
      </div>
    );

  const cards = [
    { title: "Total Users", value: stats.totalUsers || 0, icon: "pi pi-users" },
    {
      title: "Total Orders",
      value: stats.totalOrders || 0,
      icon: "pi pi-shopping-cart",
    },
    {
      title: "Revenue",
      value: `$${stats.totalRevenue?.toFixed(2) || 0}`,
      icon: "pi pi-dollar",
    },
    {
      title: "Pending",
      value: stats.pendingOrders || 0,
      icon: "pi pi-hourglass",
    },
  ];

  return (
    <div className="admin-stat-grid">
      {cards.map((c, i) => (
        <Card key={i} className="admin-stat-card">
          <i className={`${c.icon} admin-stat-icon`} />
          <div>
            <h3>{c.value}</h3>
            <p>{c.title}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Dashboard;
