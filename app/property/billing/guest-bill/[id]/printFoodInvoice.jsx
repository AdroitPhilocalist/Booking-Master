import React from 'react';
import { Button } from '@mui/material';

const PrintableFoodInvoice = ({ bookingDetails }) => {
  const { billing, booking, room, category, foodItems } = bookingDetails;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Food Invoice</h1>
        <p>Booking ID: {booking.bookingId}</p>
      </div>

      {/* Guest Information */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Guest Information</h2>
        <p>Name: {booking.guestName}</p>
        <p>Room No: {billing.roomNo}</p>
        <p>Check-in: {new Date(booking.checkIn).toLocaleDateString()}</p>
        <p>Check-out: {new Date(booking.checkOut).toLocaleDateString()}</p>
      </div>

      {/* Food Items Table */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Food Items</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Item</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Tax (%)</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {foodItems.map((item, index) => (
              <tr key={index}>
                <td className="border p-2">{item.name}</td>
                <td className="border p-2 text-center">{item.quantity}</td>
                <td className="border p-2 text-right">
                  ₹{(item.price / item.quantity).toFixed(2)}
                </td>
                <td className="border p-2 text-center">{item.tax}</td>
                <td className="border p-2 text-right">₹{item.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold">
              <td colSpan="4" className="border p-2 text-right">Total Amount:</td>
              <td className="border p-2 text-right">
                ₹{foodItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Print Button */}
      <div className="text-center">
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print Invoice
        </Button>
      </div>
    </div>
  );
};

export default PrintableFoodInvoice;