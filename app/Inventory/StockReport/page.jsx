'use client'

import { useState, useEffect, useRef } from "react";
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

    // Ref to access the table
    const tableRef = useRef(null);

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

  const printTable = () => {
    if (!tableRef.current) return;
  
    const tableHTML = tableRef.current.outerHTML;
    const originalContent = document.body.innerHTML;
  
    // Replace body content with table HTML
    document.body.innerHTML = `
      <html>
        <head>
          <title>Stock Report</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
            }
            table, th, td {
              border: 1px solid black;
            }
            th, td {
              padding: 8px;
              text-align: center;
            }
          </style>
        </head>
        <body>
          ${tableHTML}
        </body>
      </html>
    `;
  
    // Trigger print
    window.print();
  
    // Restore original content
    document.body.innerHTML = originalContent;
  
    // Reattach React event listeners after restoring DOM
    window.location.reload();
  };
  


  return (
    <div className="bg-amber-50 min-h-screen">
      <Navbar />
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <svg
              aria-hidden="true"
              className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="mt-4 text-gray-700">Loading Stock Reports...</span>
          </div>
        </div>
      )}
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Stock Report</h1>

        <div className="flex space-x-2 mb-4">
          <TextField
            label="Start Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-1/4"
            size="small"
          />
          <TextField
            label="End Date"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-1/4"
            size="small"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={filterByDate}
            className="ml-2"
            size="small"
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
            className="ml-2"
            size="small"
          >
            Reset
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={printTable}
            className="ml-2"
            size="small"
          >
            Download/Export
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table  ref={tableRef}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#164E63" }}>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Item Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Item Code</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Item Category</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Order Date</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>In Stock</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Out Stock</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Available Quantity</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Unit</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Rate</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Tax Percent</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <TableRow
                    key={report._id}
                    sx={{
                      '& > td': {
                        backgroundColor: 'white',
                      },
                    }}
                  >
                    <TableCell
                      sx={{
                        textAlign: 'center',
                        background: `linear-gradient(
                                      to right,
                                      ${report.purorsell === 'purchase' ? '#00FF00' : '#FF0000'} 10%, 
                                      white 10%
                                      )`,
                      }}
                    >
                      {report.name?.name || 'N/A'}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{report.name?.itemCode || 'N/A'}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{report.name?.segment?.itemName || 'N/A'}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {report.purchasedate ? (() => {
                        const date = new Date(report.purchasedate);
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        return `${day}/${month}/${year}`;
                      })() : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {report.purorsell === 'purchase' ? (report.quantityAmount || 0) : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      {report.purorsell === 'sell' ? (report.quantityAmount || 0) : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{report.quantity?.stock || 0}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{report.unit?.quantityUnit || 'N/A'}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{report.rate?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{report.taxpercent?.tax?.toFixed(2) || '0.00'}%</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{report.total?.toFixed(2) || '0.00'}</TableCell>
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