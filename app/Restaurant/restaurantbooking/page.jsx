"use client";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer"

import React, { useState } from "react";
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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addBooking = (newBooking) => {
    setBookings([...bookings, newBooking]);
    handleClose();
  };

  // Handle Edit Booking (Dummy Function)
  const handleEdit = (id) => {
    alert(`Edit booking with ID: ${id}`);
  };

  // Handle Delete Booking
  const handleDelete = (id) => {
    setBookings(bookings.filter((booking) => booking.id !== id));
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
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell sx={{ color: "#2196f3" }}>Table No.</TableCell>
              <TableCell sx={{ color: "#2196f3" }}>Date</TableCell>
              <TableCell sx={{ color: "#2196f3" }}>Time</TableCell>
              <TableCell sx={{ color: "#2196f3" }}>Guest Name</TableCell>
              <TableCell sx={{ color: "#2196f3" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings
              .filter((booking) =>
                booking.guestName.toLowerCase().includes(search.toLowerCase())
              )
              .map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.tableNo}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.guestName}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(booking.id)} sx={{ color: "#4caf50" }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(booking.id)} sx={{ color: "#f44336" }}>
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
    <Footer/>
    </div>
  );
};

export default RestaurantBooking;

