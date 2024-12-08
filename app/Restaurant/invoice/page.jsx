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

const InvoicePage = () => {
  const [menu, setMenu] = useState();
  const [invoices, setInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null);
  const [printableInvoice, setPrintableInvoice] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menuResponse = await fetch("/api/menuItem");
        const menuData = await menuResponse.json();
        setMenu(menuData.data || []);
      }
      catch (error) {
        console.error("failed to fetch data", error);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("/api/restaurantinvoice");
        const data = await response.json();
        setInvoices(data.invoices);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/restaurantinvoice/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInvoices(invoices.filter((invoice) => invoice._id !== id));
      } else {
        console.error("Failed to delete invoice");
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
          setInvoices(updatedInvoices);
          setCurrentInvoice(null);
          setShowModal(false);
        } else {
          console.error("Failed to update invoice");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // Add new invoice
      setInvoices((prev) => [...prev, updatedInvoice]);
      setShowModal(false);
    }
  };

  const handleCancelModal = () => {
    setShowModal(false);
    setCurrentInvoice(null);
  };

  return (
    <div className="bg-amber-50 min-h-screen">
      <Navbar />
      <div className="p-4">
        <h1 className="text-3xl font-bold mb-4">Restaurant Invoices</h1>

        <Button
          variant="contained"
          color="primary"
          sx={{ mb: 2 }}
          onClick={() => {
            setCurrentInvoice(null);
            setShowModal(true);
          }}
        >
          Create Invoice
        </Button>


        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#164E63" }}>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Invoice No.
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Date
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Customer Name
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Total Amount
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  GST
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Payable Amount
                </TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice._id} sx={{ backgroundColor: "white" }}>
                  <TableCell sx={{ textAlign: "center" }}>
                    {invoice.invoiceno}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {new Date(invoice.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {invoice.custname}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {invoice.totalamt}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {invoice.gst}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {invoice.payableamt}
                  </TableCell>
                  <TableCell sx={{ textAlign: "center", display: "flex", gap: "8px", justifyContent: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(invoice)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDelete(invoice._id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handlePrintPreview(invoice)}
                    >
                      Print
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal for Create/Edit Invoice */}
        {showModal && (
          <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <CreateInvoicePage
                onInvoiceCreate={handleInvoiceSave}
                existingInvoice={currentInvoice}
                onCancel={handleCancelModal}
              />
            </div>
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
      <Footer />
    </div>
  );
};

export default InvoicePage;