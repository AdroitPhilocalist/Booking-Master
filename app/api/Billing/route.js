import mongoose from 'mongoose';
import connectSTR from '../../lib/dbConnect';
import Billing from '../../lib/models/Billing';
import { NextResponse } from 'next/server';

// Create a new bill (POST)
export async function POST(req) {
  try {
    await mongoose.connect(connectSTR);
    const data = await req.json();

    // Validate required fields
    if (!data.roomNo || !data.billStartDate || !data.billEndDate ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newBill = new Billing(data);
    const result = await newBill.save();
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating bill:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create bill' },
      { status: 400 }
    );
  }
}

// Fetch all bills (GET)
export async function GET(req) {
  try {
    await mongoose.connect(connectSTR);
    const bills = await Billing.find({});
    return NextResponse.json({ success: true, data: bills }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bills:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bills' },
      { status: 400 }
    );
  }
}