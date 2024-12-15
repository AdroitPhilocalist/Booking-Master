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
  Chip, 
  Fade,
  Zoom
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';

export default function Billing() {
  const router = useRouter();
  const [billingData, setBillingData] = useState([]);
  const [originalBillingData, setOriginalBillingData] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchRoom, setSearchRoom] = useState("");
  const [searchGuest, setSearchGuest] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);
  // Fetch room and billing data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch billing data
        const billingResponse = await fetch("/api/Billing");
        const billingResult = await billingResponse.json();
        
        // Fetch booking data to match guest names
        const bookingResponse = await fetch("/api/NewBooking");
        const bookingResult = await bookingResponse.json();
        
        if (billingResult.success && bookingResult.success) {
          // Map guest names to bills based on room numbers
          const enrichedBills = billingResult.data.map(bill => {
            // Find the booking that includes this room number
            const matchingBooking = bookingResult.data.find(booking => 
              booking.roomNumbers.includes(parseInt(bill.roomNo))
            );
            
            // Return the bill with the guest name if found
            return { 
              ...bill, 
              guestName: matchingBooking ? matchingBooking.guestName : "N/A" 
            };
          });
          
          setBillingData(enrichedBills);
          setOriginalBillingData(enrichedBills);
        } else {
          console.error("Failed to fetch billing or booking data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, []);

  // Comprehensive filtering logic
  const filteredBillingData = useMemo(() => {
    let result = originalBillingData;

    // Status filter
    if (filterStatus !== "all") {
      result = result.filter(
        bill => bill.Bill_Paid === (filterStatus === "paid" ? "yes" : "no")
      );
    }

    // Room number filter
    if (searchRoom) {
      result = result.filter(bill => 
        bill.roomNo.toString().toLowerCase().includes(searchRoom.toLowerCase())
      );
    }

    // Guest name filter
    if (searchGuest) {
      result = result.filter(bill => 
        bill.guestName.toLowerCase().includes(searchGuest.toLowerCase())
      );
    }

    return result;
  }, [originalBillingData, filterStatus, searchRoom, searchGuest]);

  // Handle clearing all filters
  const clearAllFilters = () => {
    setFilterStatus("all");
    setSearchRoom("");
    setSearchGuest("");
  };

  // Function to handle viewing bill details
  const handleViewBill = (bill) => {
    router.push(`/property/billing/guest-bill/${bill._id}`);
  };

  // Track active filters
  useEffect(() => {
    const filters = [];
    if (filterStatus !== "all") filters.push(filterStatus);
    if (searchRoom) filters.push(`Room: ${searchRoom}`);
    if (searchGuest) filters.push(`Guest: ${searchGuest}`);
    setActiveFilters(filters);
  }, [filterStatus, searchRoom, searchGuest]);


  return (
    <div className="min-h-screen bg-amber-50">
      {/* Navigation */}
      <Navbar />
      {/* Filter Section */}
      <Box 
        className="container mx-auto py-6 px-4"
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 2 
        }}
      >
        {/* Status Filters */}
        <Box 
          className="flex justify-center space-x-4 mb-4"
          sx={{ width: '100%' }}
        >
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

        {/* Search Filters */}
        <Box 
          className="flex justify-center space-x-4 mb-4"
          sx={{ width: '100%', maxWidth: '800px' }}
        >
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
                '&:hover fieldset': { borderColor: '#28bfdb' },
                '&.Mui-focused fieldset': { borderColor: '#28bfdb' }
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
                '&:hover fieldset': { borderColor: '#28bfdb' },
                '&.Mui-focused fieldset': { borderColor: '#28bfdb' }
              }
            }}
          />
        </Box>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <Fade in={activeFilters.length > 0}>
            <Box 
              className="flex items-center justify-center space-x-2 mb-4"
              sx={{ width: '100%' }}
            >
              <FilterListIcon color="action" />
              {activeFilters.map((filter, index) => (
                <Zoom key={index} in={true}>
                  <Chip
                    label={filter}
                    onDelete={() => {
                      if (filter.startsWith("Room:")) setSearchRoom("");
                      else if (filter.startsWith("Guest:")) setSearchGuest("");
                      else setFilterStatus("all");
                    }}
                    color="primary"
                    variant="outlined"
                  />
                </Zoom>
              ))}
              {activeFilters.length > 1 && (
                <Button 
                  size="small" 
                  onClick={clearAllFilters}
                  sx={{ 
                    color: '#f24a23', 
                    textTransform: 'none',
                    '&:hover': { backgroundColor: 'rgba(242, 74, 35, 0.1)' }
                  }}
                >
                  Clear All
                </Button>
              )}
            </Box>
          </Fade>
        )}
      </Box>

      {/* Billing Table */}
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
                      background: `linear-gradient( to right, ${bill.Bill_Paid === 'yes' ? '#1ebc1e' : '#f24a23'} 5%, white 5% )`
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
                          '&:hover': { backgroundColor: "#1e9ab8" }
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
      {/* Footer */}
      <Footer />
    </div>
  );
}
