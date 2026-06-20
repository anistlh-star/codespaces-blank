// ecommerce/frontend/src/pages/AdminPages/AdminComponents1/PopularProducts.jsx
import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Tooltip } from "primereact/tooltip"; // Added for better UX on long names
import API from "../../../../api";
import './PopularProducts.css'
// Updated component with modern styling:
// - Added hover effects and transitions for rows
// - Improved image rendering with rounded corners and shadow
// - Enhanced category tags with custom colors
// - Made table more responsive with scroll on mobile
// - Added tooltip for long product names
// - Updated empty message with icon for better visual feedback
// - Assume CSS updates: Add .popular-products-table { ... } for custom overrides

export default function PopularProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/products/popular")
      .then((res) => setProducts(res.data.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const imageTemplate = (row) => (
    <div className="popular-product-image-wrapper">
      <img
        src={row.image || "https://via.placeholder.com/64"} // Use first image if array
        alt={row.name}
        className="popular-product-image"
      />
    </div>
  );

  const nameTemplate = (row) => (
    <div className="popular-product-name" data-pr-tooltip={row.name}>
      {row.name.length > 30 ? `${row.name.substring(0, 27)}...` : row.name}
    </div>
  );

  const categoryTemplate = (row) => (
    <Tag
      value={row.categoryName || "Uncategorized"}
      severity={getCategorySeverity(row.categoryName)}
      rounded
      className="popular-category-tag"
    />
  );

  // Helper for dynamic tag colors
  const getCategorySeverity = (category) => {
    const severities = ["success", "info", "warning", "danger", "secondary"];
    return severities[(category?.length || 0) % severities.length] || "info";
  };

  const priceTemplate = (row) => (
    <span className="popular-product-price">${row.price?.toFixed(2) || "0.00"}</span>
  );

  const emptyMessage = () => (
    <div className="popular-empty-message">
      <i className="pi pi-info-circle" style={{ fontSize: "1.5rem", marginRight: "0.5rem" }} />
      No popular products yet
    </div>
  );

  return (
    <div className="popular-products-card"> {/* Updated wrapper class for shadow/border */}
      <h3 className="popular-products-title">Top Popular Products</h3>
      <Tooltip target=".popular-product-name" position="top" /> {/* Enable tooltips */}
      <DataTable
        value={products}
        loading={loading}
        rows={8}
        paginator
        paginatorTemplate="PrevPageLink PageLinks NextPageLink RowsPerPageDropdown CurrentPageReport"
        rowsPerPageOptions={[5, 8, 10, 20]}
        currentPageReportTemplate="{first} to {last} of {totalRecords}"
        emptyMessage={emptyMessage}
        className="popular-products-table"
        rowHover // Enable row hover for better interaction
        responsiveLayout="scroll" // Improved mobile responsiveness
      >
        <Column header="Image" body={imageTemplate} style={{ width: "80px", textAlign: "center" }} />
        <Column field="name" header="Product" body={nameTemplate} sortable style={{ minWidth: "200px" }} />
        <Column field="categoryName" header="Category" body={categoryTemplate} sortable style={{ width: "150px" }} />
        <Column field="totalSold" header="Sold" sortable align="right" style={{ width: "100px" }} />
        <Column field="price" header="Price" body={priceTemplate} sortable align="right" style={{ width: "120px" }} />
      </DataTable>
    </div>
  );
}