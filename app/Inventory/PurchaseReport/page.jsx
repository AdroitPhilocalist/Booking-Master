'use client';

import { useState, useEffect } from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

const PurchaseReportPage = () => {
  const [purchaseReports, setPurchaseReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);

  const [purchaseorderno, setPurchaseorderno] = useState("");
  const [purchasedate, setPurchasedate] = useState("");
  const [Invoiceno, setInvoiceno] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantityAmount, setQuantityAmount] = useState("");
  const [rate, setRate] = useState("");
  const [total, setTotal] = useState("");

  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, purchaseResponse] = await Promise.all([
          fetch("/api/InventoryList"),
          fetch("/api/stockreport"),
        ]);
        const itemsData = await itemsResponse.json();
        const purchaseData = await purchaseResponse.json();

        setItems(itemsData.items || []);
        if (purchaseResponse.ok) {
          const purchases = purchaseData.stockReports.filter(
            (report) => report.purorsell === "purchase"
          );
          setPurchaseReports(purchases);
          setFilteredReports(purchases);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        setError("Failed to fetch data");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (quantityAmount && rate && selectedItem) {
      const taxMultiplier = 1 + (selectedItem.tax / 100);
      const calculatedTotal = parseFloat(quantityAmount) * parseFloat(rate) * taxMultiplier;
      setTotal(calculatedTotal.toFixed(2));
    } else {
      setTotal("");
    }
  }, [quantityAmount, rate, selectedItem]);

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setPurchaseorderno("");
    setPurchasedate("");
    setInvoiceno("");
    setSelectedItem(null);
    setQuantityAmount("");
    setRate("");
    setTotal("");
    setIsModalOpen(false);
  };

  const handleItemChange = (itemId) => {
    const item = items.find((item) => item._id === itemId);
    setSelectedItem(item || null);
  };

  const handlePurchase = async () => {
    if (!purchaseorderno || !purchasedate || !Invoiceno || !selectedItem || 
      !quantityAmount || !rate) {
        toast.warn('🥲 Please fill in all fields!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      return;
    }
  
    if (!selectedItem) {
      setError("Please select an item");
      return;
    }
  
    const purchaseData = {
      purchaseorderno,
      name: selectedItem._id,
      purchasedate: new Date(purchasedate),
      Invoiceno,
      quantity: selectedItem._id,
      quantityAmount: parseFloat(quantityAmount),
      unit: selectedItem._id,
      rate: parseFloat(rate),
      taxpercent: selectedItem._id,
      total: parseFloat(total),
      purorsell: "purchase",
    };
  
    try {
      const response = await fetch("/api/stockreport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        await updateStockQuantity(
          selectedItem._id,
          parseFloat(quantityAmount),
          selectedItem.stock
        );
        setPurchaseReports((prevReports) => [...prevReports, result.stockReport]);
        handleCloseModal();
  
        // Show success toast with onClose callback to reload the page
        toast.success('👍 Item Purchased Successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => window.location.reload()
        });
      } else {
        setError(result.error || "Failed to save purchase report");
        toast.error('👎 Failed to save purchase report', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error saving purchase report:", error);
      setError("Error saving purchase report");
    }
  };


  const updateStockQuantity = async (itemId, quantityAmount, currentStock) => {
    try {
      const newStock = currentStock + quantityAmount;
      const response = await fetch(`/api/InventoryList/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: newStock }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error("Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  };

  // Filter Function
  const filterByDate = () => {
    if (startDate && endDate) {
      const filtered = purchaseReports.filter((report) => {
        const purchaseDate = new Date(report.purchasedate);
        return (
          purchaseDate >= new Date(startDate) &&
          purchaseDate <= new Date(endDate)
        );
      });
      setFilteredReports(filtered);
    } else {
      setFilteredReports(purchaseReports); // Show all reports if no dates are selected
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-amber-50 min-h-screen">
      <Navbar />
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
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Purchase Report</h1>
          <Button
            variant="contained"
            color="success"
            onClick={() => setIsModalOpen(true)}
          >
            Purchase Stock
          </Button>
        </div>

        <div className="flex space-x-4 mb-6">
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full"
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={filterByDate}
            className="ml-4"
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setFilteredReports(purchaseReports); // Reset to show all reports
            }}
            className="ml-4"
          >
            Reset
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#164E63" }}>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Purchase No</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Item Name</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Purchase Date</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Invoice No</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Available Quantity</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Unit</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Rate</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Tax Percent</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <TableRow key={report._id} sx={{ backgroundColor: "#BBF7D0" }}>
                    <TableCell sx={{ textAlign: "center" }}>{report.purchaseorderno}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{report.name?.name}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {(() => {
                        const date = new Date(report.purchasedate);
                        const day = String(date.getDate()).padStart(2, "0");
                        const month = String(date.getMonth() + 1).padStart(2, "0");
                        const year = date.getFullYear();
                        return `${day}/${month}/${year}`;
                      })()}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{report.Invoiceno}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{report.quantity?.stock}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{report.unit?.quantityUnit}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{report.rate}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{report.taxpercent?.tax}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{report.total}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No Purchase reports available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

        </TableContainer>
      </div>


      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 w-1/2 shadow-md max-h-[90%] overflow-y-auto"
          sx={{ borderRadius: 2 }}
        >
          <h2 className="text-xl font-bold mb-4">New Purchase</h2>
          <form className="space-y-4">
            <TextField
              required
              id="purchaseorderno"
              label="Purchase Order No"
              variant="outlined"
              value={purchaseorderno}
              onChange={(e) => setPurchaseorderno(e.target.value)}
              className="w-full"
            />
            <TextField
              required
              id="purchasedate"
              label="Purchase Date"
              variant="outlined"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={purchasedate}
              onChange={(e) => setPurchasedate(e.target.value)}
              className="w-full"
            />
            <TextField
              required
              id="Invoiceno"
              label="Invoice No"
              variant="outlined"
              value={Invoiceno}
              onChange={(e) => setInvoiceno(e.target.value)}
              className="w-full"
            />
            <TextField
              required
              select
              id="itemname"
              variant="outlined"
              value={selectedItem?._id || ''}
              onChange={(e) => handleItemChange(e.target.value)}
              className="w-full"
              SelectProps={{
                native: true,
              }}
            >
              <option value="">Select Item</option>
              {items.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </TextField>
            <TextField
              required
              id="unit"
              label="Unit"
              variant="outlined"
              value={selectedItem?.quantityUnit || ''}
              disabled
              className="w-full"
            />
            <TextField
              required
              id="stock"
              label="Current Stock"
              variant="outlined"
              value={selectedItem?.stock || ''}
              disabled
              className="w-full"
            />
            <TextField
              required
              id="quantityAmount"
              label="Purchase Quantity"
              variant="outlined"
              type="number"
              value={quantityAmount}
              onChange={(e) => setQuantityAmount(e.target.value)}
              className="w-full"
            />
            <TextField
              required
              id="rate"
              label="Rate"
              variant="outlined"
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full"
            />
            <TextField
              required
              id="taxpercent"
              label="Tax Percent"
              variant="outlined"
              value={selectedItem?.tax || ''}
              disabled
              className="w-full"
            />
            <TextField
              required
              id="total"
              label="Total"
              variant="outlined"
              value={total}
              disabled
              className="w-full"
            />
            <div className="flex justify-end">
              <Button
                variant="contained"
                sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}
                onClick={handlePurchase}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: 'red',
                  borderColor: 'red',
                  '&:hover': {
                    borderColor: 'darkred',
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                  },
                }}
                onClick={handleCloseModal}
                className="ml-4"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      <Footer />
    </div>
  );
};

export default PurchaseReportPage;