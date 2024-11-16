import mongoose from 'mongoose';
import connectSTR from '../../../lib/dbConnect';
import Billing from '../../../lib/models/Billing';
import { NextResponse } from 'next/server';

// Fetch a single bill by ID (GET)
export async function GET(req, { params }) {
  const { id } = params;
  try {
    await mongoose.connect(connectSTR);
    const bill = await Billing.findById(id);

    if (!bill) {
      return NextResponse.json(
        { success: false, error: 'Bill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: bill }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bill' },
      { status: 400 }
    );
  }
}

// Update a bill by ID (PUT)
export async function PUT(req, { params }) {
  const { id } = params;
  try {
    await mongoose.connect(connectSTR);
    const data = await req.json();

    const updatedBill = await Billing.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedBill) {
      return NextResponse.json(
        { success: false, error: 'Bill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedBill }, { status: 200 });
  } catch (error) {
    console.error('Error updating bill:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update bill' },
      { status: 400 }
    );
  }
}

// Delete a bill by ID (DELETE)
export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    await mongoose.connect(connectSTR);
    const deletedBill = await Billing.findByIdAndDelete(id);

    if (!deletedBill) {
      return NextResponse.json(
        { success: false, error: 'Bill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedBill }, { status: 200 });
  } catch (error) {
    console.error('Error deleting bill:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete bill' },
      { status: 400 }
    );
  }
}
