'use client'
import React, { useState, useEffect } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Divider, Grid } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import RestaurantIcon from '@mui/icons-material/Restaurant';

// Add print-specific styles
const printStyles = `
  @media print {
    body * {
      visibility: hidden;
    }
    #printable-service-invoice, #printable-service-invoice * {
      visibility: visible;
    }
    #printable-service-invoice {
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

const PrintableServiceInvoice = ({ billId }) => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);
    const [profile, setProfile] = useState(null);
    const [services, setServices] = useState([]);
    const [isPaid, setIsPaid] = useState(false);

    useEffect(() => {
        const fetchInvoiceData = async () => {
            try {
                // 1. First fetch billing details
                const [billingResponse, profileResponse] = await Promise.all([
                    fetch(`/api/Billing/${billId}`),
                    fetch('/api/Profile')
                ]);
                if (!billingResponse.ok || !profileResponse.ok) {
                    throw new Error('Failed to fetch data');
                }
                const [billingData, profileData] = await Promise.all([
                    billingResponse.json(),
                    profileResponse.json()
                ]);

                const billing = billingData.data;
                // Set payment status
                setIsPaid(billing.Bill_Paid?.toLowerCase() === 'yes');

                // 2. Fetch booking details using room number from billing
                const bookingsResponse = await fetch('/api/NewBooking');
                const bookingsData = await bookingsResponse.json();
                const roomsResponse = await fetch('/api/rooms');
                const roomsData = await roomsResponse.json();

                // Find the room and then the booking
                const matchedRoom = roomsData.data.find(room => room.number === billing.roomNo);
                let booking;

                if (billing.Bill_Paid?.toLowerCase() === 'yes') {
                    // For paid bills, find the booking using billWaitlist
                    const billIndex = matchedRoom.billWaitlist.findIndex(
                        billId => billId.toString() === billing._id.toString()
                    );

                    if (billIndex === -1) {
                        throw new Error('Billing ID not found in room\'s billWaitlist');
                    }

                    // Get the corresponding guest ID from guestWaitlist
                    const guestId = matchedRoom.guestWaitlist[billIndex];

                    // Find the booking that matches this guest ID
                    booking = bookingsData.data.find(b => b._id === guestId);
                } else {
                    // For unpaid bills, use currentGuestId
                    booking = bookingsData.data.find(b => b._id === matchedRoom.currentGuestId);
                }



                // 3. Process services from billing data
                const serviceItems = [];
                billing.itemList.forEach((item, index) => {
                    if (item !== 'Room Charge') {
                        serviceItems.push({
                            name: item,
                            quantity: billing.quantityList[index] || 1,
                            tax: billing.taxList[index] || 0,
                            price: billing.priceList[index] || 0
                        });
                    }
                });

                setServices(serviceItems);
                setInvoiceData({ billing, booking });
                setProfile(profileData.data[0]);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchInvoiceData();
    }, [billId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                <svg aria-hidden="true" className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="mt-4 text-gray-700">Loading Invoice...</span>
            </div>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );
    }

    const { booking, billing } = invoiceData;
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB');
    const formattedTime = currentDate.toLocaleTimeString();

    // Calculate total services amount
    const totalServicesAmount = services.reduce((total, service) => total + service.price, 0);
    const serviceTax = services.reduce((tax, service) => tax + service.tax, 0);

    return (
        <>
            <style>{printStyles}</style>
            <Box id="printable-invoice" sx={{ p: 4, maxWidth: '800px', margin: 'auto', bgcolor: '#f5f5f5', borderRadius: 2, maxHeight: '90vh', overflowY: 'auto', overflowX: 'hidden' }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <RestaurantIcon sx={{ fontSize: 40, mr: 2, color: '#00bcd4' }} />
                                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#00bcd4' }}>
                                    {profile.hotelName}
                                </Typography>
                            </Box>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                {profile.addressLine1}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                {profile.addressLine2}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5 }}>
                                {profile.district}, {profile.country} - {profile.pincode}
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
                                GST No: {profile.gstNo}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#00bcd4' }}>
                                Service Invoice
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

                    {/* Services Table */}
                    <TableContainer component={Paper} elevation={0} sx={{ mb: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#00bcd4' }}>
                                    <TableCell sx={{ color: 'white' }}>Service</TableCell>
                                    <TableCell align="center" sx={{ color: 'white' }}>Quantity</TableCell>
                                    <TableCell align="center" sx={{ color: 'white' }}>Tax(%)</TableCell>
                                    <TableCell align="right" sx={{ color: 'white' }}>Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {services.map((service, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{service.name}</TableCell>
                                        <TableCell align="center">{service.quantity}</TableCell>
                                        <TableCell align="center">{service.tax}</TableCell>
                                        <TableCell align="right">₹{service.price.toFixed(2)}</TableCell>
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
                                    <Typography variant="body1">IGST:</Typography>
                                    <Typography variant="body1">CGST:</Typography>
                                    <Typography variant="body1">SGST:</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>Total:</Typography>
                                </Grid>
                                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                    <Typography variant="body1">{serviceTax.toFixed(2)}%</Typography>
                                    <Typography variant="body1">{(serviceTax / 2).toFixed(2)}%</Typography>
                                    <Typography variant="body1">{(serviceTax / 2).toFixed(2)}%</Typography>
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
                    <Divider sx={{ my: 3 }} />

                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2, textAlign: 'center' }}>
                        Thank you for using our services.
                    </Typography>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <Button
                            variant="contained"
                            startIcon={<PrintIcon />}
                            onClick={handlePrint}
                            sx={{ bgcolor: '#00bcd4', '&:hover': { bgcolor: '#00acc1' } }}
                        >
                            Print Service Invoice
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

export default PrintableServiceInvoice;