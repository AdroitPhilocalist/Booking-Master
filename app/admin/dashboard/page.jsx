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
} from "@mui/material";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  marginBottom: theme.spacing(4),
  borderRadius: "16px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
}));

const SuperAdminDashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState(null);

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
        setProfiles(profiles.filter((profile) => profile._id !== selectedProfileId));
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

  return (
    <>
      <div className="bg-gradient-to-r from-purple-800 to-indigo-600 min-h-screen">
        <Container maxWidth="lg" style={{ marginTop: "4rem" }}>
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
                      onClick={() => window.location.href = '/master/profile'}
                    >
                      Add New Profile
                    </Button>
                  }
                />
                <CardContent>
                  {isLoading ? (
                    <Typography>Loading profiles...</Typography>
                  ) : (
                    <TableContainer component={Paper} elevation={6} style={{ borderRadius: "16px" }}>
                      <Table aria-label="profiles table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Hotel Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Mobile No</TableCell>
                            <TableCell>GST No</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {profiles.map((profile) => (
                            <TableRow key={profile._id}>
                              <TableCell>{profile.hotelName}</TableCell>
                              <TableCell>{profile.email}</TableCell>
                              <TableCell>{profile.mobileNo}</TableCell>
                              <TableCell>{profile.gstNo || "N/A"}</TableCell>
                              <TableCell>
                                <IconButton
                                  color="primary"
                                  onClick={() => window.location.href = `/master/profile/${profile._id}`}
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
                                  onClick={() => window.location.href = `/master/profile/${profile._id}`}
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
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Delete Profile</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this profile?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="secondary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default SuperAdminDashboard;