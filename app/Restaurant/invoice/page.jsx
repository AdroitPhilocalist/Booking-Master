"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CreateInvoicePage from "./createinvoice/page";
import Navbar from '@/app/_components/Navbar'
import { Footer } from '@/app/_components/Footer'
import PrintableInvoice from './PrintableInvoice'; // Import the PrintableInvoice component
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from "@mui/material/Box";
import { IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';



const InvoicePage = () => {
  const [menu, setMenu] = useState();
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [printableInvoice, setPrintableInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Date filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const router = useRouter();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const menuResponse = await fetch("/api/menuItem");
        const menuData = await menuResponse.json();
        setMenu(menuData.data || []);
      }
      catch (error) {
        console.error("failed to fetch data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("/api/restaurantinvoice");
        const data = await response.json();
        // Sort invoices by date in descending order (newest first)
        const sortedInvoices = data.invoices.sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        setInvoices(sortedInvoices);
        setFilteredInvoices(sortedInvoices);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInvoices();
  }, []);

 // Modify the filter function to maintain the sort order
 const filterByDate = () => {
  if (startDate && endDate) {
    const filtered = invoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.date);
      return (
        invoiceDate >= new Date(startDate) && 
        invoiceDate <= new Date(endDate)
      );
    }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Keep newest first
    setFilteredInvoices(filtered);
  } else {
    setFilteredInvoices([...invoices]); // Show all invoices sorted
  }
};

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/restaurantinvoice/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedInvoices = invoices.filter((invoice) => invoice._id !== id);
        setInvoices(updatedInvoices);
        setFilteredInvoices(updatedInvoices);
        toast.success("Invoice deleted successfully");
      } else {
        console.error("Failed to delete invoice");
        toast.success("Failed to delete invoice");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (invoice) => {
    setCurrentInvoice(invoice);
    setShowModal(true);
  };

  const handlePrintPreview = (invoice) => {
    setPrintableInvoice(invoice);
    setShowPrintModal(true);
  };

  const handleInvoiceSave = async (updatedInvoice) => {
    if (currentInvoice) {
      // Update (PUT request)
      try {
        const response = await fetch(`/api/restaurantinvoice/${currentInvoice._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedInvoice),
        });
        if (response.ok) {
          const updatedInvoices = invoices.map((invoice) =>
            invoice._id === currentInvoice._id ? updatedInvoice : invoice
          );
          // Sort after updating
          const sortedInvoices = updatedInvoices.sort((a, b) => 
            new Date(b.date) - new Date(a.date)
          );
          setInvoices(sortedInvoices);
          setFilteredInvoices(sortedInvoices);
          setCurrentInvoice(null);
          setShowModal(false);
          toast.success("Invoice updated successfully");
        } else {
          console.error("Failed to update invoice");
          toast.error("Failed to update invoice");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // Add new invoice
      const newInvoices = [updatedInvoice, ...invoices]; // Add new invoice at the beginning
      setInvoices(newInvoices);
      setFilteredInvoices(newInvoices);
      setShowModal(false);
    }
    
  };

  const handleCancelModal = () => {
    setShowModal(false);
    setCurrentInvoice(null);
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
            <span className="mt-4 text-gray-700">Loading Restaurant Invoices...</span>
          </div>
        </div>
      )}
      <div className="p-4 ">
        {/* Header */}
        <h1 className="text-3xl font-bold text-cyan-900 mb-4" style={{ maxWidth: '80%', margin: '0 auto' }}>
          Restaurant Invoices
        </h1>

        {/* Controls Container */}
        <Box sx={{
          maxWidth: '80%',
          margin: '0 auto',
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Empty div for left alignment */}
          <div style={{ flex: 1 }}></div>

          {/* Center - Date filters */}
          <Box sx={{
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            flex: '2',
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
          </Box>

          {/* Right - Create Invoice button */}
          <Box sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            flex: 1
          }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setCurrentInvoice(null);
                setShowModal(true);
              }}
              sx={{
                minWidth: '150px',
                height: '40px'
              }}
            >
              Create Invoice
            </Button>
          </Box>
        </Box>

        <Box sx={{ maxWidth: "80%", margin: "0 auto", overflowX: "auto" }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                    Invoice ID.
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                    Date
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
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((invoice) => (
                    <TableRow key={invoice._id} sx={{ backgroundColor: "white" }}>
                      <TableCell sx={{ textAlign: "center" }}>{invoice.invoiceno}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {(() => {
                          const date = new Date(invoice.date);
                          const day = String(date.getDate()).padStart(2, "0");
                          const month = String(date.getMonth() + 1).padStart(2, "0");
                          const year = date.getFullYear();
                          return `${day}/${month}/${year}`;
                        })()}
                      </TableCell>
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
                      <TableCell
                        sx={{
                          textAlign: "center",
                          display: "flex",
                          gap: "8px",
                          justifyContent: "center",
                        }}
                      >
                        {/* <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(invoice)}
                        >
                          Edit
                        </Button> */}
                        <IconButton
                          color="primary"
                          onClick={() => handleEdit(invoice)}
                        >
                          <Edit />
                        </IconButton>
                        {/* <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(invoice._id)}
                        >
                          Delete
                        </Button> */}
                        <IconButton
                          color="secondary"
                          onClick={() => handleDelete(invoice._id)}
                        >
                          <Delete />
                        </IconButton>
                        {/* <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          onClick={() => handlePrintPreview(invoice)}
                        >
                          Print
                        </Button> */}
                        <IconButton
                          color="secondary"
                          onClick={() => handlePrintPreview(invoice)}
                        >
                          <PrintOutlinedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No invoices available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Modal for Create/Edit Invoice */}
        {showModal && (
          <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">

            <CreateInvoicePage
              onInvoiceCreate={handleInvoiceSave}
              existingInvoice={currentInvoice}
              onCancel={handleCancelModal}
            />

          </div>
        )}

        {showPrintModal && printableInvoice && (
          <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-end mb-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => {
                    setShowPrintModal(false);
                    setPrintableInvoice(null);
                  }}
                >
                  Close
                </button>
              </div>
              <PrintableInvoice
                invoiceId={printableInvoice._id}
              />
            </div>
          </div>
        )}
      </div>
      
    </div>
    <Footer />
   </div>
  );
};

export default InvoicePage;