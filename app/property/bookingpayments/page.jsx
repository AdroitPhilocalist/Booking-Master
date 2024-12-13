import React from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";

const BookingDashboard = () => {
  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <div className="p-6">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
          {/* Header */}
          <h2 className="text-xl font-semibold text-gray-800">
            Booking Dashboard <span className="text-gray-500">(BX202AE2B057C56)</span>
          </h2>

          {/* Booking Information */}
          <div className="mt-4 bg-blue-100 p-4 rounded">
            <p className="text-lg font-semibold">
              PINKI SINGHA <span className="text-sm text-green-700 bg-green-100 px-2 py-1 rounded">Posting On</span>
            </p>
            <p className="mt-2 text-sm text-gray-700">
              Check-In: <strong>02 Dec 2024 10:42 AM</strong> | Expected Check-Out:{" "}
              <strong>03 Dec 2024 09:30 AM</strong> | Phone No: <strong>Hidden</strong>
            </p>
            <p className="mt-1 text-sm text-gray-700">
              Booking Point: <strong>GANESH</strong> | Booked By: <strong>GANESH</strong> | Booking Type: <strong>FIT</strong> | Booking Source: <strong>Walk-In</strong>
            </p>
            <p className="mt-1 text-sm text-gray-700">
              Booked On: <strong>02 Dec 2024</strong> | PAX: <strong>1 Adult 0 Child</strong> | Meal Plan: <strong>EP</strong> | Notes: <strong>-</strong>
            </p>
          </div>

          {/* Rooms Booked */}
          <div className="mt-6 bg-blue-50 p-4 rounded">
            <h3 className="font-semibold text-gray-800">Rooms Booked</h3>
            <p className="text-sm text-gray-700">02 Dec 2024 (Mon) (1) &raquo; 304</p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { label: "Booking Slip", color: "bg-blue-500", textColor: "text-white" },
              { label: "GRC", color: "bg-yellow-400", textColor: "text-gray-900" },
              { label: "Food KOT", color: "bg-green-500", textColor: "text-white" },
              { label: "Extra Charges", color: "bg-red-500", textColor: "text-white" },
              { label: "Package", color: "bg-purple-500", textColor: "text-white" },
              { label: "Room Tariff", color: "bg-orange-400", textColor: "text-gray-900" },
              { label: "Edit Booking", color: "bg-pink-500", textColor: "text-white" },
              { label: "Refund", color: "bg-teal-500", textColor: "text-white" },
              { label: "Payment", color: "bg-green-600", textColor: "text-white" },
              { label: "Create Invoice", color: "bg-blue-700", textColor: "text-white" },
            ].map((btn, index) => (
              <button
                key={index}
                className={`py-2 px-4 rounded ${btn.color} ${btn.textColor} text-sm font-medium`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Billing Summary */}
          <div className="mt-6 bg-green-200 p-4 rounded">
            <h3 className="font-semibold text-gray-800">Billing Summary</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="text-gray-700">
                <p>Unbilled Amount (incl. GST 150.00):</p>
                <p>Billed Amount:</p>
                <p>Paid Amount:</p>
                <p>Due Amount:</p>
              </div>
              <div className="text-gray-800 font-semibold text-right">
                <p>1,400.00</p>
                <p>0.00</p>
                <p>1,400.00</p>
                <p>0.00</p>
              </div>
            </div>
          </div>

          {/* Payments and Room Tokens */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 text-center">Payments (1)</h3>
            <table className="w-full mt-2 bg-gray-100 rounded text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Particulars</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 text-left">02 Dec 2024 10:37 AM</td>
                  <td className="p-2 text-left">Advance Payment</td>
                  <td className="p-2 text-right">1,400.00</td>
                </tr>
              </tbody>
            </table>

            <button
              className={`mt-4 mb-4 py-2 px-4 rounded bg-teal-600 text-white text-sm font-medium`}
            >
              Complete Payment
            </button>
            <h3 className="mt-4 font-semibold text-gray-800 text-center">Room Tokens (1)</h3>
            <table className="w-full mt-2 bg-gray-100 rounded text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Room Details</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 text-left">02 Dec 2024 10:37 AM</td>
                  <td className="p-2 text-left">Room #304 - Super Deluxe</td>
                  <td className="p-2 text-right">1,250.00</td>
                </tr>
              </tbody>
            </table>

            <button
              className={`mt-4 mb-4 py-2 px-4 rounded bg-teal-600 text-white text-sm font-medium`}
            >
              Print Room Invoice
            </button>
            <h3 className="font-semibold text-gray-800 text-center">Services (1)</h3>
            <table className="w-full mt-2 bg-gray-100 rounded text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Item</th>
                  <th className="p-2 text-center">Price</th>
                  <th className="p-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-2 text-left">Roti</td>
                  <td className="p-2 text-center">100.00</td>
                  <td className="p-2 text-right">180.00</td>
                </tr>
              </tbody>
            </table>
            <button
              className={`mt-4 mb-4 py-2 px-4 rounded bg-teal-600 text-white text-sm font-medium`}
            >
              Print Service Invoice
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingDashboard;
