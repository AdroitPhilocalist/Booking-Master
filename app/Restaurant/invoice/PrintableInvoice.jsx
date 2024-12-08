import React, { useState, useEffect } from 'react';
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
  Grid,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import RestaurantIcon from '@mui/icons-material/Restaurant';

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

const PrintableInvoice = ({ invoiceId }) => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        const response = await fetch(`/api/restaurantinvoice/${invoiceId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch invoice details');
        }
        const data = await response.json();
        setInvoice(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (invoiceId) {
      fetchInvoiceDetails();
    }
  }, [invoiceId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h6">Loading invoice details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h6" color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!invoice) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Typography variant="h6">No invoice found</Typography>
      </Box>
    );
  }

  // Prepare items with correct attributes for display
  const preparedItems = invoice.menuitem.map((item, index) => ({
    name: item,
    qty: invoice.quantity[index],
    rate: invoice.price[index],
    amount: invoice.quantity[index] * invoice.price[index]
  }));

  // Calculate subtotal from items
  const subtotal = preparedItems.reduce((total, item) => total + item.amount, 0);

  return (
    <>
      <style>{printStyles}</style>

      <Box
        id="printable-invoice"
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
          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <RestaurantIcon sx={{ fontSize: 40, mr: 2, color: '#00bcd4' }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#00bcd4' }}>
                Restaurant Name
              </Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#00bcd4' }}>
                Invoice
              </Typography>
              <Typography variant="body1" color="textSecondary">
                #{invoice.invoiceno}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2} sx={{ mb: 4 }}>
            <Grid item xs={6}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Bill To:</Typography>
              <Typography variant="body1">{invoice.custname}</Typography>
            </Grid>
            <Grid item xs={6} sx={{ textAlign: 'right' }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Invoice Date:</Typography>
              <Typography variant="body1">{new Date(invoice.date).toLocaleDateString()}</Typography>
              <Typography variant="body1" color="textSecondary">Time: {invoice.time}</Typography>
            </Grid>
          </Grid>

          <TableContainer component={Paper} elevation={0} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#00bcd4' }}>
                  <TableCell sx={{ color: 'white' }}>Item</TableCell>
                  <TableCell align="right" sx={{ color: 'white' }}>Quantity</TableCell>
                  <TableCell align="right" sx={{ color: 'white' }}>Rate</TableCell>
                  <TableCell align="right" sx={{ color: 'white' }}>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {preparedItems.map((item, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">{item.qty}</TableCell>
                    <TableCell align="right">₹{item.rate.toFixed(2)}</TableCell>
                    <TableCell align="right">₹{item.amount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Box sx={{ width: '250px' }}>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body1">Subtotal:</Typography>
                  <Typography variant="body1">GST:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>Total:</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography variant="body1">₹{subtotal.toFixed(2)}</Typography>
                  <Typography variant="body1">₹{invoice.gst.toFixed(2)}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>₹{invoice.payableamt.toFixed(2)}</Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body2" color="textSecondary" sx={{ mb: 2, textAlign: 'center' }}>
            Thank you for your business.
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
              Print Invoice
            </Button>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="caption" color="textSecondary">
              Invoice generated on {new Date().toLocaleString()}
            </Typography>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default PrintableInvoice;