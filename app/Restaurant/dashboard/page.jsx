"use client";
import { useEffect, useState } from "react";
import { Footer } from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import { Modal, Box, Button } from "@mui/material";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Today");
  const [tables, setTables] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const tabs = ["Today", "Tomorrow", "Day After Tomorrow"];

  // Fetch table data from the backend
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
        // console.log(bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    }

    fetchTables();
    fetchBookings();
  }, []);

  // Filter bookings for today
  const getBookingsForToday = () => {
    const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const day = String(currentDate.getDate()).padStart(2, '0');

const today = `${year}-${month}-${day}`;
console.log(today); // Output: YYYY-MM-DD

    console.log(bookings.filter((booking) => booking.date.split("T")[0] === today));
    // console.log(bookings[1].date.split("T")[0]);
    return bookings.filter((booking) => booking.date.split("T")[0] === today);
  };

  const handleBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Restaurant Dashboard</h1>
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
        <div className="flex space-x-4 mb-6">
          {/* Summary Section */}
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.length > 0 ? (
            tables.map((table) => {
              const todayBookings = getBookingsForToday();
              const booking = todayBookings.find(
                (b) => b.tableNo === table.tableNo
              );

              return (
                <div
                  key={table._id}
                  className={`p-4 rounded-lg ${
                    booking ? "bg-green-100" : "bg-white"
                  } shadow`}
                >
                  <h3 className="text-lg font-semibold mb-2">Table-{table.tableNo}</h3>
                  {booking && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleBookingDetails(booking)}
                    >
                      Booking Details
                    </Button>
                  )}
                </div>
              );
            })
          ) : (
            <p>No tables available.</p>
          )}
        </div>
      </main>

      <Footer />

      {/* Booking Details Modal */}
      {selectedBooking && (
        <Modal open={modalOpen} onClose={closeModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: 2,
            }}
          >
            <h2 className="text-lg font-bold mb-2">Booking Details</h2>
            <p>
              <strong>Table:</strong> {selectedBooking.tableNo}
            </p>
            <p>
              <strong>Date:</strong> {new Date(selectedBooking.date).toDateString()}
            </p>
            <p>
              <strong>Time:</strong> {selectedBooking.time}
            </p>
            <p>
              <strong>Guest Name:</strong> {selectedBooking.guestName}
            </p>
            <Button
              onClick={closeModal}
              variant="contained"
              color="secondary"
              sx={{ mt: 2 }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      )}
    </div>
  );
}
