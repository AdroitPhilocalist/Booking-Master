'use client';

import { useState, useEffect, useRef } from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { getCookie } from 'cookies-next'; // Import getCookie from cookies-next
import { jwtVerify } from 'jose'; // Import jwtVerify for decoding JWT
import { useRouter } from 'next/navigation';

const SalesReportPage = () => {
  const [purchaseReports, setPurchaseReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchaseorderno, setPurchaseorderno] = useState("");
  const [purchasedate, setPurchasedate] = useState("");
  const [Invoiceno, setInvoiceno] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantityAmount, setQuantityAmount] = useState("");
  const [rate, setRate] = useState("");
  const [total, setTotal] = useState("");
  // Add new state for tracking button disabled status
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [duplicateError, setDuplicateError] = useState({
    purchaseorderno: false,
    Invoiceno: false
  });
  // Filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Ref to access the table
  const tableRef = useRef(null);
  const router = useRouter();
  const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = getCookie('authToken'); // Get the token from cookies
        if (!token) {
          router.push('/'); // Redirect to login if no token is found
          return;
        }
        // Verify the token
        const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
        const userId = decoded.payload.id;
        // Fetch the profile by userId to get the username
        const profileResponse = await fetch(`/api/Profile/${userId}`);
        const profileData = await profileResponse.json();
        if (!profileData.success || !profileData.data) {
          router.push('/'); // Redirect to login if profile not found
          return;
        }
        const username = profileData.data.username;

        const [itemsResponse, purchaseResponse] = await Promise.all([
          fetch(`/api/InventoryList?username=${username}`),
          fetch(`/api/stockreport?username=${username}`)
        ]);

        const itemsData = await itemsResponse.json();
        const purchaseData = await purchaseResponse.json();
        setItems(itemsData.items || []);
        if (purchaseResponse.ok) {
          const purchases = purchaseData.stockReports.filter(
            (report) => report.purorsell === "sell"
          );
          setPurchaseReports(purchases);
          setFilteredReports(purchases);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        setError("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router]);


  // Function to check for duplicates
  const checkForDuplicates = (field, value) => {
    return purchaseReports.some(report => {
      if (field === 'purchaseorderno') {
        return report.purchaseorderno.toLowerCase() === value.toLowerCase();
      } else if (field === 'invoiceno') {
        return report.Invoiceno.toLowerCase() === value.toLowerCase();
      }
      return false;
    });
  };
  // Modify useEffect to include duplicate checks
  useEffect(() => {
    if (quantityAmount && rate && selectedItem) {
      const taxMultiplier = 1 + (selectedItem.tax / 100);
      const calculatedTotal = parseFloat(quantityAmount) * parseFloat(rate) * taxMultiplier;
      setTotal(calculatedTotal.toFixed(2));

      // Check if purchase amount exceeds current stock
      const isValidQuantity = parseFloat(quantityAmount) <= selectedItem.stock;

      // Check for validation conditions
      const isDisabled = !isValidQuantity ||
        !purchaseorderno ||
        !purchasedate ||
        !Invoiceno ||
        duplicateError.purchaseorderno ||
        duplicateError.Invoiceno;

      setIsSaveDisabled(isDisabled);
    } else {
      setTotal("");
      setIsSaveDisabled(true);
    }
  }, [quantityAmount, rate, selectedItem, purchaseorderno, purchasedate, Invoiceno, duplicateError]);

  // Update the handlers for purchaseorderno and invoiceno
  const handlePurchaseOrderChange = (e) => {
    const value = e.target.value;
    setPurchaseorderno(value);
    const isDuplicate = checkForDuplicates('purchaseorderno', value);
    setDuplicateError(prev => ({
      ...prev,
      purchaseorderno: isDuplicate
    }));
  };

  const handleInvoiceNoChange = (e) => {
    const value = e.target.value;
    setInvoiceno(value);
    const isDuplicate = checkForDuplicates('invoiceno', value);
    setDuplicateError(prev => ({
      ...prev,
      invoiceno: isDuplicate
    }));
  };

  const handleOpenModal = () => setIsModalOpen(true);

  const handleCloseModal = () => {
    setPurchaseorderno("");
    setPurchasedate("");
    setInvoiceno("");
    setSelectedItem(null);
    setQuantityAmount("");
    setRate("");
    setTotal("");
    setIsModalOpen(false);
    setDuplicateError({
      purchaseorderno: false,
      invoiceno: false
    });
  };

  const handleItemChange = (itemId) => {
    const item = items.find((item) => item._id === itemId);
    setSelectedItem(item || null);
  };

  const handlePurchase = async () => {
    if (!purchaseorderno || !purchasedate || !Invoiceno || !selectedItem ||
      !quantityAmount || !rate) {
      toast.warn('🥲 Please fill in all fields!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    if (!selectedItem) {
      setError("Please select an item");
      return;
    }

    const purchaseData = {
      purchaseorderno,
      name: selectedItem._id,
      purchasedate: new Date(purchasedate),
      Invoiceno,
      quantity: selectedItem._id,
      quantityAmount: parseFloat(quantityAmount),
      unit: selectedItem._id,
      rate: parseFloat(rate),
      taxpercent: selectedItem._id,
      total: parseFloat(total),
      purorsell: "sell",
      username: selectedItem.username // Include username in the request body
    };

    try {
      const response = await fetch("/api/stockreport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseData),
      });

      const result = await response.json();

      if (response.ok) {
        await updateStockQuantity(
          selectedItem._id,
          parseFloat(quantityAmount),
          selectedItem.stock
        );
        setPurchaseReports((prevReports) => [...prevReports, result.stockReport]);
        handleCloseModal();

        // Show success toast with onClose callback to reload the page
        toast.success('👍 Item Sold Successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => window.location.reload()
        });
      } else {
        setError(result.error || "Failed to save purchase report");
        toast.error('👎 Failed to save sales report', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error saving sales report:", error);
      setError("Error saving sales report");
    }
  };


  const updateStockQuantity = async (itemId, quantityAmount, currentStock) => {
    try {
      const newStock = currentStock - quantityAmount;
      const response = await fetch(`/api/InventoryList/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stock: newStock, username: selectedItem.username }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error("Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  };

  // Filter Function
  const filterByDate = () => {
    if (startDate && endDate) {
      const filtered = purchaseReports.filter((report) => {
        const purchaseDate = new Date(report.purchasedate);
        return (
          purchaseDate >= new Date(startDate) &&
          purchaseDate <= new Date(endDate)
        );
      });
      setFilteredReports(filtered);
    } else {
      setFilteredReports(purchaseReports); // Show all reports if no dates are selected
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="bg-amber-50 min-h-screen">

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
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
              <span className="mt-4 text-gray-700">Loading Sales Reports...</span>
            </div>
          </div>
        )}
        <div className="container mx-auto p-6 ">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-cyan-900 " style={{ maxWidth: '80%', margin: '0 auto' }}>Sales Report</h1>
          </div>

          <div className="flex space-x-2 mb-4 justify-center">
            <TextField
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-1/4 flex justify-center"
              size="small"
            />
            <TextField
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-1/4 flex justify-center "
              size="small"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={filterByDate}
              className="ml-2 flex justify-center"
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
                setFilteredReports(purchaseReports); // Reset to show all reports
              }}
              className="ml-2 flex justify-center"
              size="small"
            >
              Reset
            </Button>
            <Button
              variant="contained"
              onClick={printTable}
              className="ml-2 flex justify-center"
              size="small"
              sx={{
                backgroundColor: 'orange',
                '&:hover': {
                  backgroundColor: 'darkorange',
                },
              }}
            >
              Download/Export
            </Button>
            <Button
              variant="contained"
              className="ml-2 flex justify-center  "
              color="error"
              onClick={() => setIsModalOpen(true)}
            >
              Sell Stock
            </Button>
          </div>

          <TableContainer component={Paper} style={{ maxWidth: '80%', margin: '0 auto' }}>
            <Table ref={tableRef}>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Sales No</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Item Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Sales Date</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Invoice No</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Available Quantity</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Unit</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Rate</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>CGST</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>SGST</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Total</TableCell>
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
                                      ${report.purorsell === 'purchase' ? '#1ebc1e' : '#f24a23'} 5%, 
                                      white 5%
                                      )`,
                        }}
                      >{report.purchaseorderno}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{report.name?.name}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        {(() => {
                          const date = new Date(report.purchasedate);
                          const day = String(date.getDate()).padStart(2, "0");
                          const month = String(date.getMonth() + 1).padStart(2, "0");
                          const year = date.getFullYear();
                          return `${day}/${month}/${year}`;
                        })()}
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{report.Invoiceno}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{report.quantity?.stock}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{report.unit?.quantityUnit}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{report.rate}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{(report.taxpercent?.tax)/2}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{(report.taxpercent?.tax)/2}</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>{report.total}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      No Sales reports available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

          </TableContainer>
        </div>


        <Modal open={isModalOpen} onClose={handleCloseModal}>
          <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 w-1/2 shadow-md max-h-[90%] overflow-y-auto" sx={{ borderRadius: 2 }}>
            <h2 className="text-xl font-bold mb-4">New Sales</h2>
            <form className="space-y-4">
              <TextField
                required
                id="purchaseorderno"
                label="Sales Order No"
                variant="outlined"
                value={purchaseorderno}
                onChange={handlePurchaseOrderChange}
                className="w-full"
                error={duplicateError.purchaseorderno}
                helperText={duplicateError.purchaseorderno ? "This Sales Order No already exists" : ""}
              />
              <TextField
                required
                id="purchasedate"
                label="Sales Date"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={purchasedate}
                onChange={(e) => setPurchasedate(e.target.value)}
                className="w-full"
              />
              <TextField
                required
                id="Invoiceno"
                label="Invoice No"
                variant="outlined"
                value={Invoiceno}
                onChange={handleInvoiceNoChange}
                className="w-full"
                error={duplicateError.invoiceno}
                helperText={duplicateError.invoiceno ? "This Invoice No already exists" : ""}
              />

              <TextField
                required
                select
                id="itemname"
                variant="outlined"
                value={selectedItem?._id || ''}
                onChange={(e) => handleItemChange(e.target.value)}
                className="w-full"
                SelectProps={{
                  native: true,
                }}
              >
                <option value="">Select Item</option>
                {items.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </TextField>
              <TextField
                required
                id="unit"
                label="Unit"
                variant="outlined"
                value={selectedItem?.quantityUnit || ''}
                disabled
                className="w-full"
              />
              <TextField
                required
                id="stock"
                label="Current Stock"
                variant="outlined"
                value={selectedItem?.stock || '0'}
                disabled
                className="w-full"
              />
              <TextField
                required
                id="quantityAmount"
                label="Sales Quantity"
                variant="outlined"
                type="number"
                value={quantityAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  setQuantityAmount(value);
                  // Add error helper text if quantity exceeds stock
                  if (selectedItem && parseFloat(value) > selectedItem.stock) {
                    e.target.setCustomValidity(`Cannot sell more than available stock (${selectedItem.stock})`);
                  } else {
                    e.target.setCustomValidity('');
                  }
                }}
                className="w-full"
                helperText={selectedItem && parseFloat(quantityAmount) > selectedItem.stock ?
                  `Cannot sell more than available stock (${selectedItem.stock})` : ''}
                error={selectedItem && parseFloat(quantityAmount) > selectedItem.stock}
              />
              <TextField
                required
                id="rate"
                label="Rate"
                variant="outlined"
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full"
              />
              <TextField
                required
                id="taxpercent"
                label="IGST Tax Percent"
                variant="outlined"
                value={selectedItem?.tax || ''}
                disabled
                className="w-full"
              />
              <TextField
                required
                id="taxpercent"
                label="SGST Tax Percent"
                variant="outlined"
                value={((selectedItem?.tax) / 2).toFixed(2) || ''}
                disabled
                className="w-full"
              />
              <TextField
                required
                id="taxpercent"
                label="CGST Tax Percent"
                variant="outlined"
                value={((selectedItem?.tax) / 2).toFixed(2) || ''}
                disabled
                className="w-full"
              />
              <TextField
                required
                id="total"
                label="Total"
                variant="outlined"
                value={total}
                disabled
                className="w-full"
              />
              <div className="flex justify-end">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'green',
                    '&:hover': { backgroundColor: 'darkgreen' },
                    '&:disabled': { backgroundColor: 'gray' }
                  }}
                  onClick={handlePurchase}
                  disabled={isSaveDisabled}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  sx={{
                    color: 'red',
                    borderColor: 'red',
                    '&:hover': {
                      borderColor: 'darkred',
                      backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    },
                    ml: 2
                  }}
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Box>
        </Modal>


      </div>
      <Footer />
    </div>
  );
};

export default SalesReportPage;