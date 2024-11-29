import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography
} from '@material-ui/core';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  },
  paper: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2)
  },
  textField: {
    marginBottom: theme.spacing(2)
  },
  button: {
    marginTop: theme.spacing(2)
  }
}));

const CreateInvoicePage = () => {
  const classes = useStyles();
  const [invoiceNo, setInvoiceNo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [custName, setCustName] = useState('');
  const [totalAmt, setTotalAmt] = useState('');
  const [gst, setGst] = useState('');
  const [payableAmt, setPayableAmt] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/restaurantinvoice', {
        invoiceno: invoiceNo,
        date: new Date(date),
        time,
        custname: custName,
        totalamt: parseFloat(totalAmt),
        gst: parseFloat(gst),
        payableamt: parseFloat(payableAmt)
      });
      // Reset form fields
      setInvoiceNo('');
      setDate('');
      setTime('');
      setCustName('');
      setTotalAmt('');
      setGst('');
      setPayableAmt('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h4">Create Restaurant Invoice</Typography>
      <Paper className={classes.paper}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.textField}
                label="Invoice No."
                variant="outlined"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.textField}
                label="Date"
                variant="outlined"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.textField}
                label="Time"
                variant="outlined"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.textField}
                label="Customer Name"
                variant="outlined"
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.textField}
                label="Total Amount"
                variant="outlined"
                type="number"
                value={totalAmt}
                onChange={(e) => setTotalAmt(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.textField}
                label="GST"
                variant="outlined"
                type="number"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.textField}
                label="Payable Amount"
                variant="outlined"
                type="number"
                value={payableAmt}
                onChange={(e) => setPayableAmt(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                className={classes.button}
                variant="contained"
                color="primary"
                type="submit"
              >
                Create Invoice
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default CreateInvoicePage;