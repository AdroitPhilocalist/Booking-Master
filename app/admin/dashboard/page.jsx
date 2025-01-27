"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogContentText,
  Stack,
} from "@mui/material";
import { Edit, Delete, Visibility, Add } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import {
  Users,
  UserCircle,
  Building2,
  BedDouble,
  ListChecks,
  Users2,
  BookOpen,
  ClipboardList,
  UtensilsCrossed,
  LayoutDashboard,
  TableProperties,
  Menu,
  Receipt,
  FileText,
  Package,
  FolderTree,
  PackageSearch,
  ShoppingCart,
  BarChart3,
  LogOut,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "../../_components/admin-navbar";
import { Footer } from "../../_components/Footer";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    backgroundColor: theme.palette.background.paper,
    borderRadius: "16px",
    padding: theme.spacing(4),
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
  },
}));

const SuperAdminDashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);
  const [openAddProfileDialog, setOpenAddProfileDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [formData, setFormData] = useState({
    hotelName: "",
    mobileNo: "",
    email: "",
    username: "",
    password: "",
    addressLine1: "",
    addressLine2: "",
    altMobile: "",
    district: "",
    gstNo: "",
    pinCode: "",
    website: "",
    Profile_Complete: "no",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/Profile");
        const data = await response.json();
        if (data.success) {
          setProfiles(data.data);
        } else {
          toast.error("Failed to fetch profiles.");
        }
      } catch (error) {
        toast.error("Error fetching profiles.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleDeleteClick = (id) => {
    setSelectedProfileId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`/api/Profile/${selectedProfileId}`);
      if (response.data.success) {
        setProfiles(
          profiles.filter((profile) => profile._id !== selectedProfileId)
        );
        setOpenDeleteDialog(false);
        toast.success("Profile deleted successfully!");
      } else {
        toast.error("Failed to delete profile.");
      }
    } catch (error) {
      toast.error("Error deleting profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedProfileId(null);
  };

  const handleOpenAddProfileDialog = () => {
    setIsEditing(false);
    setFormData({
      hotelName: "",
      mobileNo: "",
      email: "",
      username: "",
      password: "",
      addressLine1: "",
      addressLine2: "",
      altMobile: "",
      district: "",
      gstNo: "",
      pinCode: "",
      website: "",
      Profile_Complete: "no",
    });
    setErrors({});
    setOpenAddProfileDialog(true);
  };

  const handleCloseAddProfileDialog = () => {
    setOpenAddProfileDialog(false);
    setFormData({
      hotelName: "",
      mobileNo: "",
      email: "",
      username: "",
      password: "",
      addressLine1: "",
      addressLine2: "",
      altMobile: "",
      district: "",
      gstNo: "",
      pinCode: "",
      website: "",
      Profile_Complete: "no",
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      addressLine1: "",
      addressLine2: "",
      altMobile: "",
      district: "",
      gstNo: "",
      pinCode: "",
      website: "",
      Profile_Complete: "no",
    }));
    console.log(formData);
    // Validate fields on change
    let newErrors = { ...errors };
    if (name === "username") {
      if (value.length < 3 || value.length > 20) {
        newErrors.username = "Username must be between 3 and 20 characters.";
      } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
        newErrors.username = "Username must be alphanumeric.";
      } else {
        delete newErrors.username;
      }
    }
    if (name === "password" && !isEditing) {
      const passwordErrors = validatePassword(value);
      if (Object.keys(passwordErrors).length > 0) {
        newErrors.password = Object.values(passwordErrors).join(" ");
      } else {
        delete newErrors.password;
      }
    }
    setErrors(newErrors);
  };
  const validatePassword = (password) => {
    const errors = {};
    if (password.length < 8) {
      errors.minLength = "Password must be at least 8 characters long.";
    }
    if (password.length > 13) {
      errors.maxLength = "Password must be no more than 13 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      errors.uppercase = "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
      errors.lowercase = "Password must contain at least one lowercase letter.";
    }
    if (!/[0-9]/.test(password)) {
      errors.digit = "Password must contain at least one digit.";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.specialChar =
        'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)';
    }
    return errors;
  };
  const handleAddProfile = async () => {
    // Validate form before submission
    let newErrors = {};
    if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = "Username must be between 3 and 20 characters.";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
      newErrors.username = "Username must be alphanumeric.";
    }
    if (
      !isEditing &&
      (formData.password.length < 8 || formData.password.length > 13)
    ) {
      newErrors.password = "Password must be between 8 and 13 characters.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please correct the form errors !!");
      return;
    }
    try {
      setIsLoading(true);
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing
        ? `/api/Profile/${selectedProfileId}`
        : "/api/Profile";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        if (isEditing) {
          setProfiles((prevProfiles) =>
            prevProfiles.map((profile) =>
              profile._id === selectedProfileId ? data.data : profile
            )
          );
        } else {
          setProfiles([...profiles, data.data]);
        }
        setOpenAddProfileDialog(false);
        setFormData({
          hotelName: "",
          mobileNo: "",
          email: "",
          username: "",
          password: "",
          addressLine1: "",
          addressLine2: "",
          altMobile: "",
          district: "",
          gstNo: "",
          pinCode: "",
          website: "",
        });
        setErrors({});
        toast.success("Profile added successfully!");
      } else {
        toast.error("Username already exists !!");
      }
    } catch (error) {
      toast.error("Error adding profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenEditProfileDialog = (profile) => {
    setIsEditing(true);
    setFormData({
      hotelName: profile.hotelName,
      mobileNo: profile.mobileNo,
      email: profile.email,
      username: profile.username,
      password: "",
    });
    setErrors({});
    setOpenAddProfileDialog(true);
    setSelectedProfileId(profile._id);
  };
  const modalStyle = {
    width: 350, // Increased width
    height: 400, // Increased height
  };

  const deleteSpecificCookies = () => {
    // Delete authtoken
    document.cookie =
      "adminauthToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    // Delete clienttoken
    document.cookie =
      "adminclientToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  };

  const handleLogout = () => {
    setIsLoggingOut(true);

    // Delete specific cookies
    deleteSpecificCookies();

    // Add a small delay before redirecting
    setTimeout(() => {
      setIsLoggingOut(false);
      router.push("/admin/login");
    }, 800);
  };

  return (
    <div>
      <Navbar />
      <div className="bg-amber-50 min-h-screen mt-6">
        <Container maxWidth="lg" style={{ marginTop: "0rem" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledCard>
                <CardHeader
                  title="Super Admin Dashboard"
                  className=" text-3xl text-center font-bold text-cyan-900"
                  subheader="Manage Hotel Admin Profiles"
                  action={
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenAddProfileDialog}
                    >
                      Add New Profile <Add className="ml-1" />
                    </Button>
                  }
                />
                <CardContent>
                  {isLoading ? (
                    <Typography>Loading profiles...</Typography>
                  ) : (
                    <TableContainer
                      component={Paper}
                      elevation={6}
                      style={{ borderRadius: "16px" }}
                    >
                      <Table aria-label="profiles table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Hotel Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Mobile No</TableCell>
                            <TableCell>Username</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {profiles.map((profile) => (
                            <TableRow key={profile._id}>
                              <TableCell>{profile.hotelName}</TableCell>
                              <TableCell>{profile.email}</TableCell>
                              <TableCell>{profile.mobileNo}</TableCell>
                              <TableCell>{profile.username || "N/A"}</TableCell>
                              <TableCell>
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    handleOpenEditProfileDialog(profile)
                                  }
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  color="secondary"
                                  onClick={() => handleDeleteClick(profile._id)}
                                >
                                  <Delete />
                                </IconButton>
                                <IconButton
                                  color="default"
                                  onClick={() =>
                                    (window.location.href = `/master/profile/${profile._id}`)
                                  }
                                >
                                  <Visibility />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </Container>

        <ToastContainer />

        {/* Delete Confirmation Dialog */}
        <StyledDialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete Profile</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete this profile?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="secondary">
              Confirm
            </Button>
          </DialogActions>
        </StyledDialog>

        {/* Add Profile Dialog */}
        <StyledDialog
          open={openAddProfileDialog}
          onClose={handleCloseAddProfileDialog}
        >
          <DialogTitle>
            {isEditing ? "Edit Profile" : "Add New Profile"}
          </DialogTitle>
          <DialogContent sx={modalStyle}>
            <Stack spacing={2} className="mt-2">
              <TextField
                label="Hotel Name"
                variant="outlined"
                fullWidth
                name="hotelName"
                value={formData.hotelName}
                onChange={handleChange}
                required
              />
              <TextField
                label="Mobile No"
                variant="outlined"
                fullWidth
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
                required
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                label="Username"
                variant="outlined"
                fullWidth
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                error={Boolean(errors.username)}
                helperText={errors.username}
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEditing}
                error={Boolean(errors.password)}
                helperText={errors.password}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddProfileDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddProfile} color="secondary">
              {isEditing ? "Update Profile" : "Add Profile"}
            </Button>
          </DialogActions>
        </StyledDialog>
        {/* <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`
                flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 
                text-white rounded-lg transform transition-all duration-300
                ${isLoggingOut ? 'scale-95 opacity-80' : 'hover:scale-105'}
                focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 
                shadow-md hover:shadow-lg
              `}
        >
          <LogOut className={`w-5 h-5 transform transition-transform duration-500 ${isLoggingOut ? 'rotate-90' : ''}`} />
          <span className={`transition-opacity duration-300 ${isLoggingOut ? 'opacity-0' : 'opacity-100'}`}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </span>
        </button> */}
      </div>
      <Footer />
    </div>
  );
};

export default SuperAdminDashboard;
