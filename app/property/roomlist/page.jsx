"use client"
import React, { useEffect, useState } from "react";
import Navbar from "@/app/_components/Navbar";
import { Footer } from "@/app/_components/Footer";
import Link from "next/link";
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
} from "@mui/material";

export default function BookingManagement() {
  const [rooms, setRooms] = useState([]); // State to hold room data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    // Fetch room data from your backend
    const fetchRooms = async () => {
      try {
        const response = await fetch("/api/rooms"); // Update the endpoint to match your backend
        const roomData = await response.json();
        setRooms(roomData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

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
          <Link href="roomlist/addRoom">
            <Button variant="contained" color="primary">
              Add Room
            </Button>
          </Link>
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
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

