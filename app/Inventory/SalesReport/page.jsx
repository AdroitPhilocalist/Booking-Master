'use client';
import { useEffect, useState } from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";

const SalesReportPage = () => {
  const [salesReports, setSalesReports] = useState([]);
  const [error, setError] = useState(null);

  // Fetch stock reports from the API and filter sales
  useEffect(() => {
    const fetchSalesReports = async () => {
      try {
        const res = await fetch("/api/stockreport");
        const data = await res.json();
        if (res.ok) {
          // Filter only the sales
          const sales = data.stockReports.filter((report) => report.purorsell === 'sell');
          setSalesReports(sales);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Failed to fetch sales reports");
      }
    };

    fetchSalesReports();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Sales Report</h1>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-yellow-950 text-white">
              <th className="border border-gray-300 px-4 py-2">Sales No</th>
              <th className="border border-gray-300 px-4 py-2">Item Name</th>
              <th className="border border-gray-300 px-4 py-2">Sales Date</th>
              <th className="border border-gray-300 px-4 py-2">Invoice No</th>
              <th className="border border-gray-300 px-4 py-2">Sold Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Unit</th>
              <th className="border border-gray-300 px-4 py-2">Rate</th>
              <th className="border border-gray-300 px-4 py-2">Tax Percent</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {salesReports.length > 0 ? (
              salesReports.map((report) => (
                <tr key={report._id} className="bg-red-100">
                  <td className="border border-gray-300 px-10 py-2">{report.purchaseorderno}</td>
                  <td className="border border-gray-300 px-4 py-2">{report.name?.name}</td>
                  <td className="border border-gray-300 px-8 py-2">{new Date(report.salesdate).toLocaleDateString()}</td>
                  <td className="border border-gray-300 px-8 py-2">{report.Invoiceno}</td>
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
                  No sales reports available.
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

export default SalesReportPage;
