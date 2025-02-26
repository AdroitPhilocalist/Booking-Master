"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import {
  Table,
  TableBody,
  Grid,
  Typography,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  MenuItem,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputLabel,
  CircularProgress,
  Box,
} from "@mui/material";
import { Delete, Edit, Add as AddIcon } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { styled } from "@mui/system";

// Custom styling for the main container
const StyledContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  background: "#ffffff",
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
  },
}));

// Custom styling for the table header
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: "#f5f5f5",
  "& .MuiTableCell-root": {
    fontWeight: "bold",
    color: "#28bfdb",
    textAlign: "center",
    padding: theme.spacing(1.5),
  },
}));

// Custom styling for table rows with fallback for theme
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:hover": {
    backgroundColor: (theme && theme.palette && theme.palette.grey && theme.palette.grey[100]) || "#f5f5f5", // Fallback to a default grey color
  },
  "& .MuiTableCell-root": {
    textAlign: "center",
    padding: theme.spacing(1.5),
  },
}));

// Custom styling for the TextField (ensure TextField is imported and used correctly)
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: "8px",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: (theme && theme.palette && theme.palette.grey && theme.palette.grey[300]) || "#d9d9d9",
    },
    "&:hover fieldset": {
      borderColor: (theme && theme.palette && theme.palette.primary && theme.palette.primary.main) || "#1976d2",
    },
    "&.Mui-focused fieldset": {
      borderColor: (theme && theme.palette && theme.palette.primary && theme.palette.primary.main) || "#1976d2",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
    color: (theme && theme.palette && theme.palette.grey && theme.palette.grey[700]) || "#666",
  },
}));

// Custom styling for the Select (ensure Select is imported and used correctly)
const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-select": {
    borderRadius: "8px",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: (theme && theme.palette && theme.palette.grey && theme.palette.grey[300]) || "#d9d9d9",
    },
    "&:hover fieldset": {
      borderColor: (theme && theme.palette && theme.palette.primary && theme.palette.primary.main) || "#1976d2",
    },
    "&.Mui-focused fieldset": {
      borderColor: (theme && theme.palette && theme.palette.primary && theme.palette.primary.main) || "#1976d2",
    },
  },
}));

export default function Page() {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/User");
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          toast.error("Failed to fetch users.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        }
      } catch (error) {
        toast.error("Error fetching users.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      typeof value === "string" && value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleOpenDialog = (userId) => {
    setSelectedUser(userId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`/api/User/${selectedUser}`);
      if (response.data.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== selectedUser));
        setOpenDialog(false);
        toast.success("User deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.error("Failed to delete user.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      toast.error("Error deleting user.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    router.push("/master/users/addUser");
  };

  // Initialize react-hook-form for edit form
  const { handleSubmit: handleEditSubmit, control: editControl, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      hotelName: "",
      email: "",
      phone: "",
      userType: "Online",
      roles: [],
    },
  });

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    reset(user); // Reset form with user data
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    reset(); // Reset form on close
  };

  const onEditSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/User/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (result.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) => (user._id === selectedUser._id ? { ...user, ...data } : user))
        );
        handleClose();
        toast.success("User updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.error("Failed to update user.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      toast.error("Error updating user.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <CircularProgress size={48} color="primary" />
            <span className="mt-4 text-gray-700">Loading Users...</span>
          </div>
        </div>
      )}
      <main className="flex-grow p-8">
        <h1 className="text-3xl font-semibold mb-6 text-cyan-900 ml-4">Booking Master Control Panel</h1>
        <StyledContainer>
          <div className="p-4 rounded-t-lg">
            <h2 className="text-2xl font-semibold text-cyan-900 mb-4">Users</h2>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-6">
              <Button
                variant="contained"
                color="success"
                onClick={handleAddNew}
                startIcon={<AddIcon />}
                sx={{
                  backgroundColor: "#4caf50",
                  "&:hover": { backgroundColor: "#45a049" },
                  padding: "8px 16px",
                  borderRadius: "8px",
                }}
              >
                Add New
              </Button>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <span className="text-sm text-gray-600">Display</span>
                <Select
                  defaultValue="All"
                  size="small"
                  variant="outlined"
                  sx={{ minWidth: 100 }}
                >
                  <MenuItem value="All">All</MenuItem>
                </Select>
                <span className="text-sm text-gray-600">records</span>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ width: 200 }}
                />
              </Box>
            </div>
            <TableContainer component={Paper}>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Hotel Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>User Type</TableCell>
                    <TableCell>Roles</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <StyledTableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.hotelName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>{user.userType}</TableCell>
                        <TableCell>{user.roles?.join(", ") || "N/A"}</TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEdit(user)}
                            sx={{ mr: 1 }}
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => handleOpenDialog(user._id)}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No users found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </StyledContainer>
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle sx={{ fontWeight: 600, color: "#1976d2" }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          <p>Are you sure you want to delete this user?</p>
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteUser}
            color="secondary"
            variant="contained"
            sx={{
              backgroundColor: "#f44336",
              "&:hover": { backgroundColor: "#d32f2f" },
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: "#1976d2" }}>
          Edit User
        </DialogTitle>
        <DialogContent sx={{ padding: 3 }}>
          <form onSubmit={handleEditSubmit(onEditSubmit)}>
            <Grid container spacing={3}>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <StyledTextField
                  label="Name"
                  fullWidth
                  required
                  variant="outlined"
                  {...editControl.register("name", { required: "Name is required" })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  label="Hotel Name"
                  fullWidth
                  required
                  variant="outlined"
                  {...editControl.register("hotelName", { required: "Hotel Name is required" })}
                  error={!!errors.hotelName}
                  helperText={errors.hotelName?.message}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  label="Email"
                  fullWidth
                  required
                  variant="outlined"
                  {...editControl.register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                      message: "Invalid email address",
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  label="Phone"
                  fullWidth
                  required
                  variant="outlined"
                  {...editControl.register("phone", { required: "Phone number is required" })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <InputLabel id="userType-label" sx={{ fontSize: "0.875rem", color: "#666", mb: 1 }}>
                    User Type
                  </InputLabel>
                  <Controller
                    name="userType"
                    control={editControl}
                    rules={{ required: "User type is required" }}
                    render={({ field }) => (
                      <StyledSelect
                        {...field}
                        labelId="userType-label"
                        fullWidth
                        variant="outlined"
                        value={field.value || "Online"}
                        error={!!errors.userType}
                        sx={{ mb: errors.userType ? 0 : 2 }}
                      >
                        <MenuItem value="Online">Online</MenuItem>
                        <MenuItem value="Offline">Offline</MenuItem>
                      </StyledSelect>
                    )}
                  />
                  {errors.userType && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.userType.message}
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ mb: 2 }}>
                  <InputLabel id="roles-label" sx={{ fontSize: "0.875rem", color: "#666", mb: 1 }}>
                    Roles
                  </InputLabel>
                  <Controller
                    name="roles"
                    control={editControl}
                    rules={{ required: "At least one role is required" }}
                    render={({ field }) => (
                      <StyledSelect
                        {...field}
                        labelId="roles-label"
                        multiple
                        fullWidth
                        variant="outlined"
                        renderValue={(selected) => selected.join(", ")}
                        error={!!errors.roles}
                        sx={{ mb: errors.roles ? 0 : 2 }}
                      >
                        <MenuItem value="Property & Frontdesk">Property & Frontdesk</MenuItem>
                        <MenuItem value="Restaurant">Restaurant</MenuItem>
                        <MenuItem value="Inventory">Inventory</MenuItem>
                      </StyledSelect>
                    )}
                  />
                  {errors.roles && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                      {errors.roles.message}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
            <DialogActions sx={{ padding: 2 }}>
              <Button
                onClick={handleClose}
                color="error"
                variant="outlined"
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="success"
                variant="contained"
                sx={{
                  backgroundColor: "#4caf50",
                  "&:hover": { backgroundColor: "#45a049" },
                }}
              >
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}