import connectSTR from '../../lib/dbConnect';
import RoomCategory from '../../lib/models/RoomCategory';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';



export async function POST(req) {
  try {
    await mongoose.connect(connectSTR);
    const data = await req.json();
    if (!data.image) {
      return NextResponse.json(
        { success: false, error: 'Image is required' },
        { status: 400 }
      );
    }
    const newRoomCategory = new RoomCategory(data);
    const result = await newRoomCategory.save();
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error('Error in POST request:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create room category' },
      { status: 400 }
    );
  }
}

export async function GET(req) {
  try {
    await mongoose.connect(connectSTR);
    const roomCategories = await RoomCategory.find({});
    return NextResponse.json({ success: true, data: roomCategories }, { status: 200 });
  } catch (error) {
    console.error('Error in GET request:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch room categories' },
      { status: 400 }
    );
  }
}
// Other HTTP methods like PUT, DELETE can also be added as needed.
