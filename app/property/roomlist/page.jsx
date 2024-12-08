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
import axios from "axios"; // For fetching data from your backend

export default function BookingManagement() {
  const [rooms, setRooms] = useState([]); // Changed to initialize as empty array
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch room data from your backend
    const fetchRooms = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/rooms"); // Update the endpoint to match your backend
        // Check if response.data is an array or has a data property
        const roomData = Array.isArray(response.data) 
          ? response.data 
          : response.data.data || [];
        setRooms(roomData);
        setError(null);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Render error message if fetch fails
  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <Typography variant="h6" color="error">
          Error loading rooms: {error.message}
        </Typography>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Navigation */}
      <Navbar />
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <svg 
              aria-hidden="true" 
              className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" 
              viewBox="0 0 100 101" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" 
                fill="currentColor"
              />
              <path 
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" 
                fill="currentFill"
              />
            </svg>
            <span className="mt-4 text-gray-700">Loading Room Invoices...</span>
          </div>
        </div>
      )}
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
              {rooms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" className="text-gray-500">
                      No rooms found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map((room) => (
                  <TableRow key={room._id}>
                    <TableCell align="center">{room.number}</TableCell>
                    <TableCell align="center">{room.category?.category || 'N/A'}</TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}