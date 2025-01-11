import connectSTR from '../../../lib/dbConnect';
import NewBooking from '../../../lib/models/NewBooking';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    await mongoose.connect(connectSTR);
    const { id } = params;
    const guest = await NewBooking.findById(id);
    
    if (!guest) {
      return NextResponse.json(
        { success: false, error: 'Guest not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: guest }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving guest details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve guest details' },
      { status: 400 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await mongoose.connect(connectSTR);
    const { id } = params;
    const data = await req.json();

    const updatedGuest = await NewBooking.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    if (!updatedGuest) {
      return NextResponse.json(
        { success: false, error: 'Guest not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedGuest }, { status: 200 });
  } catch (error) {
    console.error('Error updating guest details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update guest details' },
      { status: 400 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await mongoose.connect(connectSTR);
    const { id } = params;
    const deletedGuest = await NewBooking.findByIdAndDelete(id);

    if (!deletedGuest) {
      return NextResponse.json(
        { success: false, error: 'Guest not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Guest successfully deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete guest' },
      { status: 400 }
    );
  }
}