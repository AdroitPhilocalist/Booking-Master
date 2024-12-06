// pages/stockreport.jsx
'use client'
import { useEffect, useState } from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";

const StockReportPage = () => {
  const [stockReports, setStockReports] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch stock reports from the API when the component mounts
  useEffect(() => {
    const fetchStockReports = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/stockreport");
        const data = await res.json();

        if (res.ok) {
          setStockReports(data.stockReports);
          setError(null);
        } else {
          setError(data.error || "Failed to fetch stock reports");
        }
      } catch (err) {
        setError("Network error. Unable to fetch stock reports");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockReports();
  }, []);

  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-amber-50 min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold">Loading stock reports...</div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-amber-50 min-h-screen flex items-center justify-center">
        <div className="text-red-600 text-xl font-semibold">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Stock Report</h1>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-cyan-900 text-white">
                <th className="border border-gray-300 px-4 py-2">Item Name</th>
                <th className="border border-gray-300 px-4 py-2">Item Code</th>
                <th className="border border-gray-300 px-4 py-2">Item Category</th>
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
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      {report.name?.name || 'N/A'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {report.name?.itemCode || 'N/A'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {report.name?.segment?.itemName || 'N/A'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {report.purchasedate
                        ? new Date(report.purchasedate).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {report.quantity?.stock || 0}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {report.unit?.quantityUnit || 'N/A'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {report.rate?.toFixed(2) || '0.00'}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {report.taxpercent?.tax?.toFixed(2) || '0.00'}%
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {report.total?.toFixed(2) || '0.00'}
                    </td>
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
      </div>
      <Footer />
    </div>
  );
};

export default StockReportPage;