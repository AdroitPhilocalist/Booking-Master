"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { getCookie } from 'cookies-next'; // Import getCookie from cookies-next
import { jwtVerify } from 'jose'; // Import jwtVerify for decoding JWT
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, TextField, Box } from "@mui/material";

export default function Billing() {
  const router = useRouter();
  const [billingData, setBillingData] = useState([]);
  const [originalBillingData, setOriginalBillingData] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = getCookie('authToken');
        const usertoken = getCookie("userAuthToken");
        if (!token && !usertoken) {
          router.push("/"); // Redirect to login if no token is found
          return;
        }

        let decoded, userId;
        if (token) {
          // Verify the authToken (legacy check)
          decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
          userId = decoded.payload.id;
        }
        if (usertoken) {
          // Verify the userAuthToken
          decoded = await jwtVerify(usertoken, new TextEncoder().encode(SECRET_KEY));
          userId = decoded.payload.profileId; // Use userId from the new token structure
        }

        // Fetch the profile by userId to get the username
        const profileResponse = await fetch(`/api/Profile/${userId}`);
        const profileData = await profileResponse.json();
        console.log(profileData);
        if (!profileData.success || !profileData.data) {
          router.push('/'); // Redirect to login if profile not found
          return;
        }
        const username = profileData.data.username;
        const [roomsResponse, billingResponse, bookingResponse] = await Promise.all([
          fetch(`/api/rooms?username=${username}`),
          fetch(`/api/Billing?username=${username}`),
          fetch(`/api/NewBooking?username=${username}`)
        ]);

        const [roomsResult, billingResult, bookingResult] = await Promise.all([
          roomsResponse.json(),
          billingResponse.json(),
          bookingResponse.json()
        ]);

        console.log(roomsResult, billingResult, bookingResult);

        if (roomsResult.success && billingResult.success && bookingResult.success) {
          const billingsMap = new Map(
            billingResult.data.map(bill => [bill._id, bill])
          );

          const bookingsMap = new Map(
            bookingResult.data.map(booking => [booking._id, booking])
          );

          const enrichedBills = roomsResult.data.flatMap(room => {
            if (!room.billWaitlist || room.billWaitlist.length === 0) return [];

            return room.billWaitlist.map((billId, index) => {
              const bill = billingsMap.get(billId._id);
              console.log(bill);
              if (!bill) return null;

              const guestId = room.guestWaitlist[index];
              const guest = bookingsMap.get(guestId._id);

              return {
                ...bill,
                roomNo: room.number.toString(),
                guestName: guest ? guest.guestName : "N/A",
                date: bill.date || new Date().toISOString().split('T')[0]
              };
            });
          }).filter(Boolean);

          setBillingData(enrichedBills);
          setOriginalBillingData(enrichedBills);
        }
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

    if (startDate && endDate) {
      result = result.filter(bill => {
        const billDate = new Date(bill.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return billDate >= start && billDate <= end;
      });
    }

    return result;
  }, [originalBillingData, startDate, endDate]);

  const totals = useMemo(() => {
    return filteredBillingData.reduce((acc, bill) => ({
      totalAmount: acc.totalAmount + (bill.totalAmount || 0),
      totalAdvanced: acc.totalAdvanced + (bill.amountAdvanced || 0),
      totalDue: acc.totalDue + (bill.dueAmount || 0)
    }), { totalAmount: 0, totalAdvanced: 0, totalDue: 0 });
  }, [filteredBillingData]);

  const shouldShowTable = startDate && endDate;

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <svg aria-hidden="true" className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="mt-4 text-gray-700">Loading Room Report...</span>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-cyan-900 mb-4" style={{ maxWidth: '80%', margin: '0 auto' }}>
        Room Report
      </h1>
      <Box className="container mx-auto py-4 px-4" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Box className="flex justify-center space-x-4 mb-2" sx={{ width: '100%', maxWidth: '800px' }}>
          <TextField
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#28bfdb'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#28bfdb'
                }
              }
            }}
          />
          <TextField
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': {
                  borderColor: '#28bfdb'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#28bfdb'
                }
              }
            }}
          />
        </Box>
      </Box>

      {shouldShowTable && (
        <div className="container mx-auto py-4 px-4">
          <TableContainer component={Paper} sx={{ maxWidth: '80%', margin: '0 auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Room Number</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Guest</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Total Amount</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Amount Paid in Advance</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Due Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBillingData.length > 0 ? (
                  <>
                    {filteredBillingData.map((bill, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ textAlign: 'center' }}>{bill.date}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>{bill.roomNo || "N/A"}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>{bill.guestName || "N/A"}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>₹{bill.totalAmount || 0}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>₹{bill.amountAdvanced || 0}</TableCell>
                        <TableCell sx={{ textAlign: 'center' }}>₹{bill.dueAmount || 0}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold" }}>
                      <TableCell colSpan={3} sx={{ textAlign: 'right', fontWeight: "bold" }}>Totals:</TableCell>
                      <TableCell sx={{ textAlign: 'center', fontWeight: "bold" }}>₹{totals.totalAmount}</TableCell>
                      <TableCell sx={{ textAlign: 'center', fontWeight: "bold" }}>₹{totals.totalAdvanced}</TableCell>
                      <TableCell sx={{ textAlign: 'center', fontWeight: "bold" }}>₹{totals.totalDue}</TableCell>
                    </TableRow>
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No records available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
      <Footer />
    </div>
  );
}