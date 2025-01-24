// app/api/restaurantinvoice/[id]/route.js
import connectSTR from '../../../lib/dbConnect';
import restaurantinvoice from '../../../lib/models/restaurantinvoice';
import mongoose from 'mongoose';
import Profile from '../../../lib/models/Profile';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Import jwtVerify for decoding JWT
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function GET(req, { params }) {
  const { id } = params; // Get the invoice ID from the URL
  try {
    await mongoose.connect(connectSTR);
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication token missing' },
        { status: 401 }
      );
    }
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }
    const invoice = await restaurantinvoice.findById(id);
    if (!invoice || invoice.username !== profile.username) {
      return NextResponse.json({ success: false, error: 'Invoice not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json(invoice, { status: 200 });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch invoice' }, { status: 400 });
  }
}

export async function PUT(req, { params }) {
  const { id } = params; // Get the invoice ID from the URL
  try {
    await mongoose.connect(connectSTR);
    const data = await req.json();
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication token missing' },
        { status: 401 }
      );
    }
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }
    const updatedInvoice = await restaurantinvoice.findByIdAndUpdate(
      id,
      { $set: { ...data, username: profile.username } }, // Ensure username is included
      { new: true }
    );
    if (!updatedInvoice || updatedInvoice.username !== profile.username) {
      return NextResponse.json({ success: false, error: 'Invoice not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedInvoice }, { status: 200 });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ success: false, error: 'Failed to update invoice' }, { status: 400 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await mongoose.connect(connectSTR);
    const { id } = params; // Extract invoice ID from the request parameters
    const data = await req.json(); // Extract update data from the request body
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication token missing' },
        { status: 401 }
      );
    }
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }
    const updatedInvoice = await restaurantinvoice.findByIdAndUpdate(
      id,
      { $set: { ...data, username: profile.username } }, // Ensure username is included
      { new: true }
    );
    if (!updatedInvoice || updatedInvoice.username !== profile.username) {
      return NextResponse.json({ success: false, error: 'Invoice not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedInvoice }, { status: 200 });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json({ success: false, error: 'Failed to update invoice' }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params; // Get the invoice ID from the URL
  try {
    await mongoose.connect(connectSTR);
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication token missing' },
        { status: 401 }
      );
    }
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }
    const deletedInvoice = await restaurantinvoice.findByIdAndDelete(id);
    if (!deletedInvoice || deletedInvoice.username !== profile.username) {
      return NextResponse.json({ success: false, error: 'Invoice not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Invoice deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete invoice' }, { status: 400 });
  }
}