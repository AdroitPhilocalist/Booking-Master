"use client";
import React, { useState, useEffect, useRef } from "react";
import Navbar from '../../_components/Navbar';
import { Footer } from '../../_components/Footer';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/restaurantinvoice");
        const data = await response.json();
        setInvoices(data.invoices);
        setFilteredInvoices(data.invoices);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const filterByDate = () => {
    if (startDate && endDate) {
      const filtered = invoices.filter((invoice) => {
        const invoiceDate = new Date(invoice.date);
        return (
          invoiceDate >= new Date(startDate) &&
          invoiceDate <= new Date(endDate)
        );
      });
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoices);
    }
  };

  const printTable = () => {
    if (!tableRef.current) return;
    const tableHTML = tableRef.current.outerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
      <html>
        <head>
          <title>Stock Report</title>
          <style>
            table { width: 100%; border-collapse: collapse; }
            table, th, td { border: 1px solid black; }
            th, td { padding: 8px; text-align: center; }
          </style>
        </head>
        <body>
          ${tableHTML}
        </body>
      </html>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  return (
    <div>
      <Navbar />
      <div className="bg-amber-50 min-h-screen">
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
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
            <span className="mt-4 text-gray-700">Loading Restaurant Reports ...</span>
          </div>
        </div>
      )}
      <div className="p-4">
        <h1 className="text-3xl font-bold text-cyan-900 mb-4" style={{ maxWidth: '80%', margin: '0 auto' }}>
          Restaurant Report
        </h1>

        <Box sx={{
          maxWidth: '80%',
          margin: '0 auto',
          mb: 3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Box sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TextField
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              sx={{ width: '160px' }}
              size="small"
            />
            <TextField
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              sx={{ width: '160px' }}
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={filterByDate}
              sx={{ height: '40px' }}
            >
              Filter
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setFilteredInvoices(invoices);
              }}
              sx={{ height: '40px' }}
            >
              Reset
            </Button>
             <Button 
            variant="contained" 
            onClick={printTable}
            size="small"
            sx={{
              backgroundColor: 'orange',
              '&:hover': {
                backgroundColor: 'darkorange',
              },
            }}
          >
            Download/Export
          </Button>
          </Box>
        </Box>

        <Box sx={{ maxWidth: "80%", margin: "0 auto", overflowX: "auto" }}>
          {startDate && endDate ? (
            <TableContainer component={Paper}>
              <Table ref={tableRef}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                      Invoice No.
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                      Customer Name
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                      Total Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                      GST
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                      Payable Amount
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredInvoices.length > 0 ? (
                    <>
                      {filteredInvoices.map((invoice) => (
                        <TableRow key={invoice._id} sx={{ backgroundColor: "white" }}>
                          <TableCell sx={{ textAlign: "center" }}>{invoice.invoiceno}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>{invoice.custname}</TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {invoice.totalamt.toFixed(2)}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {invoice.gst.toFixed(2)}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {invoice.payableamt.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell colSpan={2} sx={{ fontWeight: "bold", textAlign: "right" }}>
                          Totals:
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                          {filteredInvoices.reduce((sum, invoice) => sum + invoice.totalamt, 0).toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                          {filteredInvoices.reduce((sum, invoice) => sum + invoice.gst, 0).toFixed(2)}
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                          {filteredInvoices.reduce((sum, invoice) => sum + invoice.payableamt, 0).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    </>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No invoices found for the selected date range.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="h6" sx={{ textAlign: "center", color: "gray", mt: 4 }}>
              Please select both start and end dates to view the invoice data.
            </Typography>
          )}
        </Box>
      </div>
      
    </div>
    <Footer />
    </div>
  );
};

export default InvoicePage;