"use client";
import React, { useState, useEffect } from "react";
import { TextField, Button, Box, MenuItem, FormControl, InputLabel, Select } from "@mui/material";

const AddNewBookingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    tableNo: "",
    date: "",
    time: "",
    guestName: "",
  });
  const [availableTables, setAvailableTables] = useState([]);

  useEffect(() => {
    const fetchAvailableTables = async () => {
      try {
        const response = await fetch('/api/tables');
        const data = await response.json();
        if (data.success) {
          setAvailableTables(data.data); // Store available table numbers
        } else {
          console.error("Failed to fetch available tables:", data.error);
        }
      } catch (error) {
        console.error("Error fetching tables:", error);
      }
    };
    fetchAvailableTables();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.tableNo && formData.date && formData.time && formData.guestName) {
      onSubmit({ id: Date.now(), ...formData });
      setFormData({ tableNo: "", date: "", time: "", guestName: "" });
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <FormControl required>
        <InputLabel>Table No.</InputLabel>
        <Select
          label="Table No."
          name="tableNo"
          value={formData.tableNo}
          onChange={handleChange}
        >
          <MenuItem value="">Select a table</MenuItem>
          {availableTables.map((table) => (
            <MenuItem key={table._id} value={table.tableNo}>
              Table {table.tableNo}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Date"
        name="date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={formData.date}
        onChange={handleChange}
        required
      />
      <TextField
        label="Time"
        name="time"
        type="time"
        InputLabelProps={{ shrink: true }}
        value={formData.time}
        onChange={handleChange}
        required
      />
      <TextField
        label="Guest Name"
        name="guestName"
        value={formData.guestName}
        onChange={handleChange}
        required
      />
      <Button type="submit" variant="contained" sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}>
        Submit
      </Button>
    </Box>
  );
};

export default AddNewBookingForm;
