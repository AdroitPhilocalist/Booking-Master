"use client";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  PencilIcon,
  BoltIcon,
} from "lucide-react";
import { Modal, TextField, Grid, Typography,FormControl,InputLabel,Select,MenuItem } from "@mui/material";
import { useRouter } from "next/navigation";
import { Footer } from "@/app/_components/Footer";
import Navbar from "@/app/_components/Navbar";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { IconButton } from "@mui/material";

export default function BookingMasterControlPanel() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [displayCount, setDisplayCount] = useState(15);
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [tableData, setTableData] = useState([]); // Use state to store fetched data
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTable, setSelectedTable] = useState(null); // Track the selected table for editing
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch table data from the API when component mounts
  useEffect(() => {
    const fetchTableData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/tables"); // Fetch data from the API route

        const data = await response.json();
        if (data.success) {
          setTableData(data.data); // Set the fetched table data
        }
      } catch (error) {
        console.error("Error fetching table data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTableData();
  }, []);

  const filteredData = tableData.filter((item) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortColumn) {
      if (a[sortColumn] < b[sortColumn])
        return sortDirection === "asc" ? -1 : 1;
      if (a[sortColumn] > b[sortColumn])
        return sortDirection === "asc" ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  const EditTableModal = ({ open, onClose, tableData, onSave }) => {
    const [formData, setFormData] = useState(tableData || {});

    useEffect(() => {
      setFormData(tableData || {}); // Update form data when tableData changes
    }, [tableData]);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
      onSave(formData);
      onClose();
    };

    return (
      <Modal open={open} onClose={onClose}>
        <div className="flex items-center justify-center h-screen">
          <Paper sx={{ width: 400, padding: 4 }}>
            <Typography variant="h5" gutterBottom>
              Edit Table
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={14}>
                <TextField
                  fullWidth
                  label="Table No."
                  name="tableNo"
                  value={formData.tableNo || ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={14}>
              <FormControl fullWidth margin="normal">
                    <InputLabel id="pos-select-label">POS</InputLabel>
                    <Select
                        labelId="pos-select-label"
                        name="pos"
                        value={formData.pos || ''}
                        onChange={handleChange}
                    >
                        <MenuItem value="pos1">POS 1</MenuItem>
                        <MenuItem value="pos2">POS 2</MenuItem>
                        <MenuItem value="pos3">POS 3</MenuItem>
                    </Select>
                </FormControl>
                </Grid>
                {/* <FormControl fullWidth margin="normal">
                    <InputLabel id="status-select-label">Active Status</InputLabel>
                    <Select
                        labelId="status-select-label"
                        name="activeStatus"
                        value={formData.activeStatus || ''}
                        onChange={handleChange}
                    >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                    </Select>
                </FormControl> */}
              <Grid item xs={12} className="flex justify-end gap-2">
                <Button onClick={onClose} color="secondary">
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  color="primary"
                  variant="contained"
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </div>
      </Modal>
    );
  };

  return (
    <div className="min-h-screen bg-amber-50">
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
            <span className="mt-4 text-gray-700">Loading Table Lists...</span>
          </div>
        </div>
      )}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="  rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div
              className=" flex justify-between mb-3"
              style={{ maxWidth: "80%", margin: "0 auto" }}
            >
              <h2 className="text-3xl font-semibold text-cyan-900 ">
                {/* <BoltIcon className="h-6 w-6 mr-2 text-yellow-500" /> */}
                Table List
              </h2>
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mb-4"
                onClick={() => router.push("/Restaurant/Tables/add")}
              >
                Add New +
              </button>
            </div>
            <div
              className="flex justify-between mb-4 "
              style={{ maxWidth: "80%", margin: "0 auto" }}
            >
              <div className="flex items-center">
                <span className="mr-2">Display</span>
                <select
                  value={displayCount}
                  onChange={(e) => setDisplayCount(Number(e.target.value))}
                  className="border rounded px-2 py-1"
                >
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="ml-2">records</span>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border rounded px-2 py-1 mb-4"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <TableContainer
                component={Paper}
                style={{ maxWidth: "80%", margin: "0 auto" }}
              >
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      {["Table No.", "POS", "Action"].map((header) => (
                        <TableCell
                          key={header}
                          sx={{
                            fontWeight: "bold",
                            color: "#28bfdb",
                            textAlign: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => handleSort(header.toLowerCase())}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {header}
                            {sortColumn === header.toLowerCase() &&
                              (sortDirection === "asc" ? (
                                <ChevronUpIcon
                                  style={{
                                    marginLeft: "5px",
                                    width: "16px",
                                    height: "16px",
                                  }}
                                />
                              ) : (
                                <ChevronDownIcon
                                  style={{
                                    marginLeft: "5px",
                                    width: "16px",
                                    height: "16px",
                                  }}
                                />
                              ))}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedData.slice(0, displayCount).length > 0 ? (
                      sortedData.slice(0, displayCount).map((item) => (
                        <TableRow
                          key={item._id}
                          sx={{ borderBottom: "1px solid #e5e5e5" }}
                        >
                          <TableCell sx={{ textAlign: "center" }}>
                            {item.tableNo}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {item.pos}
                          </TableCell>
                          <TableCell sx={{ textAlign: "center" }}>
                            {/* <span
                              style={{
                                display: "inline-block",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: "bold",
                                color:
                                  item.active === "yes" ? "#1c7c1c" : "#a83232",
                                backgroundColor:
                                  item.active === "yes" ? "#dff7df" : "#fddede",
                              }}
                            >
                              {item.active === "yes" ? "Active" : "Inactive"}
                            </span> */}
                            <IconButton
                              style={{ marginLeft: "10px", color: "#2563eb" }}
                              onClick={() => {
                                setSelectedTable(item); // Set the selected table data
                                setIsModalOpen(true); // Open the modal
                              }}
                            >
                              <PencilIcon
                                style={{ width: "16px", height: "16px" }}
                              />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          sx={{
                            textAlign: "center",
                            padding: "20px",
                            color: "#666",
                          }}
                        >
                          No data available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            <EditTableModal
  open={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  tableData={selectedTable}
  onSave={(updatedTable) => {
    // Update the table data
    const updatedData = tableData.map((table) =>
      table._id === updatedTable._id ? updatedTable : table
    );
    setTableData(updatedData);

    // Optionally, send the updated data to the backend
    fetch(`/api/tables/${updatedTable._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTable),
    }).catch((error) => console.error('Error updating table:', error));
  }}
/>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
