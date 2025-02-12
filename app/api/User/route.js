import connectSTR from '../../lib/dbConnect';
import User from '../../lib/models/User';
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

// POST method to create a new User
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

    const newUser = new User({
      ...data,
      username: profile.username,
    });

    await newUser.save();
    return NextResponse.json({ success: true, data: newUser }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 400 }
    );
  }
}

// GET method to retrieve all Users
export async function GET(req) {
  try {
    await connectToDatabase();
    if (!mongoose.models.User) {
      mongoose.model('User', User.schema);
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

    // Fetch all users from the database filtered by username
    const users = await User.find({ username: profile.username });

    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}