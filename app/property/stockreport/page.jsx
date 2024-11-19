"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";

export default function StockReportPage() {
  const [stockReports, setStockReports] = useState([]);
  const [formData, setFormData] = useState({
    purchaseorderno: "",
    purchasedate: "",
    Invoiceno: "",
    quantity: "",
    unit: "",
    rate: "",
    taxpercent: "",
    total: "",
  });

  const [error, setError] = useState("");

  // Fetch stock reports
  useEffect(() => {
    const fetchStockReports = async () => {
      try {
        const response = await fetch("/api/stockreport");
        const data = await response.json();
        if (response.ok) {
          setStockReports(data.stockReports);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Failed to fetch stock reports.");
      }
    };

    fetchStockReports();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/stockreport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setStockReports((prev) => [...prev, data.stockReport]);
        setFormData({
          purchaseorderno: "",
          purchasedate: "",
          Invoiceno: "",
          quantity: "",
          unit: "",
          rate: "",
          taxpercent: "",
          total: "",
        });
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to add stock report.");
    }
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div>
        <Navbar />
      <h1>Stock Report</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="purchaseorderno"
          placeholder="Purchase Order No"
          value={formData.purchaseorderno}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="purchasedate"
          value={formData.purchasedate}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Invoiceno"
          placeholder="Invoice No"
          value={formData.Invoiceno}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="quantity"
          placeholder="Quantity (Inventory ID)"
          value={formData.quantity}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="unit"
          placeholder="Unit (Inventory ID)"
          value={formData.unit}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="rate"
          placeholder="Rate"
          value={formData.rate}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="taxpercent"
          placeholder="Tax Percent (Inventory ID)"
          value={formData.taxpercent}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="total"
          placeholder="Total"
          value={formData.total}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Stock</button>
      </form>

      <h2>Existing Stock Reports</h2>
      <ul>
        {stockReports.map((report) => (
          <li key={report._id}>
            <p>Purchase Order No: {report.purchaseorderno}</p>
            <p>Purchase Date: {new Date(report.purchasedate).toLocaleDateString()}</p>
            <p>Invoice No: {report.Invoiceno}</p>
            <p>Quantity: {report.quantity?.stock}</p>
            <p>Unit: {report.unit?.quantityUnit}</p>
            <p>Rate: {report.rate}</p>
            <p>Tax: {report.taxpercent?.tax}</p>
            <p>Total: {report.total}</p>
          </li>
        ))}
      </ul>
        <Footer />
    </div>
  );
}
