"use client";
import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  Container, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  TextField, 
  Typography, 
  Paper, 
  Grid, 
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateInvoicePage = ({ onInvoiceCreate, existingInvoice, onCancel }) => {
  const [menu, setMenu] = useState([]); 
  const [selectedItems, setSelectedItems] = useState([]); 
  const [formData, setFormData] = useState({ 
    invoiceno: "", 
    date: "", 
    time: "", 
    custname: "", 
    custphone: "", 
    gstin: "", 
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
        custphone: existingInvoice.custphone || "", 
        gstin: existingInvoice.gstin || "", 
        menuitem: existingInvoice.menuitem || [], 
        quantity: existingInvoice.quantity || [], 
        price: existingInvoice.price || [], 
        totalamt: existingInvoice.totalamt || 0, 
        gst: existingInvoice.gst || calculateGST(existingInvoice.totalamt || 0), 
        payableamt: 
          existingInvoice.payableamt || 
          calculatePayableAmount(existingInvoice.totalamt || 0), 
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
        // Show success toast with onClose callback to reload the page
        toast.success('👍 Item Saved Successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        console.error("Error saving invoice:", data.error);
        toast.error('👎 Failed to save invoice', {
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
      console.error("Error during invoice save:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      invoiceno: "",
      date: "",
      time: "",
      custname: "",
      custphone: "",
      gstin: "",
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
    <Container 
      maxWidth="sm" 
      sx={{ height: '100vh', overflowY: 'auto', paddingY: 2 }} 
    > 
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mt: 3, 
          maxHeight: 'calc(100vh - 100px)', 
          overflowY: 'auto' 
        }} 
      > 
        <Typography variant="h4" gutterBottom align="center"> 
          Create Invoice 
        </Typography> 
        <form onSubmit={handleSubmit}> 
          <Grid 
            container 
            spacing={2} 
            sx={{ maxHeight: '70vh', overflowY: 'auto' }} 
          > 
            {[ 
              { label: "Invoice No.", name: "invoiceno", type: "text" }, 
              { label: "Date", name: "date", type: "date" }, 
              { label: "Time", name: "time", type: "time" }, 
              { label: "Customer Name", name: "custname", type: "text" }, 
              { label: "Customer Phone", name: "custphone", type: "tel" }, 
              { label: "GSTIN", name: "gstin", type: "text" }, 
            ].map(({ label, name, type }) => ( 
              <Grid item xs={12} key={name}> 
                <TextField 
                  fullWidth 
                  label={label} 
                  name={name} 
                  type={type} 
                  value={formData[name]} 
                  onChange={handleChange} 
                  variant="outlined" 
                  required 
                  InputLabelProps={{ 
                    shrink: 
                      type === "date" || 
                      type === "time" || 
                      !!formData[name] 
                  }} 
                /> 
              </Grid> 
            ))} 

            {/* Menu Item Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select Menu Items</InputLabel>
                <Select
                  label="Select Menu Items"
                  onChange={addMenuItem}
                  value=""
                  sx={{ 
                    maxHeight: 200, 
                    overflowY: 'auto' 
                  }}
                >
                  {menu.map((item) => (
                    <MenuItem key={item._id} value={item.itemName}>
                      {item.itemName} - ₹{item.price}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Selected Items Table */}
            {selectedItems.length > 0 && (
              <Grid item xs={12}>
                <TableContainer 
                  component={Paper} 
                  sx={{ 
                    maxHeight: 300, 
                    overflow: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '8px'
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#f1f1f1'
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#888',
                      borderRadius: '4px'
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: '#555'
                    }
                  }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell align="right">Price</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell align="right">₹{item.price}</TableCell>
                          <TableCell align="right">
                            <TextField
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(index, parseInt(e.target.value))}
                              inputProps={{ min: 1 }}
                              variant="standard"
                              sx={{ width: 60 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton 
                              color="error" 
                              onClick={() => removeMenuItem(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}

            {/* Total Amount and Actions */}
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
              }}>
                <Box>
                  <Typography variant="h6">Total Amount: ₹{formData.totalamt}</Typography>
                  <Typography variant="h6">GST (18%): ₹{formData.gst}</Typography>
                  <Typography variant="h6">Payable Amount: ₹{formData.payableamt}</Typography>
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  gap: 2,
                  flexWrap: 'wrap'
                }}>
                  <Button variant="contained" color="primary" type="submit" startIcon={<SaveIcon />}>
                    Save
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={resetForm} startIcon={<RestartAltIcon />}>
                    Reset
                  </Button>
                  <Button variant="outlined" color="error" onClick={handleCancel} startIcon={<CancelIcon />}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateInvoicePage;