"use client";
import React, { useState, useEffect } from "react";

const CreateInvoicePage = ({ onInvoiceCreate, existingInvoice, onCancel }) => {
  const [menu, setMenu] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [formData, setFormData] = useState({
    invoiceno: "",
    date: "",
    time: "",
    custname: "",
    menuitem: [], 
    quantity: [], 
    price: [], 
    totalamt: 0,
    gst: 0,
    payableamt: 0,
  });

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const menuResponse = await fetch("/api/menuItem");
        const menuData = await menuResponse.json();
        setMenu(menuData.data);
      } catch (error) {
        console.error("Failed to fetch menu data", error);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    if (existingInvoice) {
      setFormData({
        invoiceno: existingInvoice.invoiceno || "",
        date: existingInvoice.date
          ? new Date(existingInvoice.date).toISOString().split("T")[0]
          : "",
        time: existingInvoice.time || "",
        custname: existingInvoice.custname || "",
        menuitem: existingInvoice.menuitem || [],
        quantity: existingInvoice.quantity || [],
        price: existingInvoice.price || [],
        totalamt: existingInvoice.totalamt || 0,
        gst: existingInvoice.gst || calculateGST(existingInvoice.totalamt || 0),
        payableamt: existingInvoice.payableamt || calculatePayableAmount(existingInvoice.totalamt || 0),
      });
      setSelectedItems(
        existingInvoice.menuitem?.map((item, index) => ({
          name: item,
          price: existingInvoice.price[index],
          quantity: existingInvoice.quantity[index] || 1,
        })) || []
      );
    }
  }, [existingInvoice]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addMenuItem = (e) => {
    const selectedItemName = e.target.value;
    if (!selectedItemName) return;

    // Find the selected menu item
    const selectedMenuItem = menu.find(item => item.itemName === selectedItemName);
    
    // Check if item is already added
    const isItemExists = selectedItems.some(item => item.name === selectedItemName);
    if (isItemExists) return;

    // Create a new selected item object
    const newItem = {
      name: selectedItemName,
      price: selectedMenuItem.price,
      quantity: 1
    };

    // Update selected items
    const updatedSelectedItems = [...selectedItems, newItem];
    setSelectedItems(updatedSelectedItems);

    // Update form data
    const totalAmount = calculateTotal(updatedSelectedItems);
    setFormData(prev => ({
      ...prev,
      menuitem: updatedSelectedItems.map(item => item.name),
      price: updatedSelectedItems.map(item => item.price),
      quantity: updatedSelectedItems.map(item => item.quantity),
      totalamt: totalAmount,
      gst: calculateGST(totalAmount),
      payableamt: calculatePayableAmount(totalAmount)
    }));

    // Reset the select dropdown
    e.target.value = "";
  };

  const updateQuantity = (index, newQuantity) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].quantity = newQuantity || 1;

    setSelectedItems(updatedItems);

    // Recalculate totals
    const totalAmount = calculateTotal(updatedItems);
    setFormData(prev => ({
      ...prev,
      quantity: updatedItems.map(item => item.quantity),
      totalamt: totalAmount,
      gst: calculateGST(totalAmount),
      payableamt: calculatePayableAmount(totalAmount)
    }));
  };

  const removeMenuItem = (index) => {
    const updatedItems = selectedItems.filter((_, i) => i !== index);
    
    setSelectedItems(updatedItems);

    // Recalculate totals
    const totalAmount = calculateTotal(updatedItems);
    // Update form data
    setFormData(prev => ({
      ...prev,
      menuitem: updatedItems.map(item => item.name),
      price: updatedItems.map(item => item.price),
      quantity: updatedItems.map(item => item.quantity),
      totalamt: totalAmount,
      gst: calculateGST(totalAmount),
      payableamt: calculatePayableAmount(totalAmount)
    }));
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateGST = (totalAmount) => {
    const gstRate = 0.18; // 18% GST
    return totalAmount * gstRate;
  };

  const calculatePayableAmount = (totalAmount) => {
    const gstAmount = calculateGST(totalAmount);
    return totalAmount + gstAmount;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = existingInvoice ? "PUT" : "POST";
      const url = existingInvoice
        ? `/api/restaurantinvoice/${existingInvoice._id}`
        : "/api/restaurantinvoice";

      // Ensure gst is calculated correctly
      const submissionData = {
        ...formData,
        gst: calculateGST(formData.totalamt),
        payableamt: calculatePayableAmount(formData.totalamt)
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Invoice saved successfully:", data);
        if (onInvoiceCreate) onInvoiceCreate(data.data);
        // Reset form
        resetForm();
      } else {
        console.error("Error saving invoice:", data.error);
      }
    } catch (error) {
      console.error("Error during invoice save:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      invoiceno: "",
      date: "",
      time: "",
      custname: "",
      menuitem: [],
      quantity: [],
      price: [],
      totalamt: 0,
      gst: 0,
      payableamt: 0,
    });
    setSelectedItems([]);
  };

  const handleCancel = () => {
    resetForm();
    if (onCancel) onCancel();
  };

  return (
    <div className="max-w-md mx-auto relative">
      {/* Removed cross/close icon */}
      <div className="max-h-[600px] overflow-y-auto pr-2">
        <h2 className="text-2xl font-bold mb-4 text-center sticky top-0 bg-white z-10">Create Invoice</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: "Invoice No.", name: "invoiceno", type: "text" },
            { label: "Date", name: "date", type: "date" },
            { label: "Time", name: "time", type: "time" },
            { label: "Customer Name", name: "custname", type: "text" },
          ].map(({ label, name, type }) => (
            <label key={name} className="block">
              {label}
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </label>
          ))}

          {/* Menu Item Selection */}
          <div>
            <label className="block mb-2">Select Menu Items</label>
            <select 
              onChange={addMenuItem}
              className="w-full px-3 py-2 border rounded-md mb-2"
            >
              <option value="">Select Item</option>
              {menu.map((item) => (
                <option key={item._id} value={item.itemName}>
                  {item.itemName} - ₹{item.price}
                </option>
              ))}
            </select>
          </div>

          {/* Selected Items List */}
          {selectedItems.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between border p-2 rounded-md mb-2"
            >
              <div>
                <span>{item.name}</span>
                <span className="ml-2 text-gray-600">₹{item.price}</span>
              </div>
              <div className="flex items-center">
                <label className="mr-2">Qty:</label>
                <input 
                  type="number" 
                  min="1" 
                  value={item.quantity}
                  onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border rounded-md mr-2"
                />
                <button 
                  type="button"
                  onClick={() => removeMenuItem(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Totals */}
          <div className="mt-4 sticky bottom-0 bg-white pt-2">
            <div className="flex justify-between">
              <span>Total Amount:</span>
              <span>₹{formData.totalamt.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST (18%):</span>
              <span>₹{formData.gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>Payable Amount:</span>
              <span>₹{formData.payableamt.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-4 sticky bottom-0 bg-white pt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={selectedItems.length === 0}
            >
              Save Invoice
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-4 py-2 rounded"
              onClick={resetForm}
            >
              Reset
            </button>
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoicePage;