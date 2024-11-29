"use client";
import React, { useState } from 'react';

const CreateInvoicePage = ({ onInvoiceCreate }) => {
  const [formData, setFormData] = useState({
    invoiceno: '',
    date: '',
    time:'',
    custname: '',
    totalamt: '',
    gst: '',
    payableamt: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/restaurantinvoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Ensure formData contains all required fields
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Notify the parent component (InvoicePage) about the new invoice
        if (onInvoiceCreate) {
          onInvoiceCreate(data.data); // Pass the newly created invoice back
        }
  
        // Reset the form
        setFormData({
          invoiceno: '',
          date: '',
          time:'',
          custname: '',
          totalamt: '',
          gst: '',
          payableamt: '',
        });
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div>
      <h1>Create Invoice</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Invoice No.:
          <input
            type="text"
            name="invoiceno"
            value={formData.invoiceno}
            onChange={handleChange}
          />
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </label>
        <label>
          Time:
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
        </label>
        <label>
          Customer Name:
          <input
            type="text"
            name="custname"
            value={formData.custname}
            onChange={handleChange}
          />
        </label>
        <label>
          Total Amount:
          <input
            type="number"
            name="totalamt"
            value={formData.totalamt}
            onChange={handleChange}
          />
        </label>
        <label>
          GST:
          <input
            type="number"
            name="gst"
            value={formData.gst}
            onChange={handleChange}
          />
        </label>
        <label>
          Payable Amount:
          <input
            type="number"
            name="payableamt"
            value={formData.payableamt}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Create Invoice</button>
      </form>
    </div>
  );
};

export default CreateInvoicePage;
