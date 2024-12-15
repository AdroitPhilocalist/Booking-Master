"use client"
import React, { useEffect, useState } from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export default function BookingManagement() {
  const [rooms, setRooms] = useState({ data: [] }); // Initialize with an empty data array
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [categories, setCategories] = useState([]);

  // Form state
  const [roomNumber, setRoomNumber] = useState("");
  const [category, setCategory] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [clean, setClean] = useState("Yes");

  // Fetch rooms and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rooms
        const roomsResponse = await fetch("/api/rooms");
        const roomData = await roomsResponse.json();
        setRooms(roomData);

        // Fetch categories
        const categoriesResponse = await fetch("/api/roomCategories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Modal open/close handlers
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // Submit room handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newRoom = {
      number: roomNumber,
      category,
      floor: floorNumber,
      clean: clean === "Yes",
    };

    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoom),
      });

      if (res.ok) {
        // Refresh rooms data
        const updatedRoomsResponse = await fetch("/api/rooms");
        const updatedRoomsData = await updatedRoomsResponse.json();
        setRooms(updatedRoomsData);

        // Reset form and close modal
        setRoomNumber("");
        setCategory("");
        setFloorNumber("");
        setClean("Yes");
        handleCloseModal();
      } else {
        console.error("Failed to create new room", res.statusText);
      }
    } catch (error) {
      console.error("An error occurred while creating the room:", error);
    }
  };

  // Modal style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <Typography variant="h5" color="textSecondary">
          Loading room data...
        </Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Navigation */}
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h4" component="h1" className="font-bold text-gray-800">
            Room Management
          </Typography>
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Add Room
          </Button>
        </div>

        {/* Room Table */}
        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#164E63" }}>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>
                  Room Number
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>
                  Category
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>
                  Floor
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>
                  Clean
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>
                  Occupancy
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>
                  Billing Started
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.data.map((room) => (
                <TableRow key={room._id}>
                  <TableCell align="center">{room.number}</TableCell>
                  <TableCell align="center">{room.category.category}</TableCell>
                  <TableCell align="center">{room.floor}</TableCell>
                  <TableCell align="center">
                    {room.clean ? (
                      <Typography
                        sx={{
                          bgcolor: "#81C784",
                          color: "white",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          padding: "4px 8px",
                          borderRadius: "8px",
                        }}
                      >
                        Yes
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          bgcolor: "#E57373",
                          color: "white",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          padding: "4px 8px",
                          borderRadius: "8px",
                        }}
                      >
                        No
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {room.occupied === "Vacant" ? (
                      <Typography
                        sx={{
                          bgcolor: "#FFD54F",
                          color: "black",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          padding: "4px 8px",
                          borderRadius: "8px",
                        }}
                      >
                        Vacant
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          bgcolor: "#64B5F6",
                          color: "white",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          padding: "4px 8px",
                          borderRadius: "8px",
                        }}
                      >
                        Confirmed
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="center">
                    {room.billingStarted === "Yes" ? (
                      <Typography
                        sx={{
                          bgcolor: "#4CAF50",
                          color: "white",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          padding: "4px 8px",
                          borderRadius: "8px",
                        }}
                      >
                        Yes
                      </Typography>
                    ) : (
                      <Typography
                        sx={{
                          bgcolor: "#FF7043",
                          color: "white",
                          fontSize: "0.8rem",
                          fontWeight: "bold",
                          padding: "4px 8px",
                          borderRadius: "8px",
                        }}
                      >
                        No
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add Room Modal */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="add-room-modal-title"
        >
          <Box sx={modalStyle}>
            <Typography id="add-room-modal-title" variant="h6" component="h2" className="mb-4">
              Add New Room
            </Typography>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <TextField 
                  fullWidth
                  label="Room Number" 
                  variant="outlined" 
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required 
                />
              </div>

              <div className="mb-4">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Room Category</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Room Category"
                    required
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

              <div className="mb-4">
                <TextField 
                  fullWidth
                  label="Floor Number" 
                  variant="outlined"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(e.target.value)}
                  required 
                />
              </div>

              <div className="mb-4">
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Clean Status</InputLabel>
                  <Select
                    value={clean}
                    onChange={(e) => setClean(e.target.value)}
                    label="Clean Status"
                    required
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </div>

              <div className="flex justify-between">
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                >
                  Add Room
                </Button>
              </div>
            </form>
          </Box>
        </Modal>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}