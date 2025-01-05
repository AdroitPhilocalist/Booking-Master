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
  const [rooms, setRooms] = useState({ data: [] });
  const [openModal, setOpenModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [roomNumber, setRoomNumber] = useState("");
  const [category, setCategory] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [clean, setClean] = useState("Yes");
  const [isLoading, setIsLoading] = useState(true);

  // Function to sort room numbers
  const sortRoomNumbers = (roomsArray) => {
    return [...roomsArray].sort((a, b) => {
      // Extract numbers from room numbers
      const aNum = parseInt(a.number.replace(/\D/g, ''));
      const bNum = parseInt(b.number.replace(/\D/g, ''));
      
      // If the numbers are the same, sort by the full string
      if (aNum === bNum) {
        return a.number.localeCompare(b.number);
      }
      return aNum - bNum;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const roomsResponse = await fetch("/api/rooms");
        const roomData = await roomsResponse.json();
        // Sort rooms before setting state
        const sortedRooms = { ...roomData, data: sortRoomNumbers(roomData.data) };
        setRooms(sortedRooms);

        const categoriesResponse = await fetch("/api/roomCategories");
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

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
        const updatedRoomsResponse = await fetch("/api/rooms");
        const updatedRoomsData = await updatedRoomsResponse.json();
        // Sort rooms after adding new room
        const sortedRooms = { ...updatedRoomsData, data: sortRoomNumbers(updatedRoomsData.data) };
        setRooms(sortedRooms);

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

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-amber-50">
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
              <svg aria-hidden="true" className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="mt-4 text-gray-700">Loading Room Lists...</span>
            </div>
          </div>
        )}
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between mb-6" style={{ maxWidth: '80%', margin: '0 auto' }}>
            <Typography variant="h4" component="h2" className="font-bold text-cyan-900 mb-4">
              Room Management
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleOpenModal}
              className="mb-4"
              style={{ marginBottom: "16px" }}
            >
              Add Room
            </Button>
          </div>

          <TableContainer component={Paper} style={{ maxWidth: '80%', margin: '0 auto' }}>
            <Table>
              <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                    Room Number
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                    Category
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                    Floor
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                    Clean
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                    Occupancy
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
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
                  <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Add Room
                  </Button>
                </div>
              </form>
            </Box>
          </Modal>
        </div>
      </div>
      <Footer />
    </div>
  );
}