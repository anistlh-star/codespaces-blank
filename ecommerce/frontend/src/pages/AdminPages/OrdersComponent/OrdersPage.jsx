//ecommerce/frontend/src/pages/AdminPages/OrdersComponent/OrdersPage.jsx
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import API from "../../../../api";
import { MdDelete } from "react-icons/md";
// MUI imports
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination & search state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/admin/orders/all");
        setOrders(res.data.orders || res.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders based on search term
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;

    const lowerSearch = searchTerm.toLowerCase();
    return orders.filter((order) => {
      const idMatch = order._id.toLowerCase().includes(lowerSearch);
      const statusMatch = order.status?.toLowerCase().includes(lowerSearch);
      const amountMatch = String(order.totalAmount || "").includes(lowerSearch);
      const paymentMatch = order.paymentMethod
        ?.toLowerCase()
        .includes(lowerSearch);
      return idMatch || statusMatch || amountMatch || paymentMatch;
    });
  }, [orders, searchTerm]);

  // Pagination slice
  const paginatedOrders = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredOrders.slice(start, start + rowsPerPage);
  }, [filteredOrders, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await API.put(`/admin/orders/${id}/status`, {
        status: newStatus.toLowerCase(),
      });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, status: newStatus } : order,
          ),
        );
      } else {
        alert("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "warning";
      case "processing":
        return "info";
      case "shipped":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };
  const handleDeleteOrder = async (id) => {
    try {
      // Assuming there's an API endpoint to delete an order
      const res = await API.delete(`/admin/orders/${id}`);
      if (res.data.success) {
        setOrders((prev) => prev.filter((order) => order._id !== id));
        alert("Order deleted successfully");
      } else {
        alert("Failed to delete order");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" variant="h6" mt={4}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Orders ({filteredOrders.length})
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 3, maxWidth: 400 }}>
        <TextField
          fullWidth
          label="Search orders..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0); // reset to first page on search
          }}
          placeholder="Search by ID, status, amount..."
        />
      </Box>

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>
                  <strong>Order ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Date</strong>
                </TableCell>
                <TableCell>
                  <strong>Customer</strong>
                </TableCell>
                <TableCell>
                  <strong>Address</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Items</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Total</strong>
                </TableCell>
                <TableCell>
                  <strong>Payment</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order._id} hover>
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace">
                      <Link to={`/admin/orders/details/${order._id}`}>
                        {" "}
                        #{order._id.slice(-8)}
                      </Link>
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleString("en-PK", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "—"}
                  </TableCell>

                  <TableCell>
                    {order.user?.name ||
                      order.user?.email ||
                      order.user?.slice(-8) ||
                      "—"}
                  </TableCell>
                  <TableCell>
                    {`${order.shippingAddress?.street || ""}, ${
                      order.shippingAddress?.city || ""
                    }, ${order.shippingAddress?.state || ""}, ${
                      order.shippingAddress?.country || ""
                    } - ${order.shippingAddress?.zipCode || ""}`}
                  </TableCell>
                  <TableCell align="center">
                    {order.items?.length || 0}
                  </TableCell>

                  <TableCell align="right">
                    <strong>
                      Rs. {(order.totalAmount || 0).toLocaleString("en-PK")}
                    </strong>
                  </TableCell>

                  <TableCell>{order.paymentMethod || "—"}</TableCell>

                  <TableCell>
                    <Chip
                      label={order.status || "Unknown"}
                      color={getStatusColor(order.status)}
                      size="small"
                      sx={{ minWidth: 90, fontWeight: 500 }}
                    />
                  </TableCell>
                  {/* making vertical ellipsis icon menu drop down in mui which shows the option when clicked on dropdown Completed Processing On Hold Pending Delete */}

                  <TableCell align="center">
                    <select
                      value={order.status || "pending"}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        marginRight: "8px",
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="on hold">On Hold</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => {
                        if (window.confirm("Delete order?"))
                          handleDeleteOrder(order._id);
                      }}
                      style={{
                        background: "#ffffff",
                        color: "black",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <MdDelete />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Rows per page:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
          }
        />
      </Paper>
    </Box>
  );
};

export default OrdersPage;
