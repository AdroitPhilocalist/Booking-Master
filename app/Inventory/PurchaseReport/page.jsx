'use client'

import { useState, useEffect } from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

const PurchaseReportPage = () => {
  const [purchaseReports, setPurchaseReports] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [purchaseorderno, setPurchaseorderno] = useState("");
  const [purchasedate, setPurchasedate] = useState("");
  const [invoiceno, setInvoiceno] = useState("");
  const [itemname, setItemname] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState("");
  const [rate, setRate] = useState("");
  const [taxpercent, setTaxpercent] = useState("");
  const [total, setTotal] = useState("");

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
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (quantity && rate && taxpercent) {
      const taxMultiplier = 1 + parseFloat(taxpercent) / 100;
      const calculatedTotal = parseFloat(quantity) * parseFloat(rate) * taxMultiplier;
      setTotal(calculatedTotal.toFixed(2)); 
    } else {
      setTotal(""); 
    }
  }, [quantity, rate, taxpercent]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setPurchaseorderno("");
    setPurchasedate("");
    setInvoiceno("");
    setItemname("");
    setUnit("");
    setQuantity("");
    setRate("");
    setTaxpercent("");
    setTotal("");
    setIsModalOpen(false);
  };

  const handlePurchase = async () => {
    const purchaseData = {
      purchaseorderno,
      purchasedate,
      invoiceno,
      name: itemname,
      unit,
      quantityAmount: quantity,  // Quantity taken from the field, as quantityAmount
      rate,
      taxpercent,
      total,
      purorsell: "purchase",
    };

    console.log("Sending data to API:", purchaseData); // Log the payload for debugging

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
        console.log("Purchase report saved:", result);
        // Update stock based on the new quantityAmount
        await updateStockQuantity(itemname, quantity);
        setPurchaseReports((prevReports) => [...prevReports, result.stockReport]);
      } else {
        setError(result.error || "Failed to save purchase report");
      }
    } catch (error) {
      console.error("Error saving purchase report:", error);
      setError("Error saving purchase report");
    }

    handleCloseModal();
  };

  const handleItemChange = (itemId) => {
    setItemname(itemId);
    const selectedItem = items.find((item) => item._id === itemId);
    if (selectedItem) {
      setTaxpercent(selectedItem.tax || "");
      setUnit(selectedItem.quantityUnit || "");
    }
  };

  const updateStockQuantity = async (itemId, quantityAmount) => {
    try {
      // Make an API call to update the stock in InventoryList
      const response = await fetch(`/api/InventoryList/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: quantityAmount,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Stock updated:", result);
      } else {
        console.error("Failed to update stock:", result);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="bg-amber-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Purchase Report</h1>
          <Button
            variant="contained"
            color="success"
            onClick={handleOpenModal}
          >
            Purchase Stock
          </Button>
        </div>

        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-cyan-900 text-white">
              <th className="border border-gray-300 px-4 py-2">Purchase No</th>
              <th className="border border-gray-300 px-4 py-2">Item Name</th>
              <th className="border border-gray-300 px-4 py-2">Purchase Date</th>
              <th className="border border-gray-300 px-4 py-2">Invoice No</th>
              <th className="border border-gray-300 px-4 py-2">Available Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Unit</th>
              <th className="border border-gray-300 px-4 py-2">Rate</th>
              <th className="border border-gray-300 px-4 py-2">Tax Percent</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {purchaseReports.length > 0 ? (
              purchaseReports.map((report) => (
                <tr key={report._id} className="bg-green-200">
                  <td className="border border-gray-300 px-10 py-2">
                    {report.purchaseorderno}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {report.name?.name}
                  </td>
                  <td className="border border-gray-300 px-8 py-2">
                    {new Date(report.purchasedate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 px-8 py-2">
                    {report.Invoiceno}
                  </td>
                  <td className="border border-gray-300 px-20 py-2">
                    {report.quantity?.stock}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {report.unit?.quantityUnit}
                  </td>
                  <td className="border border-gray-300 px-6 py-2">
                    {report.rate}
                  </td>
                  <td className="border border-gray-300 px-16 py-2">
                    {report.taxpercent?.tax}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {report.total}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  No purchase reports available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
              id="invoiceno"
              label="Invoice No"
              variant="outlined"
              value={invoiceno}
              onChange={(e) => setInvoiceno(e.target.value)}
              className="w-full"
            />
            <TextField
              required
              select
              id="itemname"
              label="Item Name"
              variant="outlined"
              value={itemname}
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
              value={unit}
              disabled
              className="w-full"
            />
            <TextField
              required
              id="quantity"
              label="Quantity"
              variant="outlined"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
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
              type="number"
              value={taxpercent}
              onChange={(e) => setTaxpercent(e.target.value)}
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
                color="primary"
                onClick={handlePurchase}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCloseModal}
                className="ml-2"
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
