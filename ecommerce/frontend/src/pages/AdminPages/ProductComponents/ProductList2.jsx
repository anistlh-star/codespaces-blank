//ecommerce/frontend/src/pages/AdminPages/ProductComponents/ProductList2.jsx
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TablePagination, Rating as MuiRating } from "@mui/material";
import "./ProductList.css";
import API from "../../../../api/index.js";

const columns = [
  {
    field: "image",
    headerName: "Image",
    width: 90,
    sortable: false,
    renderCell: (params) => (
      <img
        src={params.value}
        alt="product"
        style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
      />
    ),
  },
  { field: "name", headerName: "Name", flex: 1 },
  {
    field: "price",
    headerName: "Price",
    width: 120,
    renderCell: (params) => {
      const { price, salePrice, onSale } = params.row;
      return (
        <div style={{ textAlign: "right" }}>
          {onSale ? (
            <>
              <span style={{ textDecoration: "line-through", color: "#888", fontSize: "0.85rem" }}>
                ${price.toFixed(2)}
              </span>
              <br />
              <strong style={{ color: "#d32f2f" }}>${salePrice.toFixed(2)}</strong>
            </>
          ) : (
            <strong>${price.toFixed(2)}</strong>
          )}
        </div>
      );
    },
  },
  {
    field: "rating",
    headerName: "Rating",
    width: 140,
    renderCell: (params) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <MuiRating value={params.value} precision={0.5} readOnly size="small" />
        <span style={{ fontSize: "0.875rem" }}>({params.row.reviews})</span>
      </div>
    ),
  },
  {
    field: "stock",
    headerName: "Stock",
    width: 100,
    renderCell: (params) => (
      <span style={{ color: params.value < 20 ? "#d32f2f" : "#2e7d32", fontWeight: 600 }}>
        {params.value}
      </span>
    ),
  },
  {
    field: "createdAt",
    headerName: "Created",
    width: 120,
    valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
  },
];

export default function ProductGridPage() {
  const [view, setView] = useState("list");
  const [products, setProducts] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [sortModel, setSortModel] = useState([
    { field: "createdAt", sort: "desc" },
  ]);

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetchProducts();
  }, [paginationModel, sortModel]);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const sortField = sortModel[0]?.field || "createdAt";
      const sortOrder = sortModel[0]?.sort || "desc";

      const res = await API.get("/admin/products/all", {
        params: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
          field: sortField,
          order: sortOrder,
        },
      });

      const mappedProducts = res.data.products.map((p) => ({
        id: p._id,
        name: p.name,
        price: p.price,
        salePrice: p.salePrice || p.price,
        onSale: p.onSale || false,
        rating: p.rating || 0,
        reviews: p.reviews || 0,
        stock: p.stock || 0,
        createdAt: p.createdAt,
        image:
          p.images?.[0] ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIoTqFvPu3IOd_DzmzYwpB_GmNYcbcd02WsQ&s",
      }));

      setProducts(mappedProducts);
      setRowCount(res.data.totalProducts);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  const PaginationControls = () => (
    <TablePagination
      component="div"
      count={rowCount}
      page={paginationModel.page}
      onPageChange={(_, newPage) =>
        setPaginationModel({ ...paginationModel, page: newPage })
      }
      rowsPerPage={paginationModel.pageSize}
      onRowsPerPageChange={(e) =>
        setPaginationModel({
          page: 0,
          pageSize: parseInt(e.target.value, 10),
        })
      }
      rowsPerPageOptions={[5, 10, 25]}
      sx={{ mt: 3 }}
    />
  );

  return (
    <main className="product-grid-page">
      <header className="product-grid-page__header">
        <h2>Products</h2>

        <div className="product-grid-page__view-toggle">
          <button
            className={view === "list" ? "active" : ""}
            onClick={() => setView("list")}
          >
            List
          </button>
          <button
            className={view === "grid" ? "active" : ""}
            onClick={() => setView("grid")}
          >
            Grid
          </button>
        </div>
      </header>

      {/* LIST VIEW */}
      {view === "list" && (
        <div className="product-grid-page__table">
          <DataGrid
            rows={products}
            columns={columns}
            loading={loading}
            rowCount={rowCount}
            paginationMode="server"
            sortingMode="server"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            sx={{ border: "none" }}
          />
        </div>
      )}

      {/* GRID VIEW */}
      {view === "grid" && (
        <>
          <div className="product-grid-page__cards">
            {loading ? (
              <div className="loading-message">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="empty-message">No products found.</div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="product-grid-page__card">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-grid-page__card-image"
                    loading="lazy"
                  />
                  <h3>{product.name}</h3>

                  {/* Price with sale handling */}
                  <div className="price-container" style={{ margin: "0.5rem 0" }}>
                    {product.onSale ? (
                      <>
                        <span style={{ textDecoration: "line-through", color: "#888", fontSize: "0.9rem" }}>
                          ${product.price.toFixed(2)}
                        </span>
                        <span style={{ color: "#d32f2f", fontWeight: 600, marginLeft: "0.5rem" }}>
                          ${product.salePrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span style={{ fontWeight: 600 }}>
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Rating & Reviews */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.5rem" }}>
                    <MuiRating value={product.rating} precision={0.5} readOnly size="small" />
                    <span style={{ fontSize: "0.875rem", color: "#555" }}>
                      ({product.reviews} reviews)
                    </span>
                  </div>

                  {/* Stock */}
                  <span
                    className="stock"
                    style={{
                      fontSize: "0.875rem",
                      color: product.stock < 20 ? "#d32f2f" : "#2e7d32",
                      fontWeight: 600,
                    }}
                  >
                    Stock: {product.stock}
                  </span>

                  <span className="date">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>

          <PaginationControls />
        </>
      )}
    </main>
  );
}