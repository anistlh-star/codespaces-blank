//ecommerce/frontend/src/pages/AdminPages/UserComponents/UserPage.jsx
import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAuth } from "../../../../context/AuthContext";

const UserPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [roleLoadingId, setRoleLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();
  const { user } = useAuth();
  const currentUserId = user?._id || localStorage.getItem("userId");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users/all");
        setAllUsers(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUser = useMemo(() => {
    if (!searchTerm.trim()) return allUsers;

    const lowerSearch = searchTerm.toLowerCase();
    return allUsers.filter((user) => {
      const idMatch = user._id?.toLowerCase().includes(lowerSearch);
      const nameMatch = user.name?.toLowerCase().includes(lowerSearch);
      const emailMatch = user.email?.toLowerCase().includes(lowerSearch);
      const roleMatch = user.role?.toLowerCase().includes(lowerSearch);
      return idMatch || nameMatch || emailMatch || roleMatch;
    });
  }, [allUsers, searchTerm]);

  const paginatedUser = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredUser.slice(start, start + rowsPerPage);
  }, [filteredUser, page, rowsPerPage]);

  const handleChangePage = (_event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "secondary";
      case "user":
        return "primary";
      case "customer":
        return "success";
      case "guest":
        return "default";
      default:
        return "default";
    }
  };

  const handleStatusChange = async (id, newRole) => {
    setRoleLoadingId(id);
    try {
      const res = await API.put(`/admin/users/${id}/role`, {
        role: newRole,
      });

      if (res.data.success) {
        setAllUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, role: newRole } : user,
          ),
        );
        setSnackbar({
          open: true,
          message: "User role updated.",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to update user role.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      setSnackbar({
        open: true,
        message: "Error updating user role.",
        severity: "error",
      });
    } finally {
      setRoleLoadingId(null);
    }
  };

  const handleDeleteUser = async (id) => {
    setDeleteLoadingId(id);
    try {
      const res = await API.delete(`/admin/users/${id}`);
      if (res.data.success) {
        setAllUsers((prev) => prev.filter((user) => user._id !== id));
        setSnackbar({
          open: true,
          message: "User deleted successfully.",
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: "Failed to delete user.",
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      setSnackbar({
        open: true,
        message: "Error deleting user.",
        severity: "error",
      });
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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
        User ({filteredUser.length})
      </Typography>

      <Box
        sx={{
          mb: 3,
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          sx={{ maxWidth: 400 }}
          fullWidth
          label="Search user..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          placeholder="Search by ID, name, email, role..."
        />
        <Button
          variant="contained"
          onClick={() => navigate("/admin/users/usermanagement")}
        >
          Manage Users
        </Button>
      </Box>

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>
                  <strong>Date Joined</strong>
                </TableCell>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Address</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Phone</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Role</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Edit Role</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>See Profile</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedUser.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString("en-PK", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "—"}
                  </TableCell>

                  <TableCell>{user.name || "—"}</TableCell>
                  <TableCell>{user.email || "—"}</TableCell>
                  <TableCell>{user?.address || ""}</TableCell>
                  <TableCell align="center">{user?.phone || "—"}</TableCell>

                  <TableCell>
                    <Chip
                      label={user.role || "Unknown"}
                      color={getRoleColor(user.role)}
                      size="small"
                      sx={{ minWidth: 90, fontWeight: 500 }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <select
                      value={user.role || "guest"}
                      onChange={(e) =>
                        handleStatusChange(user._id, e.target.value)
                      }
                      disabled={roleLoadingId === user._id}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        marginRight: "8px",
                        minWidth: 110,
                      }}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                      <option value="customer">Customer</option>
                      <option value="guest">Guest</option>
                    </select>
                    {currentUserId !== user._id && (
                      <IconButton
                        onClick={() => {
                          if (window.confirm("Delete user?")) {
                            handleDeleteUser(user._id);
                          }
                        }}
                        disabled={deleteLoadingId === user._id}
                        size="small"
                        sx={{ color: "black" }}
                      >
                        {deleteLoadingId === user._id ? (
                          <CircularProgress size={18} />
                        ) : (
                          <MdDelete />
                        )}
                      </IconButton>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      component={Link}
                      to={`/admin/users/${user._id}`}
                      variant="outlined"
                      size="small"
                    >
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredUser.length}
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserPage;
