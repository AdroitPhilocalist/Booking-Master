import connectSTR from '../../../lib/dbConnect';
import RoomCategory from '../../../lib/models/RoomCategory';
import Profile from '../../../lib/models/Profile'; // Import Profile model
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Import jwtVerify for decoding JWT

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Connect to the database
const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(connectSTR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    // Extract the token from cookies
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication token missing' 
      }, { status: 401 });
    }

    // Verify the token
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;

    // Find the profile by userId to get the username
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        error: 'Profile not found' 
      }, { status: 404 });
    }

    // Fetch the room category by ID and ensure it belongs to the current user
    const roomCategory = await RoomCategory.findById(id);
    if (!roomCategory || roomCategory.username !== profile.username) {
      return NextResponse.json(
        { success: false, error: 'Room category not found or unauthorized' },
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
  try {
    await connectToDatabase();
    const { id } = params;
    const data = await req.json();

    // Extract the token from cookies
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication token missing' 
      }, { status: 401 });
    }

    // Verify the token
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;

    // Find the profile by userId to get the username
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        error: 'Profile not found' 
      }, { status: 404 });
    }

    // Fetch the room category by ID and ensure it belongs to the current user
    const roomCategory = await RoomCategory.findById(id);
    if (!roomCategory || roomCategory.username !== profile.username) {
      return NextResponse.json(
        { success: false, error: 'Room category not found or unauthorized' },
        { status: 404 }
      );
    }

    // Build the update object dynamically based on provided fields
    const updateFields = { ...data, username: profile.username }; // Ensure username is included

    // Update the room category
    const updatedRoomCategory = await RoomCategory.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedRoomCategory) {
      return NextResponse.json(
        { success: false, error: 'Room category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedRoomCategory }, { status: 200 });
  } catch (error) {
    console.error('Error updating room category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update room category' },
      { status: 400 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    // Extract the token from cookies
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication token missing' 
      }, { status: 401 });
    }

    // Verify the token
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;

    // Find the profile by userId to get the username
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        error: 'Profile not found' 
      }, { status: 404 });
    }

    // Fetch the room category by ID and ensure it belongs to the current user
    const roomCategory = await RoomCategory.findById(id);
    if (!roomCategory || roomCategory.username !== profile.username) {
      return NextResponse.json(
        { success: false, error: 'Room category not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete the room category
    const deletedRoomCategory = await RoomCategory.findByIdAndDelete(id);

    if (!deletedRoomCategory) {
      return NextResponse.json(
        { success: false, error: 'Room category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Room category deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting room category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete room category' },
      { status: 400 }
    );
  }
}