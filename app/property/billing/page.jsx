"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import {
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TextField,
  Box,
} from "@mui/material";
import axios from "axios";
import { getCookie } from "cookies-next"; // Import getCookie from cookies-next
import { jwtVerify } from "jose"; // Import jwtVerify for decoding JWT

export default function Billing() {
  const router = useRouter();
  const [billingData, setBillingData] = useState([]);
  const [originalBillingData, setOriginalBillingData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchRoom, setSearchRoom] = useState("");
  const [searchGuest, setSearchGuest] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const authtoken = getCookie("authToken"); // Get the token from cookies
        if (!authtoken) {
          router.push("/"); // Redirect to login if no token is found
          return;
        }
        // Verify the token
        const decoded = await jwtVerify(
          authtoken,
          new TextEncoder().encode(SECRET_KEY)
        );
        const userId = decoded.payload.id;
        // Fetch the profile by userId to get the username
        const profileResponse = await fetch(`/api/Profile/${userId}`);
        const profileData = await profileResponse.json();
        // console.log(profileData);
        if (!profileData.success || !profileData.data) {
          router.push("/"); // Redirect to login if profile not found
          return;
        }
        const username = profileData.data.username;
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("authToken="))
          .split("=")[1];
        const headers = { Authorization: `Bearer ${token}` };

        const [roomsResponse, billingResponse, bookingResponse] =
          await Promise.all([
            axios.get(`/api/rooms?username=${username}`, { headers }),
            axios.get(`/api/Billing?username=${username}`, { headers }),
            axios.get(`/api/NewBooking?username=${username}`, { headers }),
          ]);

        const roomsResult = roomsResponse.data.data;
        const billingResult = billingResponse.data.data;
        const bookingResult = bookingResponse.data.data;
        console.log(billingResult);
        console.log("Rooms Result : ", roomsResult);

        const billingsMap = new Map(
          billingResult.map((bill) => [bill._id, bill])
        );
        const bookingsMap = new Map(
          bookingResult.map((booking) => [booking._id, booking])
        );
        console.log("Billings Map : ", billingsMap);
        console.log("Bookings Map : ", bookingsMap);
        // Process and sort bills
        // Keep your existing enrichedBills code up to here…
        const enrichedBills = roomsResult
          .flatMap((room) => {
            if (!room.billWaitlist || room.billWaitlist.length === 0) return [];
            return room.billWaitlist.map((billId, index) => {
              const bill = billingsMap.get(billId._id);
              if (!bill) return null;
              const guestId = room.guestWaitlist[index];
              const guest = bookingsMap.get(guestId._id);
              return {
                bill, // the billing document
                guestId: guestId._id, // Unique Guest ID
                roomNo: room.number.toString(), // individual room number
                guestName: guest ? guest.guestName : "N/A",
                bookingId: guest ? guest.bookingId : "N/A",
                checkInDate: guest ? guest.checkIn : null,
                currentBillingId: billId._id,
                timestamp: bill.createdAt || new Date().toISOString(),
              };
            });
          })
          .filter(Boolean)
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const groupedBills = enrichedBills.reduce((acc, cur) => {
          const key = cur.guestId; // Use Guest ID as the grouping key
          if (!acc[key]) {
            acc[key] = { ...cur, roomNo: [cur.roomNo] };
          } else {
            acc[key].roomNo.push(cur.roomNo);
          }
          return acc;
        }, {});

        const mergedBillings = Object.values(groupedBills);

        // Update state with consolidated billing records
        setBillingData(mergedBillings);
        setOriginalBillingData(mergedBillings);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBillingData = useMemo(() => {
    let result = originalBillingData;

    if (filterStatus !== "all") {
      if (
        ["Booked", "Checked In", "Checked Out", "Cancelled"].includes(
          filterStatus
        )
      ) {
        // Existing date-based filtering logic
        result = result.filter((bill) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const checkIn = new Date(bill.checkInDate);
          const checkOut = new Date(bill.checkOutDate);
          checkIn.setHours(0, 0, 0, 0);

          if (filterStatus === "Cancelled") {
            return bill.bill.Cancelled === "yes";
          } else if (filterStatus === "Booked") {
            return today < checkIn && bill.bill.Cancelled !== "yes";
          } else if (filterStatus === "Checked In") {
            return (
              today.toISOString() === checkIn.toISOString() &&
              bill.bill.Cancelled !== "yes"
            );
          } else if (filterStatus === "Checked Out") {
            return today > checkOut && bill.bill.Cancelled !== "yes";
          }
          return false;
        });
      } else {
        // Modified payment status filtering to exclude cancelled bills
        result = result.filter(
          (bill) =>
            bill.bill.Bill_Paid.toLowerCase() === filterStatus &&
            bill.bill.Cancelled !== "yes" // Add this condition
        );
      }
    }

    // Existing search filters
    if (searchRoom) {
      result = result.filter((bill) =>
        bill.roomNo.toString().toLowerCase().includes(searchRoom.toLowerCase())
      );
    }
    if (searchGuest) {
      result = result.filter(
        (bill) =>
          bill.guestName.toLowerCase().includes(searchGuest.toLowerCase()) ||
          bill.guestId.includes(searchGuest) // Search by Guest ID
      );
    }
    return result;
  }, [originalBillingData, filterStatus, searchRoom, searchGuest]);

  const handleViewBill = (bill) => {
    router.push(`/property/billing/guest-bill/${bill.currentBillingId}`);
  };

  // Updated Guest Status function to include Cancelled status
  const getGuestStatus = (bill) => {
    if (bill.bill.Cancelled === "yes") {
      return "Cancelled";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkIn = new Date(bill.bill.checkInDate);
    checkIn.setHours(0, 0, 0, 0);

    if (today < checkIn) {
      return "Booked";
    } else if (today.toLocaleDateString('en-GB') === checkIn.toLocaleDateString('en-GB')) {
      return "Checked In";
    } else if (bill.bill.Bill_Paid === "yes") {
      return "Checked Out";
    }
    return "Staying";
  };

  // Updated Bill Status function
  const getBillStatus = (bill) => {
    if (bill.bill.Cancelled === "yes") {
      return "Cancelled";
    }
    return bill.bill.Bill_Paid === "yes" ? "Paid" : "Unpaid";
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-amber-50">
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
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
              <span className="mt-4 text-gray-700">Loading Bills...</span>
            </div>
          </div>
        )}

        {/* Filter and Search Controls */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 2,
            justifyContent: "center",
            pt: 4,
          }}
        >
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <Button
              variant={filterStatus === "all" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setFilterStatus("all")}
            >
              All
            </Button>
            <Button
              variant={filterStatus === "yes" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setFilterStatus("yes")}
            >
              Paid
            </Button>
            <Button
              variant={filterStatus === "no" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setFilterStatus("no")}
            >
              UnPaid
            </Button>
            <Button
              variant={filterStatus === "Booked" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setFilterStatus("Booked")}
            >
              Booked
            </Button>
            <Button
              variant={filterStatus === "Checked In" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setFilterStatus("Checked In")}
            >
              Checked In
            </Button>
            <Button
              variant={
                filterStatus === "Checked Out" ? "contained" : "outlined"
              }
              color="primary"
              onClick={() => setFilterStatus("Checked Out")}
            >
              Checked Out
            </Button>
            <Button
              variant={filterStatus === "Cancelled" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setFilterStatus("Cancelled")}
            >
              Cancelled
            </Button>
          </Box>
        </Box>
        <div className="container mx-auto py-4 px-4">
          <TableContainer
            component={Paper}
            sx={{ maxWidth: "80%", margin: "0 auto" }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#28bfdb",
                      textAlign: "center",
                    }}
                  >
                    Booking ID
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#28bfdb",
                      textAlign: "center",
                    }}
                  >
                    Room Number
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#28bfdb",
                      textAlign: "center",
                    }}
                  >
                    Guest
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#28bfdb",
                      textAlign: "center",
                    }}
                  >
                    Total Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#28bfdb",
                      textAlign: "center",
                    }}
                  >
                    Amount Paid in Advance
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#28bfdb",
                      textAlign: "center",
                    }}
                  >
                    Due Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#28bfdb",
                      textAlign: "center",
                    }}
                  >
                    Bill Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#28bfdb",
                      textAlign: "center",
                    }}
                  >
                    Guest Status
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: "#28bfdb",
                      textAlign: "center",
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBillingData.length > 0 ? (
                  filteredBillingData.map((bill, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "& > td": {
                          backgroundColor: "white",
                          textAlign: "center",
                        },
                        background: `linear-gradient(to right, ${bill.bill.Cancelled === "yes"
                          ? "#808080"
                          : bill.bill.Bill_Paid === "yes"
                            ? "#1ebc1e"
                            : "#f24a23"
                          } 5%, white 5%)`,
                      }}
                    >
                      <TableCell>{bill.bookingId || "N/A"}</TableCell>
                      <TableCell>
                        {console.log("Bill : ", bill)}
                        {Array.isArray(bill.bill.roomNo)
                          ? bill.bill.roomNo.join(", ")
                          : bill.bill.roomNo || "N/A"}   
                      </TableCell>

                      <TableCell>{bill.guestName || "N/A"}</TableCell>
                      <TableCell>₹{bill.bill.totalAmount || 0}</TableCell>
                      <TableCell>₹{bill.bill.amountAdvanced || 0}</TableCell>
                      <TableCell>₹{bill.bill.dueAmount || 0}</TableCell>
                      <TableCell>{getGuestStatus(bill)}</TableCell>
                      <TableCell>{getBillStatus(bill)}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          onClick={() => handleViewBill(bill)}
                          sx={{
                            backgroundColor: "#28bfdb",
                            "&:hover": { backgroundColor: "#1e9ab8" },
                          }}
                        >
                          View Bill
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No billing records available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <Footer />
    </div>
  );
}
