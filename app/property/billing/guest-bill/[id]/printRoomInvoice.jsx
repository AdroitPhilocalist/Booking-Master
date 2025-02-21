import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Divider, Grid
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import HotelIcon from '@mui/icons-material/Hotel';
import axios from 'axios';
import { getCookie } from "cookies-next"; // Import getCookie from cookies-next
import { jwtVerify } from "jose"; // Import jwtVerify for decoding JWT

// Add print-specific styles
const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }

    #printable-invoice,
    #printable-invoice * {
      visibility: visible;
    }

    #printable-invoice {
      position: absolute;
      left: 0;
      top: 0;
      background: white !important;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }

    body {
      background: white !important;
    }
  }
`;

const PrintableRoomInvoice = ({ billId }) => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serviceItems, setServiceItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("authToken="))
          .split("=")[1];
        const headers = { Authorization: `Bearer ${token}` };
        console.log('billId', billId);
        // 1. First fetch billing details
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
        const [billingResponse, profileResponse] = await Promise.all([
          fetch(`/api/Billing/${billId}`),
          fetch(`/api/Profile/${userId}`)
        ]);
        console.log('billingResponse', billingResponse);
        if (!billingResponse.ok || !profileResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        const [billing, profileData] = await Promise.all([
          billingResponse.json(),
          profileResponse.json()
        ]);
        const billingData = billing.data;
        console.log('billingData', billingData);
        // Set payment status
        setIsPaid(billingData.Bill_Paid?.toLowerCase() === 'yes');
        // Set cancellation status
        setIsCancelled(billingData.Cancelled?.toLowerCase() === 'yes');
        // 2. Fetch and find matched room
        const roomsResponse = await fetch("/api/rooms");
        const roomsData = await roomsResponse.json();
        console.log('roomsData', roomsData.data);
        const matchedRooms = roomsData.data.filter((room) =>
          billingData.roomNo.includes(String(room.number))
        );

        console.log('matchedRooms', matchedRooms);

        if (!matchedRooms) {
          throw new Error("No matching room found");
        }

        // Fetch bookings
        const newBookingsResponse = await axios.get("/api/NewBooking", {
          headers,
        });
        // Find bookings for all rooms
        const matchedBookings = await Promise.all(matchedRooms.map(async (room) => {
          if (billingData.Bill_Paid === "yes" || billingData.Cancelled === "yes") {
            const currentBillIndex = room.billWaitlist.findIndex(
              (billId) => billId._id.toString() === billingData._id.toString()
            );

            if (currentBillIndex === -1) {
              return null;
            }

            const correspondingGuestId = room.guestWaitlist[currentBillIndex];
            return newBookingsResponse.data.data.find(
              (booking) => booking._id === correspondingGuestId._id.toString()
            );
          } else {
            return newBookingsResponse.data.data.find(
              (booking) => booking._id === room.currentGuestId
            );
          }
        }));

        console.log('matchedBookings', matchedBookings);

        if (!matchedBookings) {
          throw new Error("No matching booking found");
        }

        // Filter out duplicates and null values
        const uniqueBookings = Array.from(
          new Set(matchedBookings.filter(booking => booking).map(JSON.stringify))
        ).map(JSON.parse);
        console.log("uniqueBookings", uniqueBookings);

        // Fetch room categories
        const roomCategoriesResponse = await axios.get("/api/roomCategories", {
          headers,
        });

        // Get categories for all matched rooms
        const matchedCategories = matchedRooms.map(room =>
          roomCategoriesResponse.data.data.find(
            category => category._id === room.category._id
          )
        );

        // Fetch menu items for comparison
        const menuResponse = await axios.get("/api/menuItem", { headers });
        const menuItemsList = menuResponse.data.data;

        // Fetch billing details
        console.log("billingData", billingData.itemList);

        // Process existing items
        const existingServices = billingData.itemList || [];
        const existingPrices = billingData.priceList || [];
        const existingTaxes = billingData.taxList || [];
        const existingQuantities = billingData.quantityList || [];

        const serviceItemsArray = [];

        existingServices.forEach((roomServices, roomIndex) => {
          const roomPrices = existingPrices[roomIndex] || [];
          const roomTaxes = existingTaxes[roomIndex] || [];
          const roomQuantities = existingQuantities[roomIndex] || [];

          roomServices.forEach((item, itemIndex) => {
            const itemDetails = {
              name: item,
              price: roomPrices[itemIndex] || 0,
              quantity: roomQuantities[itemIndex] || 1,
              tax: roomTaxes[itemIndex] || 0,
              roomIndex: roomIndex,
            };
            if (item === "Room Charge") {
              serviceItemsArray.push(itemDetails);
            }
          });
        });
        setServiceItems(serviceItemsArray);
        console.log("serviceItemsArray", serviceItemsArray);

        setBookingData({
          billing: billingData,
          booking: uniqueBookings[0],
          room: matchedRooms,
          category: matchedCategories,
        });
        setProfile(profileData.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching invoice data:", err);
      }
    };

    if (billId) {
      fetchInvoiceData();
    }
  }, [billId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
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
        <span className="mt-4 text-gray-700">Loading Room Invoice...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h6" color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!bookingData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h6">No invoice found</Typography>
      </Box>
    );
  }

  const { booking, billing, room, category, services } = bookingData;
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString('en-GB');
  const formattedTime = currentDate.toLocaleTimeString();

  const totalServicesAmount = serviceItems.reduce((total, service) => total + service.price, 0);
  console.log('totalServicesAmount', totalServicesAmount);
  const serviceTax = serviceItems.reduce((tax, service) => tax + service.tax, 0);
  console.log('serviceTax', serviceTax);

  return (
    <>
      <style>{printStyles}</style>
      <Box id="printable-invoice" sx={{ p: 4, maxWidth: '800px', margin: 'auto', bgcolor: '#f5f5f5', borderRadius: 2, maxHeight: '90vh', overflowY: 'auto', overflowX: 'hidden' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HotelIcon sx={{ fontSize: 40, mr: 2, color: '#00bcd4' }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#00bcd4' }}>
                  {profile.hotelName}
                </Typography>
              </Box>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                {profile.addressLine1 || 'N/A'}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                {profile.addressLine2 || 'N/A'}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                {profile.district || 'N/A'}, {profile.country} - {profile.pincode || 'N/A'}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                Phone: {profile.mobileNo}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                Email: {profile.email}
              </Typography>
              {profile.website && (
                <Typography variant="body2" color="textSecondary">
                  Website: {profile.website}
                </Typography>
              )}
              <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                GST No: {profile.gstNo || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#00bcd4' }}>
                Room Invoice
              </Typography>
              <Typography variant="body1" color="textSecondary">
                #{booking.bookingId}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Guest Details */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Guest Details:</Typography>
              <Typography variant="body1">{booking.guestName}</Typography>
              <Typography variant="body2" color="textSecondary">
                Phone: +91 {booking.mobileNo}
              </Typography>
              <Typography variant="body1">Customer GST No.: {booking.gstin}</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Invoice Date:</Typography>
              <Typography variant="body1">{formattedDate}</Typography>
              <Typography variant="body1" color="textSecondary">
                Time: {formattedTime}
              </Typography>
            </Grid>
          </Grid>

          {/* Room Details Table */}
          <TableContainer component={Paper} elevation={0} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#00bcd4' }}>
                  <TableCell align="left" sx={{ color: 'white' }}>Date</TableCell>
                  <TableCell align='center' sx={{ color: 'white' }}>Room Details</TableCell>
                  <TableCell align='center' sx={{ color: 'white' }}>Room Tax</TableCell>
                  <TableCell align="right" sx={{ color: 'white' }}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billing.roomNo.map((roomNumber, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(bookingData.booking.checkIn).toLocaleDateString("en-GB")}</TableCell>
                    <TableCell align="center">
                      Room #{roomNumber} - {bookingData.room[index].category.category}
                    </TableCell>
                    <TableCell align="center">{billing.taxList[index][0].toFixed(2)}%</TableCell>
                    <TableCell align="right">₹{billing.priceList[index][0].toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Total Calculation */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Box sx={{ width: '250px' }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body1">Room Tax:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>Total:</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="body1">{serviceTax}%</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                    ₹{totalServicesAmount.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Paid Image */}
          {isPaid && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <img
                src="/paid.png"
                alt="Paid"
                style={{
                  width: '250px',
                  height: 'auto',
                  opacity: 0.8
                }}
              />
            </Box>
          )}

          {/* Cancelled Image */}
          {isCancelled && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <img
                src="/cancelled.png"
                alt="Cancelled"
                style={{
                  width: '250px',
                  height: 'auto',
                  opacity: 0.8
                }}
              />
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" color="textSecondary" sx={{ mb: 2, textAlign: 'center' }}>
            Thank you for your stay.
          </Typography>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              sx={{
                bgcolor: '#00bcd4',
                '&:hover': { bgcolor: '#00acc1' },
              }}
            >
              Print Room Invoice
            </Button>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              Invoice generated on {formattedDate} at {formattedTime}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default PrintableRoomInvoice;