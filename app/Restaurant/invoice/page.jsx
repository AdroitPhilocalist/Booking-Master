"use client";
import CreateInvoicePage from './createinvoice/page';
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const InvoicePage = () => {
  const [invoices, setInvoices] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch('/api/restaurantinvoice');
        const data = await response.json();
        setInvoices(data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/restaurantinvoice/${id}`, {
        method: 'DELETE',
      });
      setInvoices(invoices.filter((invoice) => invoice._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Restaurant Invoices</h1>
      <table>
        <thead>
          <tr>
            <th>Invoice No.</th>
            <th>Date</th>
            <th>Customer Name</th>
            <th>Total Amount</th>
            <th>GST</th>
            <th>Payable Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id}>
              <td>{invoice.invoiceno}</td>
              <td>{new Date(invoice.date).toLocaleDateString()}</td>
              <td>{invoice.custname}</td>
              <td>{invoice.totalamt}</td>
              <td>{invoice.gst}</td>
              <td>{invoice.payableamt}</td>
              <td>
                <Link href={`/restaurant/invoice/edit/${invoice._id}`}>Edit</Link>
                <button onClick={() => handleDelete(invoice._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => router.push('/Restaurant/invoice/createinvoice')}>
        Create Invoice
      </button>
    </div>
  );
};

export default InvoicePage;