"use client";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Box,
  Button,
  Typography,
  Modal,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddNewBookingForm from "./addnewbooking/page";

const RestaurantBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  // Fetch bookings from the API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/RestaurantBooking");
        const data = await response.json();
        if (data.success) {
          setBookings(data.data);
        } else {
          console.error("Failed to fetch bookings:", data.error);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  // Open/Close Modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Add a new booking
  const addBooking = async (newBooking) => {
    try {
      const response = await fetch("/api/RestaurantBooking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBooking),
      });

      const data = await response.json();
      if (data.success) {
        setBookings((prevBookings) => [...prevBookings, data.data]);
        handleClose();
      } else {
        console.error("Failed to add booking:", data.error);
      }
    } catch (error) {
      console.error("Error adding booking:", error);
    }
  };

  // Handle Edit Booking (Dummy Function)
  const handleEdit = (id) => {
    alert(`Edit booking with ID: ${id}`);
  };

  // Handle Delete Booking
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/RestaurantBooking/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== id)
        );
      } else {
        console.error("Failed to delete booking:", data.error);
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <div className="bg-amber-50 min-h-screen">
    <Navbar/>
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, color: "#1976d2" }}>
        Booking
      </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, gap: 2 }}>
          <TextField
            placeholder="Search By Guest Name"
            variant="outlined"
            size="small"
            sx={{ minWidth: 300 }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              bgcolor: "#2196f3",
              "&:hover": { bgcolor: "#1976d2" },
            }}
          >
            Add New Booking
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#164E63" }}>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Table No.</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Time</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Guest Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings
                .filter((booking) =>
                  booking.guestName.toLowerCase().includes(search.toLowerCase())
                )
                .map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell sx={{ textAlign: "center" }}>{booking.tableNo}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                        {(() => {
                          const date = new Date(booking.date);
                          const day = String(date.getDate()).padStart(2, "0");
                          const month = String(date.getMonth() + 1).padStart(2, "0");
                          const year = date.getFullYear();
                          return `${day}/${month}/${year}`;
                        })()}
                      </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{booking.time}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{booking.guestName}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton onClick={() => handleEdit(booking._id)} sx={{ color: "#4caf50" }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(booking._id)}
                        sx={{ color: "#f44336" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {bookings.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No bookings available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal for Adding New Booking */}
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "white",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
              minWidth: 400,
            }}
          >
            <AddNewBookingForm onSubmit={addBooking} />
          </Box>
        </Modal>
      </Box>
      <Footer />
    </div>
  );
};

export default RestaurantBooking;
