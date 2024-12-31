"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { Button, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, TextField, Box } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export default function Billing() {
    const router = useRouter();
    const [billingData, setBillingData] = useState([]);
    const [originalBillingData, setOriginalBillingData] = useState([]);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchRoom, setSearchRoom] = useState("");
    const [searchGuest, setSearchGuest] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [roomsResponse, billingResponse, bookingResponse] = await Promise.all([
                    fetch("/api/rooms"),
                    fetch("/api/Billing"),
                    fetch("/api/NewBooking")
                ]);

                const [roomsResult, billingResult, bookingResult] = await Promise.all([
                    roomsResponse.json(),
                    billingResponse.json(),
                    bookingResponse.json()
                ]);

                if (roomsResult.success && billingResult.success && bookingResult.success) {
                    const billingsMap = new Map(
                        billingResult.data.map(bill => [bill._id, bill])
                    );
                    const bookingsMap = new Map(
                        bookingResult.data.map(booking => [booking._id, booking])
                    );

                    // Process and sort bills
                    const enrichedBills = roomsResult.data
                        .flatMap(room => {
                            if (!room.billWaitlist || room.billWaitlist.length === 0) return [];
                            return room.billWaitlist.map((billId, index) => {
                                const bill = billingsMap.get(billId);
                                if (!bill) return null;
                                const guestId = room.guestWaitlist[index];
                                const guest = bookingsMap.get(guestId);
                                return {
                                    ...bill,
                                    roomNo: room.number.toString(),
                                    guestName: guest ? guest.guestName : "N/A",
                                    currentBillingId: billId,
                                    // Adding timestamp for sorting (use createdAt if available, or default to current time)
                                    timestamp: bill.createdAt || new Date().toISOString()
                                };
                            });
                        })
                        .filter(Boolean)
                        // Sort by timestamp in descending order (newest first)
                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                    setBillingData(enrichedBills);
                    setOriginalBillingData(enrichedBills);
                } else {
                    console.error("Failed to fetch data");
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
        
        if (filterStatus !== "all") {
            result = result.filter(
                bill => bill.Bill_Paid === (filterStatus === "paid" ? "yes" : "no")
            );
        }
        if (searchRoom) {
            result = result.filter(bill =>
                bill.roomNo.toString().toLowerCase().includes(searchRoom.toLowerCase())
            );
        }
        if (searchGuest) {
            result = result.filter(bill =>
                bill.guestName.toLowerCase().includes(searchGuest.toLowerCase())
            );
        }
        
        // Maintain the sorting order even after filtering
        return result;
    }, [originalBillingData, filterStatus, searchRoom, searchGuest]);

    const handleViewBill = (bill) => {
        router.push(`/property/billing/guest-bill/${bill.currentBillingId}`);
    };

    return (
        <div className="min-h-screen bg-amber-50">
            <Navbar />
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                        <svg aria-hidden="true" className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span className="mt-4 text-gray-700">Loading Bills...</span>
                    </div>
                </div>
            )}

            <Box className="container mx-auto py-4 px-4" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Box className="flex justify-center space-x-4 mb-2" sx={{ width: '100%' }}>
                    <Button
                        variant="contained"
                        onClick={() => setFilterStatus("all")}
                        sx={{
                            backgroundColor: filterStatus === "all" ? "#28bfdb" : "#f5f5f5",
                            color: filterStatus === "all" ? "white" : "#28bfdb",
                            '&:hover': {
                                backgroundColor: filterStatus === "all" ? "#1e9ab8" : "#e0e0e0"
                            }
                        }}
                    >
                        All Bills
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setFilterStatus("unpaid")}
                        sx={{
                            backgroundColor: filterStatus === "unpaid" ? "#f24a23" : "#f5f5f5",
                            color: filterStatus === "unpaid" ? "white" : "#f24a23",
                            '&:hover': {
                                backgroundColor: filterStatus === "unpaid" ? "#d13a1a" : "#e0e0e0"
                            }
                        }}
                    >
                        Unpaid Bills
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => setFilterStatus("paid")}
                        sx={{
                            backgroundColor: filterStatus === "paid" ? "#1ebc1e" : "#f5f5f5",
                            color: filterStatus === "paid" ? "white" : "#1ebc1e",
                            '&:hover': {
                                backgroundColor: filterStatus === "paid" ? "#17a817" : "#e0e0e0"
                            }
                        }}
                    >
                        Paid Bills
                    </Button>
                </Box>

                <Box className="flex justify-center space-x-4 mb-2" sx={{ width: '100%', maxWidth: '800px' }}>
                    <TextField
                        label="Search by Room Number"
                        variant="outlined"
                        value={searchRoom}
                        onChange={(e) => setSearchRoom(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon color="action" />,
                            endAdornment: searchRoom && (
                                <ClearIcon
                                    color="action"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setSearchRoom('')}
                                />
                            )
                        }}
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
                        label="Search by Guest Name"
                        variant="outlined"
                        value={searchGuest}
                        onChange={(e) => setSearchGuest(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon color="action" />,
                            endAdornment: searchGuest && (
                                <ClearIcon
                                    color="action"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setSearchGuest('')}
                                />
                            )
                        }}
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

            <div className="container mx-auto py-4 px-4">
                <TableContainer component={Paper} sx={{ maxWidth: '80%', margin: '0 auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                                <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                                    Room Number
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                                    Guest
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                                    Total Amount
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                                    Amount Paid in Advance
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                                    Due Amount
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                                    Bill Status
                                </TableCell>
                                <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
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
                                            '& > td': {
                                                backgroundColor: 'white',
                                                textAlign: 'center'
                                            },
                                            background: `linear-gradient(
                                                to right,
                                                ${bill.Bill_Paid === 'yes' ? '#1ebc1e' : '#f24a23'} 5%,
                                                white 5%
                                            )`
                                        }}
                                    >
                                        <TableCell>{bill.roomNo || "N/A"}</TableCell>
                                        <TableCell>{bill.guestName || "N/A"}</TableCell>
                                        <TableCell>₹{bill.totalAmount || 0}</TableCell>
                                        <TableCell>₹{bill.amountAdvanced || 0}</TableCell>
                                        <TableCell>₹{bill.dueAmount || 0}</TableCell>
                                        <TableCell>
                                            {bill.Bill_Paid === 'yes' ? 'Paid' : 'Unpaid'}
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleViewBill(bill)}
                                                sx={{
                                                    backgroundColor: "#28bfdb",
                                                    '&:hover': {
                                                        backgroundColor: "#1e9ab8"
                                                    }
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
            <Footer />
        </div>
    );
}