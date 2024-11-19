"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import jsPDF from "jspdf";
export default function Billing() {
  const [billingData, setBillingData] = useState([]);
  const [selectedBill, setSelectedBill] = useState(null);

  // Fetch room and billing data
  useEffect(() => {
    const fetchRoomsAndBillingData = async () => {
      try {
        // Step 1: Fetch all rooms
        const roomsResponse = await fetch("/api/rooms"); // Replace with your rooms API endpoint
        const roomsData = await roomsResponse.json();
//console.log(roomsData);
        if (roomsData.success) {
          // Step 2: Filter rooms where billingStarted is "Yes"
          const roomsWithBilling = roomsData.data.filter(
            (room) => room.billingStarted === "Yes"
          );
          console.log(roomsWithBilling[0].currentBillingId);

          // Step 3: Fetch billing details for each filtered room
          const billsPromises = roomsWithBilling.map(async (room) => {
            if (room.currentBillingId) {
              const billResponse = await fetch(
                `/api/Billing/${room.currentBillingId}` // Replace with your billing endpoint
              );
              const billData = await billResponse.json();
              //console.log(billData);
              return { ...billData.data };
            }
            return null;
          });

          // Step 4: Wait for all promises to resolve
          const bills = await Promise.all(billsPromises);
          console.log(bills[0]);
          // Filter out any null values and update state
          setBillingData(bills.filter((bill) => bill !== null));
        } else {
          console.error("Failed to fetch room data");
        }
      } catch (error) {
        console.error("Error fetching room and billing data:", error);
      }
    };

    fetchRoomsAndBillingData();
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
    doc.text(`Bill Start Date: ${new Date(bill.billStartDate).toLocaleDateString()}`, 10, 40);
    doc.text(`Bill End Date: ${new Date(bill.billEndDate).toLocaleDateString()}`, 10, 50);
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
            <thead className="bg-amber-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                  Room Number
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                  Guest
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                  Amount Paid in Advance
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                  Due Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {billingData.length > 0 ? (
                billingData.map((bill, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-amber-50 transition`}
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
                        className="px-4 py-2 bg-amber-600 text-white font-semibold rounded-md hover:bg-amber-700 transition"
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
          <div className="bg-white w-11/12 max-w-lg rounded-lg shadow-lg p-6 relative">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Bill Details
            </h2>
            <p>
              <strong>Room Number:</strong> {selectedBill.roomNo}
            </p>
            <p>
              <strong>Bill Start Date:</strong>{" "}
              {new Date(selectedBill.billStartDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Bill End Date:</strong>{" "}
              {new Date(selectedBill.billEndDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹{selectedBill.totalAmount}
            </p>
            <p>
              <strong>Amount Paid in Advance:</strong>{" "}
              ₹{selectedBill.amountAdvanced}
            </p>
            <p>
              <strong>Due Amount:</strong> ₹{selectedBill.dueAmount}
            </p>
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Itemized List:</h3>
              <ul className="list-disc list-inside">
                {selectedBill.itemList.map((item, index) => (
                  <li key={index}>
                    {item} - ₹{selectedBill.priceList[index] || 0}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                onClick={() => generatePDF(selectedBill)}
                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
              >
                Save as PDF
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
