"use client";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";


import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650
  }
}));

const InvoicePage = () => {
  const classes = useStyles();
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get('/api/restaurantinvoice');
        setInvoices(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div>
      <h1>Restaurant Invoices</h1>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Invoice No.</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>GST</TableCell>
              <TableCell>Payable Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice._id}>
                <TableCell>{invoice.invoiceno}</TableCell>
                <TableCell>{invoice.date.toLocaleDateString()}</TableCell>
                <TableCell>{invoice.custname}</TableCell>
                <TableCell>{invoice.totalamt}</TableCell>
                <TableCell>{invoice.gst}</TableCell>
                <TableCell>{invoice.payableamt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default InvoicePage;