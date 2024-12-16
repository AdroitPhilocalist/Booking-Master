"use client"
import { useEffect, useState } from "react";
import { Footer } from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import {
  Modal,
  Box,
  Button,
  Card,
  Typography,
  CardContent,
  CardHeader,
} from "@mui/material";
import Loader from "../../_components/Loader";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Today");
  const [tables, setTables] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const tabs = ["Today", "Tomorrow", "Day After Tomorrow"];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchTables() {
      try {
        const response = await fetch("/api/tables");
        const data = await response.json();
        setTables(data.data);
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    }

    async function fetchBookings() {
      try {
        const response = await fetch("/api/RestaurantBooking");
        const data = await response.json();
        setBookings(data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    }

    fetchTables();
    fetchBookings();
  }, []);

  const getBookingsForSelectedDay = () => {
    const currentDate = new Date();

    if (activeTab === "Tomorrow") {
      currentDate.setDate(currentDate.getDate() + 1);
    } else if (activeTab === "Day After Tomorrow") {
      currentDate.setDate(currentDate.getDate() + 2);
    }

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getDate()).padStart(2, "0");
    const selectedDate = `${year}-${month}-${day}`;

    return bookings.filter((booking) => booking.date.split("T")[0] === selectedDate);
  };

  const handleBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <header>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-cyan-900">Restaurant Dashboard</h1>
          <div className="space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              $ Debtor Payments
            </button>
            <button className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">
              Debtor Statement
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex space-x-4 mb-6"></div>

        <div className="mb-6">
          <nav className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === tab
                    ? "bg-gray-200 text-gray-800"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.length > 0 ? (
            tables.map((table) => {
              const todayBookings = getBookingsForSelectedDay();
              const booking = todayBookings.find((b) => b.tableNo === table.tableNo);

              return (
                <Card
                  key={table._id}
                  sx={{
                    backgroundColor: booking ? "#E3FCEF" : "#FFFFFF",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                >
                  <CardHeader
                    title={`Table-${table.tableNo}`}
                    titleTypographyProps={{
                      variant: "h6",
                      fontWeight: "bold",
                      color: "#007BFF",
                    }}
                    sx={{ backgroundColor: "#F0F4FF", padding: "16px" }}
                  />
                  <CardContent sx={{ padding: "16px" }}>
                    {booking ? (
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={() => handleBookingDetails(booking)}
                        sx={{
                          textTransform: "capitalize",
                          borderRadius: "8px",
                          backgroundColor: "#007BFF",
                          ":hover": {
                            backgroundColor: "#0056b3",
                          },
                        }}
                      >
                        Booking Details
                      </Button>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No bookings for this table.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <p>No tables available.</p>
          )}
        </div>
      </main>

      <Footer />

      {selectedBooking && (
        <Modal open={modalOpen} onClose={closeModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 450,
              background: "linear-gradient(135deg, #9B6FCE, #4E92D6)",
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
              borderRadius: 3,
              p: 3,
              overflow: "hidden",
            }}
          >
            <Card
              sx={{
                bgcolor: "#f9f9f9",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                borderRadius: 2,
                padding: 3,
              }}
            >
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#007BFF", textAlign: "center", mb: 2 }}
              >
                Booking Details
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Table:</strong> {selectedBooking.tableNo}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Date:</strong> {new Date(selectedBooking.date).toDateString()}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Time:</strong> {selectedBooking.time}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Guest Name:</strong> {selectedBooking.guestName}
              </Typography>
            </Card>
          </Box>
        </Modal>
      )}
    </div>
  );
}
