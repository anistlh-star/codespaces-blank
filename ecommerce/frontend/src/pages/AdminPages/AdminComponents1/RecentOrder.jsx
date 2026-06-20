// ecommerce/frontend/src/pages/AdminPages/AdminComponents1/RecentOrders.jsx
import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip";
import API from "../../../../api";

export default function RecentOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/recent-orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to load recent orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ─── Column Templates ────────────────────────────────────────────────────────
  const dateTemplate = (row) => (
    <span className="recent-order-date">
      {row.createdAt
        ? new Date(row.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "—"}
    </span>
  );

  const statusTemplate = (row) => {
    const statusMap = {
      Delivered: { severity: "success", label: "Delivered" },
      Processing: { severity: "info", label: "Processing" },
      Shipped: { severity: "warning", label: "Shipped" },
      Cancelled: { severity: "danger", label: "Cancelled" },
      Pending: { severity: "help", label: "Pending" },
      Completed: { severity: "success", label: "Completed" },
      "On Hold": { severity: "warning", label: "On Hold" },
    };

    const { severity = "secondary", label = row.status } = statusMap[row.status] || {};
    return (
      <Tag
        value={label}
        severity={severity}
        rounded
        className={`recent-order-status recent-order-status--${severity}`}
      />
    );
  };

  const productsTemplate = (row) => {
    if (!row.items?.length) return "—";
    const names = row.items.map((item) => item.name).join(", ");
    return (
      <div className="recent-order-products" data-pr-tooltip={names}>
        {names.length > 50 ? `${names.substring(0, 47)}...` : names}
      </div>
    );
  };

  const customerTemplate = (row) => {
    const user = row.user || {};
    return (
      <div className="recent-order-customer">
        <div className="customer-name">{user.name || "—"}</div>
        <div className="customer-email">{user.email || "—"}</div>
      </div>
    );
  };

  const totalTemplate = (row) => (
    <span className="recent-order-total">
      ${row.totalAmount?.toFixed(2) || "0.00"}
    </span>
  );

  const emptyMessage = () => (
    <div className="recent-empty-message">
      <i className="pi pi-exclamation-circle" style={{ fontSize: "1.6rem", marginRight: "0.8rem", color: "#9ca3af" }} />
      No recent orders found
    </div>
  );

  return (
    <div className="recent-orders-card">
      <div className="recent-orders-header" style={{
        display : "flex",
        alignItems : "center",
        justifyContent : "space-between",
        marginBottom : "1rem"
      }}>
        <h3 className="recent-orders-title">Recent Orders</h3>
        <Button
          icon="pi pi-refresh"
          rounded
          text
          severity="secondary"
          aria-label="Refresh recent orders"
          onClick={fetchOrders}
          loading={loading}
          tooltip="Refresh Orders"
          tooltipOptions={{ position: "left" }}
          className="recent-orders-refresh-btn"
        />
      </div>

      <Tooltip target=".recent-order-products" position="top" />

      <DataTable
        value={orders}
        loading={loading}
        rows={10}
        paginator
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[5, 10, 15, 25]}
        currentPageReportTemplate="{first}–{last} of {totalRecords} orders"
        emptyMessage={emptyMessage}
        className="recent-orders-table"
        rowHover
        responsiveLayout="scroll"
        stripedRows
        globalFilter={globalFilter}
        globalFilterFields={["user.name", "user.email", "status", "paymentMethod"]}
      >
        <Column
          field="createdAt"
          header="Date"
          body={dateTemplate}
          sortable
          style={{ width: "140px" }}
        />
        <Column
          header="Products"
          body={productsTemplate}
          style={{ minWidth: "240px" }}
        />
        <Column
          header="Customer"
          body={customerTemplate}
          sortable
          field="user.name"
          style={{ minWidth: "180px" }}
        />
        <Column
          field="status"
          header="Status"
          body={statusTemplate}
          sortable
          style={{ width: "140px", textAlign: "center" }}
        />
        <Column
          field="totalAmount"
          header="Total"
          body={totalTemplate}
          sortable
          align="right"
          style={{ width: "120px" }}
        />
      </DataTable>

      {/* Search input - moved below table for better mobile layout */}
      <div className="recent-orders-search" style={{ marginTop: "1.25rem", maxWidth: "420px" }}>
        <InputText
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search by customer, status, products..."
          className="recent-search-input"
          style={{ width: "100%", padding: "0.65rem 1.1rem", border: "1px solid #d1d5db", borderRadius: "9999px", fontSize: "0.94rem", transition: "all 0.2s ease", background: "white" }}
        />
      </div>
    </div>
  );
}