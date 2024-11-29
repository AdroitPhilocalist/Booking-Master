import mongoose from 'mongoose';
import connectSTR from '../../../lib/dbConnect';
import restaurantinvoice from '../../../lib/models/restaurantinvoice';
import { NextResponse } from 'next/server';

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(connectSTR, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

export async function GET(request) {
  try {
    await connectToDatabase();
    const invoices = await RestaurantInvoice.find();
    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Error fetching invoices' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const invoice = new RestaurantInvoice({
      invoiceno: data.invoiceno,
      date: data.date,
      time: data.time,
      custname: data.custname,
      totalamt: data.totalamt,
      gst: data.gst,
      payableamt: data.payableamt
    });
    const newInvoice = await invoice.save();
    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: 'Error creating invoice' }, { status: 400 });
  }
}