// pages/stockreport.jsx
'use client'
import { useEffect, useState } from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";

const StockReportPage = () => {
  const [stockReports, setStockReports] = useState([]);
  const [error, setError] = useState(null);

  // Fetch stock reports from the API when the component mounts
  useEffect(() => {
    const fetchStockReports = async () => {
      try {
        const res = await fetch("/api/stockreport");
        const data = await res.json();
        if (res.ok) {
          setStockReports(data.stockReports); // Set the fetched stock reports to state
        } else {
          setError(data.error); // Set any error that occurred
        }
      } catch (err) {
        setError("Failed to fetch stock reports"); // Handle any errors from fetch
      }
    };

    fetchStockReports();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Stock Report</h1>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-yellow-950 text-white">
              <th className="border border-gray-300 px-4 py-2">Item Name</th>
              <th className="border border-gray-300 px-4 py-2">Purchase Date</th>
              <th className="border border-gray-300 px-4 py-2">Available Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Unit</th>
              <th className="border border-gray-300 px-4 py-2">Rate</th>
              <th className="border border-gray-300 px-4 py-2">Tax Percent</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {stockReports.length > 0 ? (
              stockReports.map((report) => (
                <tr
                  key={report._id}
                  className="bg-white"
                >
                  <td className="border border-gray-300 px-4 py-2">{report.name?.name}</td>
                  <td className="border border-gray-300 px-8 py-2">{new Date(report.purchasedate).toLocaleDateString()}</td>
                  <td className="border border-gray-300 px-20 py-2">{report.quantity?.stock}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.unit?.quantityUnit}</td>
                  <td className="border border-gray-300 px-6 py-2">{report.rate}</td>
                  <td className="border border-gray-300 px-16 py-2">{report.taxpercent?.tax}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.total}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="border border-gray-300 px-4 py-2 text-center">
                  No stock reports available.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
      <Footer />
    </div>
  );
};

export default StockReportPage;
