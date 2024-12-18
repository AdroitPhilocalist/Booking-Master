import React from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Divider,
    Grid
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Image from 'next/image';


// Add print-specific styles
const printStyles = ` 
@media print { 
    body * { visibility: hidden; } 
    #printable-service-invoice, #printable-service-invoice * { visibility: visible; } 
    #printable-service-invoice { 
        position: absolute; 
        left: 0; 
        top: 0; 
        background: white !important; 
        print-color-adjust: exact; 
        -webkit-print-color-adjust: exact; 
    } 
    body { background: white !important; } 
} `;

const PrintableServiceInvoice = ({ bookingDetails, isPaymentComplete }) => {
    const handlePrint = () => {
        window.print();
    };

    // Get current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB');
    const formattedTime = currentDate.toLocaleTimeString();

    if (!bookingDetails) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography variant="h6">No booking details found</Typography>
            </Box>
        );
    }

    const { booking, billing, services } = bookingDetails;

    // Calculate total services amount
    const totalServicesAmount = services.filter(service => service.name !== `Room Charge`).reduce((total, service) => total + service.price, 0);
    const serviceTax = services.filter(service => service.name !== `Room Charge`).reduce((tax, service) => tax + service.tax, 0);
    const totalWithTax = totalServicesAmount * (1 + serviceTax);

    return (
        <>
            <style>{printStyles}</style>
            <Box
                id="printable-service-invoice"
                sx={{
                    p: 4,
                    maxWidth: '800px',
                    margin: 'auto',
                    bgcolor: '#f5f5f5',
                    borderRadius: 2,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}
            >
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    {/* Header */}
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                        <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
                            <RestaurantIcon sx={{ fontSize: 40, mr: 2, color: '#00bcd4' }} />
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#00bcd4' }}>
                                Hotel Services
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
                                    <TableCell align="right" sx={{ color: 'white' }}>Tax(%)</TableCell>
                                    <TableCell align="right" sx={{ color: 'white' }}>Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {services.filter(service => service.name !== `Room Charge`).map((service, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{service.name}</TableCell>
                                        <TableCell align="right">
                                            {(service.tax)}
                                        </TableCell>
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
                                    <Typography variant="body1">Total Tax(%):</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>Total:</Typography>
                                </Grid>
                                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                                    <Typography variant="body1">
                                        {serviceTax}%
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>
                                        ₹{(totalServicesAmount).toFixed(2)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>

                    {/* Paid Image - Only show when payment is complete */}
                    {isPaymentComplete && (
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mt: 2,
                            mb: 2
                        }}>
                            <Image
                                src="/paid.png"
                                alt="Paid"
                                width={200}
                                height={100}
                                style={{ maxWidth: '100%', height: 'auto' }}
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
                            sx={{
                                bgcolor: '#00bcd4',
                                '&:hover': { bgcolor: '#00acc1' },
                            }}
                        >
                            Print Service Invoice
                        </Button>
                    </Box>

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Typography variant="caption" color="textSecondary">
                            Invoice generated on {currentDate.toLocaleDateString('en-GB')} at {currentDate.toLocaleTimeString()}
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </>
    );
};

export default PrintableServiceInvoice;