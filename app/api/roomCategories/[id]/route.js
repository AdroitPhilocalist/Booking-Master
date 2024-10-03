import connectSTR from '../../../lib/dbConnect';
import RoomCategory from '../../../lib/models/RoomCategory';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  const { id } = params;
  try {
    await mongoose.connect(connectSTR);
    const roomCategory = await RoomCategory.findById(id);
    if (!roomCategory) {
      return NextResponse.json(
        { success: false, error: 'Room category not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: roomCategory }, { status: 200 });
  } catch (error) {
    console.error('Error fetching room category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch room category' },
      { status: 400 }
    );
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  try {
    await mongoose.connect(connectSTR);
    const data = await req.json();

    const updatedCategory = await RoomCategory.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      return NextResponse.json(
        { success: false, error: 'Room category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedCategory }, { status: 200 });
  } catch (error) {
    console.error('Error updating room category:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update room category' },
      { status: 400 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    await mongoose.connect(connectSTR);
    const deletedCategory = await RoomCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return NextResponse.json(
        { success: false, error: 'Room category not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: deletedCategory }, { status: 200 });
  } catch (error) {
    console.error('Error deleting room category:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete room category' },
      { status: 400 }
    );
  }
}
