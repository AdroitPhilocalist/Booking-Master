"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";
import Snackbar from "@mui/material/Snackbar";


import jsPDF from "jspdf";
import { FaTrashAlt } from "react-icons/fa";
export default function Billing() {
  const [billingData, setBillingData] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [amountToBePaid, setAmountToBePaid] = useState(0);
  const openPaymentModal = () => setIsPaymentModalOpen(true);
  const closePaymentModal = () => setIsPaymentModalOpen(false);
  const [openDueDialog, setOpenDueDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  // Fetch room and billing data
  useEffect(() => {
    const fetchUnpaidBillingData = async () => {
      try {
        // Step 1: Fetch all unpaid bills directly
        const response = await fetch("/api/Billing"); // Assuming this endpoint filters by Bill_Paid
        const billingData = await response.json();

        if (billingData.success) {
          // Step 2: Filter the bills with Bill_Paid === "No"
          const unpaidBills = billingData.data.filter(
            (bill) => bill.Bill_Paid === "no"
          );
          setBillingData(unpaidBills);
        } else {
          console.error("Failed to fetch unpaid billing data");
        }
      } catch (error) {
        console.error("Error fetching unpaid billing data:", error);
      }
    };

    fetchUnpaidBillingData();
  }, []);

  // Function to handle viewing bill details
  const handleViewBill = (bill) => {
    setSelectedBill(bill); // Set the selected bill for modal display
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedBill(null);
  };
  const generatePDF = (bill) => {
    const doc = new jsPDF();

    // Add content to the PDF
    doc.setFontSize(18);
    doc.text("Bill Details", 10, 10);

    // Add bill information
    doc.setFontSize(12);
    doc.text(`Room Number: ${bill.roomNo || "N/A"}`, 10, 20);
    doc.text(`Guest Name: ${bill.guestName || "N/A"}`, 10, 30);
    doc.text(
      `Bill Start Date: ${new Date(bill.billStartDate).toLocaleDateString()}`,
      10,
      40
    );
    doc.text(
      `Bill End Date: ${new Date(bill.billEndDate).toLocaleDateString()}`,
      10,
      50
    );
    doc.text(`Total Amount: ₹${bill.totalAmount || 0}`, 10, 60);
    doc.text(`Amount Paid in Advance: ₹${bill.amountAdvanced || 0}`, 10, 70);
    doc.text(`Due Amount: ₹${bill.dueAmount || 0}`, 10, 80);

    // Add itemized list
    doc.text("Itemized List:", 10, 90);
    bill.itemList.forEach((item, index) => {
      doc.text(
        `${index + 1}. ${item} - ₹${bill.priceList[index] || 0}`,
        10,
        100 + index * 10
      );
    });

    // Save the PDF
    doc.save(`Bill_${bill.roomNo || "Unknown"}.pdf`);
  };

  const openEditModal = () => {
    setShowEditModal(true);
  };

  // Function to close the Edit Bill modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setNewItem("");
    setNewPrice("");
  };

  const handlePayment = async (e) => {

    const newAmountAdvanced =
      selectedBill.amountAdvanced + parseFloat(amountToBePaid);
    console.log(newAmountAdvanced);

    if (newAmountAdvanced > selectedBill.totalAmount) {
      alert("Payment exceeds the total amount due!");
      return;
    }

    try {
      // Prepare the payload for updating the bill
      const payload = {
        amountAdvanced: newAmountAdvanced,
      };
      console.log(newAmountAdvanced);
      console.log(payload);

      // Update the bill via API
      const response = await fetch(`/api/Billing/${selectedBill._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        setSelectedBill(result.data);
        alert("Payment updated successfully!");
        closePaymentModal();
      } else {
        alert("Failed to update payment: " + result.error);
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      alert("An error occurred while processing the payment.");
    }
  };
  const markBillAsPaid = async () => {
    try {
      if (!selectedBill) {
        alert("No bill selected!");
        return;
      }
      if (selectedBill.dueAmount > 0) {
        setOpenDueDialog(true); // Show the dialog if there is still a due amount
        return;
      }

      // Prepare the payload
      const payload = { Bill_Paid: 'yes' };

      // Make the API call
      const response = await fetch(`/api/Billing/${selectedBill._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log(result);
      if (result.success) {
        alert("Bill marked as paid!");
        // Update the local state with the updated bill data
        setSelectedBill(result.data);
      } else {
        alert("Failed to update bill: " + result.error);
      }
    } catch (error) {
      console.error("Error updating bill:", error);
      alert("An error occurred while updating the bill.");
    }
  };
  const handleCloseDialog = () => setOpenDueDialog(false);



  // Function to add new item to the bill
  const handleAddItem = async () => {
    if (newItem.trim() && newPrice.trim()) {
      try {
        // Prepare the payload with only the new item and price
        const payload = {
          itemList: [newItem],
          priceList: [parseFloat(newPrice)],
        };

        // Call the API
        const response = await fetch(`/api/Billing/${selectedBill._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (result.success) {
          // Update the selectedBill state with the new data
          setSelectedBill(result.data);
          alert("Item added successfully!");
          closeEditModal(); // Close the modal
        } else {
          alert("Failed to update bill: " + result.error);
        }
      } catch (error) {
        console.error("Error updating bill:", error);
        alert("An error occurred while updating the bill.");
      }
    } else {
      alert("Please provide valid item name and price.");
    }
  };
  const handleDeleteItem = async (index) => {
    try {
      // Create updated lists by removing the item at the given index
      const updatedItemList = selectedBill.itemList.filter(
        (_, idx) => idx !== index
      );
      const updatedPriceList = selectedBill.priceList.filter(
        (_, idx) => idx !== index
      );

      // Prepare the payload with the updated item list and price list
      const payload = {
        itemList: updatedItemList,
        priceList: updatedPriceList,
      };

      // Call the PATCH API to update the bill with the new lists
      const response = await fetch(`/api/Billing/${selectedBill._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        // Update the selectedBill state with the updated data from the response
        setSelectedBill(result.data); // Replace the entire bill with the updated one
        alert("Item deleted successfully!");
      } else {
        alert("Failed to delete item: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("An error occurred while deleting the item.");
    }
  };

  const calculateTotal = (priceList) => {
    // Recalculate the total price from the updated priceList
    return priceList.reduce((total, price) => total + price, 0);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Navigation */}
      <Navbar />

      {/* Billing Table */}
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-semibold text-center mb-8 text-gray-700">
          Current Billing Information
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
            <thead className="bg-cyan-800">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider border-b">
                  Room Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider border-b">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider border-b">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider border-b">
                  Amount Paid in Advance
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider border-b">
                  Due Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-white uppercase tracking-wider border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {billingData.length > 0 ? (
                billingData.map((bill, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-white transition`}
                  >
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      {bill.roomNo || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      {bill.guestName || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      ₹{bill.totalAmount || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      ₹{bill.amountAdvanced || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 border-b">
                      ₹{bill.dueAmount || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-center border-b">
                      <button
                        onClick={() => handleViewBill(bill)}
                        className="px-4 py-2 bg-cyan-600 text-white font-semibold rounded-md hover:bg-cyan-700 transition"
                      >
                        View Bill
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500 border-b"
                  >
                    No current billing records available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal for Viewing Bill Details */}
      {selectedBill && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 max-w-5xl rounded-lg shadow-lg p-8 relative">
            <div className="border border-gray-200 p-6 rounded-lg bg-gray-50">
              {/* Guest Details Section */}
              <h2 className="text-2xl font-semibold text-gray-700 mb-6">
                {selectedBill.guestName || "Guest Name"}
              </h2>
              <div className="grid grid-cols-2 gap-6">
                <p>
                  <strong>Check-In:</strong>{" "}
                  {new Date(selectedBill.billStartDate).toLocaleString()}
                </p>
                <p>
                  <strong>Expected Check-Out:</strong>{" "}
                  {new Date(selectedBill.billEndDate).toLocaleString()}
                </p>
                <p>
                  <strong>Room Number:</strong> {selectedBill.roomNo || "N/A"}
                </p>
                <p>
                  <strong>Meal Plan:</strong> {selectedBill.mealPlan || "N/A"}
                </p>
                <p>
                  <strong>Amount Paid:</strong> ₹
                  {selectedBill.amountAdvanced || 0}
                </p>
                <p>
                  <strong>Due Amount:</strong> ₹{selectedBill.dueAmount || 0}
                </p>
                <p>
                  <strong>Total Amount:</strong> ₹
                  {selectedBill.totalAmount || 0}
                </p>
              </div>

              {/* Itemized List Section */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-2">Itemized List:</h3>
                <ul className="list-disc list-inside">
                  {selectedBill.itemList.map((item, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {item} - ₹{selectedBill.priceList[index] || 0}
                      </span>
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteItem(index)}
                      >
                        <FaTrashAlt /> {/* Delete icon */}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="mt-9 flex justify-between gap-1">
                <button
                  onClick={() => console.log("Food button clicked")}
                  className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition"
                >
                  Food
                </button>
                <button
                  onClick={openEditModal}
                  className="px-6 py-3 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 transition"
                >
                  Add Item
                </button>
                <button
                  onClick={() => generatePDF(selectedBill)}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                >
                  Create Invoice
                </button>
                <button
                  onClick={markBillAsPaid}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
                >
                  Bill Paid
                </button>
                <button
                  onClick={openPaymentModal}
                  className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
                >
                  Bill Payment
                </button>
                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Bill Payment</h3>

            {/* Total Amount */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Total Amount:</label>
              <input
                type="text"
                value={selectedBill.totalAmount}
                readOnly
                className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-800"
              />
            </div>

            {/* Due Amount */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Due Amount:</label>
              <input
                type="text"
                value={selectedBill.dueAmount - amountToBePaid}
                readOnly
                className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-800"
              />
            </div>

            {/* Amount to Be Paid */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Amount to Be Paid:</label>
              <input
                type="number"
                value={amountToBePaid}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value < 0) {
                    setSnackbarMessage("Amount cannot be negative!");
                    setSnackbarOpen(true);
                  } else if (value > selectedBill?.dueAmount) {
                    setSnackbarMessage("Amount cannot exceed the due amount!");
                    setSnackbarOpen(true);
                  } else {
                    setAmountToBePaid(value);
                  }
                }}
                className="w-full px-4 py-2 border rounded-md"
              />
            </div>

            {/* Snackbar for validation messages */}
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={4000}
              onClose={() => setSnackbarOpen(false)}
              message={snackbarMessage}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              action={
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => setSnackbarOpen(false)}
                >
                  Close
                </Button>
              }
            />
            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={closePaymentModal}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Pay
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Bill Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-11/12 max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Edit Bill
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Item Name
              </label>
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
                placeholder="Enter item name"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Item Price
              </label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
                placeholder="Enter item price"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleAddItem}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
              >
                Add Item
              </button>
              <button
                onClick={closeEditModal}
                className="px-6 py-3 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Due Amount Dialog */}
      <Dialog open={openDueDialog} onClose={handleCloseDialog}>
        <DialogTitle>Bill Payment Alert</DialogTitle>
        <DialogContent>
          <Typography variant="body1" color="error" align="center">
            <ErrorOutline fontSize="large" />
            <br />
            💸 There is still a due amount of ₹{selectedBill?.dueAmount}. Please pay the full amount before marking the bill as paid! 💰
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Footer */}
      <Footer />
    </div>
  );
}
