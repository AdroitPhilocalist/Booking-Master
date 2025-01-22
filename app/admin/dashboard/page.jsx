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
  Users, UserCircle, Building2, BedDouble, ListChecks, Users2, BookOpen,
  ClipboardList, UtensilsCrossed, LayoutDashboard, TableProperties, Menu,
  Receipt, FileText, Package, FolderTree, PackageSearch, ShoppingCart,
  BarChart3, LogOut
} from 'lucide-react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from 'next/navigation';

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
  };

  const handleAddProfile = async () => {
    try {
      setIsLoading(true);
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `/api/Profile/${selectedProfileId}` : "/api/Profile";
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
    setOpenAddProfileDialog(true);
    setSelectedProfileId(profile._id);
  };
  const modalStyle = {
    width: 350, // Increased width
    height: 400, // Increased height
  };

  const deleteSpecificCookies = () => {
    // Delete authtoken
    document.cookie = "adminauthToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    // Delete clienttoken
    document.cookie = "adminclientToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
  };

  const handleLogout = () => {
    setIsLoggingOut(true);

    // Delete specific cookies
    deleteSpecificCookies();

    // Add a small delay before redirecting
    setTimeout(() => {
      setIsLoggingOut(false);
      router.push('/admin/login');
    }, 800);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-purple-800 to-indigo-600 min-h-screen mt-6">
        <Container maxWidth="lg" style={{ marginTop: "0rem" }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <StyledCard>
                <CardHeader
                  title="Super Admin Dashboard"
                  subheader="Manage Hotel Admin Profiles"
                  action={
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleOpenAddProfileDialog}
                    >
                      Add New Profile  <Add className="ml-1" />
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
                                  onClick={() => handleOpenEditProfileDialog(profile)}
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
          <DialogTitle>{isEditing ? "Edit Profile" : "Add New Profile"}</DialogTitle>
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
        <button
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
        </button>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
