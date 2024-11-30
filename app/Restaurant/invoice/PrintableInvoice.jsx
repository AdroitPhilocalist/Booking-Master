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

const PrintableInvoice = ({ invoice }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Box sx={{ p: 4, maxWidth: '800px', margin: 'auto', bgcolor: '#f5f5f5', borderRadius: 2 }}>
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
              #{invoice.id}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={6}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Bill To:</Typography>
            <Typography variant="body1">{invoice.customerName}</Typography>
            <Typography variant="body2" color="textSecondary">{invoice.customerAddress}</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Invoice Date:</Typography>
            <Typography variant="body1">{invoice.date}</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 2 }}>Due Date:</Typography>
            <Typography variant="body1">{invoice.dueDate}</Typography>
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
              {invoice.items.map((item, index) => (
                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">{item.qty}</TableCell>
                  <TableCell align="right">${item.rate.toFixed(2)}</TableCell>
                  <TableCell align="right">${item.amount.toFixed(2)}</TableCell>
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
                <Typography variant="body1">GST ({invoice.gstRate}%):</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>Total:</Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="body1">${invoice.totalAmount.toFixed(2)}</Typography>
                <Typography variant="body1">${invoice.gst.toFixed(2)}</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 1 }}>${invoice.payableAmount.toFixed(2)}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Thank you for your business. Please pay within {invoice.paymentTerms} days.
        </Typography>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{
              bgcolor: '#00bcd4',
              '&:hover': { bgcolor: '#00acc1' }
            }}
          >
            Print Invoice
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default PrintableInvoice;