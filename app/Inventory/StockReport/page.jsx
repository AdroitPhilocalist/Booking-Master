'use client'

import { useState, useEffect } from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';

const StockReportPage = () => {
  const [stockReports, setStockReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch stock reports from the API when the component mounts
  useEffect(() => {
    const fetchStockReports = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/stockreport");
        const data = await res.json();

        if (res.ok) {
          setStockReports(data.stockReports);
          setFilteredReports(data.stockReports);
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

  // Filter Function
  const filterByDate = () => {
    if (startDate && endDate) {
      const filtered = stockReports.filter((report) => {
        const reportDate = new Date(report.purchasedate);
        return (
          reportDate >= new Date(startDate) &&
          reportDate <= new Date(endDate)
        );
      });
      setFilteredReports(filtered);
    } else {
      setFilteredReports(stockReports); // Show all reports if no dates are selected
    }
  };

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

        <div className="flex space-x-4 mb-6">
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full"
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={filterByDate}
            className="ml-4"
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setStartDate("");
              setEndDate("");
              setFilteredReports(stockReports); // Reset to show all reports
            }}
            className="ml-4"
          >
            Reset
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#164E63" }}>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Item Name</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Item Code</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Item Category</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Order Date</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>In Stock</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Out Stock</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Available Quantity</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Unit</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Rate</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Tax Percent</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <TableRow 
                    key={report._id} 
                    sx={{ 
                      backgroundColor: report.purorsell === 'purchase' ? "#BBF7D0" : "#FFCCCB" 
                    }}
                  >
                    <TableCell sx={{ textAlign: "center" }}>{report.name?.name || 'N/A'}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{report.name?.itemCode || 'N/A'}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{report.name?.segment?.itemName || 'N/A'}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {report.purchasedate
                        ? (() => {
                            const date = new Date(report.purchasedate);
                            const day = String(date.getDate()).padStart(2, "0");
                            const month = String(date.getMonth() + 1).padStart(2, "0");
                            const year = date.getFullYear();
                            return `${day}/${month}/${year}`;
                          })()
                        : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {report.purorsell === 'purchase' 
                        ? (report.quantityAmount || 0) 
                        : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      {report.purorsell === 'sell' 
                        ? (report.quantityAmount || 0) 
                        : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{report.quantity?.stock || 0}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{report.unit?.quantityUnit || 'N/A'}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{report.rate?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{report.taxpercent?.tax?.toFixed(2) || '0.00'}%</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{report.total?.toFixed(2) || '0.00'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    No stock reports available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Footer />
    </div>
  );
};

export default StockReportPage;