import connectSTR from '../../lib/dbConnect';
import RoomCategory from '../../lib/models/RoomCategory';
import Profile from '../../lib/models/Profile'; // Import Profile model
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

// POST method to create a new RoomCategory
export async function POST(req) {
  try {
    await connectToDatabase();
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

    // Create a new room category with the username
    const newRoomCategory = new RoomCategory({
      ...data,
      username: profile.username,
    });

    await newRoomCategory.save();
    return NextResponse.json({ success: true, data: newRoomCategory }, { status: 201 });
  } catch (error) {
    console.error('Error creating room category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create room category' },
      { status: 400 }
    );
  }
}

// GET method to retrieve all RoomCategories
export async function GET(req) {
  try {
    await connectToDatabase();
    if (!mongoose.models.RoomCategory) {
      mongoose.model('RoomCategory', RoomCategory.schema);
    }

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

    // Fetch all room categories from the database filtered by username
    const roomCategories = await RoomCategory.find({ username: profile.username });

    return NextResponse.json({ success: true, data: roomCategories }, { status: 200 });
  } catch (error) {
    console.error('Error fetching room categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch room categories' },
      { status: 500 }
    );
  }
}