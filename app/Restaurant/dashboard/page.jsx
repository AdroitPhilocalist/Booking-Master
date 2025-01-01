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
// Import Material-UI icons
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Today");
  const [tables, setTables] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = ["Today", "Tomorrow", "Day After Tomorrow"];

  useEffect(() => {
    async function fetchTables() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/tables");
        const data = await response.json();
        setTables(data.data);
      } catch (error) {
        console.error("Error fetching tables:", error);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchBookings() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/RestaurantBooking");
        const data = await response.json();
        setBookings(data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
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

  const handleBookingDetails = (bookings) => {
    setSelectedBooking(bookings);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-amber-50">
        
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
              <span className="mt-4 text-gray-700">Loading Restaurant Dashboard...</span>
            </div>
          </div>
        )}
        <header>
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-cyan-900">Restaurant Dashboard</h1>
            <div className="space-x-4">

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
                  className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === tab
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
                const bookingsForTable = todayBookings.filter((b) => b.tableNo === table.tableNo);

                return (
                  <Card
                    key={table._id}
                    sx={{
                      backgroundColor: bookingsForTable.length > 0 ? "#E3FCEF" : "#FFFFFF",
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
                      avatar={<TableRestaurantIcon color="primary" />}
                      title={`Table-${table.tableNo}`}
                      titleTypographyProps={{
                        variant: "h6",
                        fontWeight: "bold",
                        color: "#007BFF",
                      }}
                      sx={{
                        backgroundColor: "#F0F4FF",
                        padding: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    />
                    <CardContent sx={{ padding: "16px" }}>
                      {bookingsForTable.length > 0 ? (
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          startIcon={<BookmarkAddedIcon />}
                          onClick={() => handleBookingDetails(bookingsForTable)}
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
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <TableRestaurantIcon fontSize="small" /> No bookings for this table.
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
                  sx={{
                    fontWeight: "bold",
                    color: "#007BFF",
                    textAlign: "center",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 2,
                  }}
                >
                  <BookmarkAddedIcon fontSize="large" /> Booking Details
                </Typography>
                {selectedBooking.map((booking, index) => (
                  <Box key={index}
                    sx={{
                      mb: 3, // Add spacing between booking details
                      // Optional: Add padding for better aesthetics

                    }}>
                    <Typography variant="body1" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      <TableRestaurantIcon /> <strong>Table:</strong> {booking.tableNo}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      <EventIcon /> <strong>Date:</strong> {new Date(booking.date).toDateString()}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}>
                      <AccessTimeIcon /> <strong>Time:</strong> {booking.time}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                      <PersonIcon /> <strong>Guest Name:</strong> {booking.guestName}
                    </Typography>
                    {index < selectedBooking.length - 1 && <hr />}
                  </Box>
                ))}
              </Card>
            </Box>
          </Modal>
        )}

      </div>
      <Footer />
    </div>
  );
}