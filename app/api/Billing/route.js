// app/api/Billing/route.js
import connectSTR from '../../lib/dbConnect';
import Billing from '../../lib/models/Billing';
import mongoose from "mongoose";
import Profile from '../../lib/models/Profile';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Import jwtVerify for decoding JWT
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(connectSTR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export async function POST(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const token = req.cookies.get('authToken')?.value;
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    const profile = await Profile.findById(userId);
    const newData = {
      ...data,
      username: profile.username
    };
    if (!newData.roomNo || !newData.billStartDate || !newData.billEndDate || !newData.itemList || 
        !newData.priceList || !newData.quantityList) {
      return NextResponse.json(
        { success: false, error: 'Missing or mismatched required fields' },
        { status: 400 }
      );
    }
    const newBill = new Billing(newData);
    await newBill.save();
    return NextResponse.json({ success: true, data: newBill }, { status: 201 });
  } catch (error) {
    console.error('Error creating bill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create bill' }, 
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const token = req.cookies.get('authToken')?.value;
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    const profile = await Profile.findById(userId);
    console.log('username:', profile.username);
    const bills = await Billing.find({ username: profile.username });
    console.log('bills:', bills);
    return NextResponse.json({ success: true, data: bills }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bills:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch bills' }, { status: 500 });
  }
}