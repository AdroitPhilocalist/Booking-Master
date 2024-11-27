"use client";
import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const AddNewBookingForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    tableNo: "",
    date: "",
    time: "",
    guestName: "",
  });

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
      <TextField
        label="Table No."
        name="tableNo"
        value={formData.tableNo}
        onChange={handleChange}
        required
      />
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
