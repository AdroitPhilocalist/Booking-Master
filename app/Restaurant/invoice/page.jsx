"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CreateInvoicePage from "./createinvoice/page";
import Navbar from "../../_components/Navbar"; // Import Navbar

const InvoicePage = () => {
  const [menu,setmenu] = useState();
  const [invoices, setInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentInvoice, setCurrentInvoice] = useState(null); // For editing
  const router = useRouter();


  useEffect( ()=>{
    const fetchmenu=async()=>{
      try{
        const menuresponse=await fetch("/api/menuItem");
        const menudata=await menuresponse.json();
        console.log(menudata.data);
        setmenu(menudata.data);
        console.log(menu);
      }
      catch(error){
        console.error("failed to fetch data",error);
      }
    };
    fetchmenu();
  },
  
  []
  );


  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch("/api/restaurantinvoice");
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
      const response = await fetch(`/api/restaurantinvoice/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInvoices(invoices.filter((invoice) => invoice._id !== id)); // Update UI
      } else {
        console.error("Failed to delete invoice");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (invoice) => {
    setCurrentInvoice(invoice); // Set the invoice to be edited
    setShowModal(true); // Open the modal
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
          setInvoices(updatedInvoices); // Update the UI with the edited invoice
          setCurrentInvoice(null); // Reset
          setShowModal(false); // Close modal
        } else {
          console.error("Failed to update invoice");
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      // Add new invoice
      setInvoices((prev) => [...prev, updatedInvoice]);
      setShowModal(false); // Close modal
    }
  };

  return (
    <div className="p-4">
      <Navbar /> {/* Render Navbar */}

      <h1 className="text-3xl font-bold mb-4">Restaurant Invoices</h1>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => {
          setCurrentInvoice(null); // Reset form for new invoice
          setShowModal(true);
        }}
      >
        Create Invoice
      </button>

      <table className="w-full border border-gray-300 rounded-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Invoice No.</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Customer Name</th>
            <th className="border border-gray-300 px-4 py-2">Total Amount</th>
            <th className="border border-gray-300 px-4 py-2">GST</th>
            <th className="border border-gray-300 px-4 py-2">Payable Amount</th>
            <th className="border border-gray-300 px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id} className="text-center">
              <td className="border border-gray-300 px-4 py-2">{invoice.invoiceno}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(invoice.date).toLocaleDateString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">{invoice.custname}</td>
              <td className="border border-gray-300 px-4 py-2">{invoice.totalamt}</td>
              <td className="border border-gray-300 px-4 py-2">{invoice.gst}</td>
              <td className="border border-gray-300 px-4 py-2">{invoice.payableamt}</td>
              <td className="border border-gray-300 px-4 py-2 flex items-center justify-center gap-2">
                <button
                  className="bg-green-600 text-white px-2 py-1 rounded"
                  onClick={() => handleEdit(invoice)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(invoice._id)}
                >
                  Delete
                </button>
                <button className="bg-gray-600 text-white px-2 py-1 rounded">
                  Print
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Create/Edit Invoice */}
      {showModal && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <button
              className="text-red-600 text-xl absolute top-2 right-4"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <CreateInvoicePage
              onInvoiceCreate={handleInvoiceSave}
              existingInvoice={currentInvoice}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoicePage;
