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
  Tooltip,
} from "@mui/material";
import {
  Edit,
  Delete,
  Visibility,
  Add,
  ErrorOutline,
  CheckCircleOutline,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
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
  const [openIssueDialog, setOpenIssueDialog] = useState(false);
  const [issueProfile, setIssueProfile] = useState(null);
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
  const toggleActiveStatus = async (id) => {
    try {
      setIsLoading(true);
      const response = await axios.patch(`/api/Profile/${id}`);
      const data = await response.json();
      if (data.success) {
        setProfiles((prevProfiles) =>
          prevProfiles.map((profile) =>
            profile._id === id ? data.data : profile
          )
        );
        toast.success("Active status toggled successfully!");
      } else {
        toast.error("Failed to toggle active status: " + data.error);
      }
    } catch (error) {
      toast.error("Error toggling active status: " + error.message);
    } finally {
      setIsLoading(false);
    }
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

  const handleOpenIssueDialog = (profile) => {
    setIssueProfile(profile);
    setOpenIssueDialog(true);
  };

  const handleCloseIssueDialog = () => {
    setOpenIssueDialog(false);
    setIssueProfile(null);
  };

  const handleResolveIssue = async () => {
    try {
      setIsLoading(true);
      const response = await axios.put(`/api/Profile/${issueProfile._id}`, {
        forgotUsername: false,
        forgotPassword: false,
      });
      console.log(response);
      if (response.data.success) {
        setProfiles((prevProfiles) =>
          prevProfiles.map((profile) =>
            profile._id === issueProfile._id
              ? { ...profile, forgotUsername: false, forgotPassword: false }
              : profile
          )
        );
        handleCloseIssueDialog();
        toast.success("Issue resolved successfully!");
      } else {
        toast.error("Failed to resolve issue.");
      }
    } catch (error) {
      toast.error("Error resolving issue.");
    } finally {
      setIsLoading(false);
    }
  };

  const getIssueIcon = (profile) => {
    if (profile.forgotUsername && profile.forgotPassword) {
      return (
        <Tooltip title="Forgot Username & Password">
          <ErrorOutline
            sx={{
              color: "red",
              animation: "pop 0.5s infinite alternate",
            }}
          />
        </Tooltip>
      );
    } else if (profile.forgotUsername) {
      return (
        <Tooltip title="Forgot Username">
          <ErrorOutline
            sx={{
              color: "orange",
              animation: "pop 0.5s infinite alternate",
            }}
          />
        </Tooltip>
      );
    } else if (profile.forgotPassword) {
      return (
        <Tooltip title="Forgot Password">
          <ErrorOutline
            sx={{
              color: "yellow",
              animation: "pop 0.5s infinite alternate",
            }}
          />
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title="No Issues">
          <CheckCircleOutline
            sx={{
              color: "green",
              animation: "pop 0.5s infinite alternate",
            }}
          />
        </Tooltip>
      );
    }
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
      {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
              <svg aria-hidden="true" className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="mt-4 text-gray-700">Loading Hotel List...</span>
            </div>
          </div>
        )}
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
                            <TableCell>User Issue</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {profiles.map((profile) => (
                            <TableRow key={profile._id}
                            style={{
                              backgroundColor: profile.active === 'no' ? '#ffdddd' : '#f8f9fa',
                              transition: 'background-color 0.3s',
                            }}>
                              <TableCell>{profile.hotelName}</TableCell>
                              <TableCell>{profile.email}</TableCell>
                              <TableCell>{profile.mobileNo}</TableCell>
                              <TableCell>{profile.username || "N/A"}</TableCell>
                              <TableCell>
                                <IconButton
                                  onClick={() => handleOpenIssueDialog(profile)}
                                >
                                  {getIssueIcon(profile)}
                                </IconButton>
                              </TableCell>
                              <TableCell>
                          {profile.active === 'yes' ? (
                            <CheckCircle color="success" />
                          ) : (
                            <Cancel color="error" />
                          )}
                        </TableCell>
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
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
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
      </div>
      {/* Issue Dialog */}
      <StyledDialog
        open={openIssueDialog}
        onClose={handleCloseIssueDialog}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          style: {
            backgroundColor: "#f9f9f9",
            borderRadius: "16px",
            padding: "2rem",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <DialogTitle>
          {issueProfile?.forgotUsername && issueProfile?.forgotPassword
            ? "Forgot Username & Password"
            : issueProfile?.forgotUsername
            ? "Forgot Username"
            : issueProfile?.forgotPassword
            ? "Forgot Password"
            : "No Issues"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {issueProfile?.forgotUsername && issueProfile?.forgotPassword
              ? "This user has requested help with both their username and password."
              : issueProfile?.forgotUsername
              ? "This user has requested help with their username."
              : issueProfile?.forgotPassword
              ? "This user has requested help with their password."
              : "This user has no issues."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseIssueDialog} color="primary">
            Close
          </Button>
          {(issueProfile?.forgotUsername || issueProfile?.forgotPassword) && (
            <Button onClick={handleResolveIssue} color="secondary">
              Resolve
            </Button>
          )}
        </DialogActions>
      </StyledDialog>
      <Footer />
      <style jsx global>{`
        @keyframes pop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default SuperAdminDashboard;
