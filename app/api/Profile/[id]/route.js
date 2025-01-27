import mongoose from 'mongoose';
import connectSTR from '../../../lib/dbConnect';
import Profile from '../../../lib/models/Profile';
import bcrypt from 'bcrypt';
import { jwtVerify } from 'jose'; // Import jwtVerify for decoding JWT
import { NextResponse } from 'next/server';
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

const connectToDatabase = async () => {
  if (mongoose.connections[0]?.readyState === 1) return;
  try {
    await mongoose.connect(connectSTR, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err.message);
    throw new Error("Database connection failed.");
  }
};

// GET method to fetch a specific profile by ID
export async function GET(req, { params }) {
  try {
    await connectToDatabase();
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
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json({
        success: false,
        error: 'Profile not found'
      }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: profile }, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch profile' },
      { status: 400 }
    );
  }
}

// PUT method to update a specific profile by ID
export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const data = await req.json();
    const token = req.cookies.get('authToken')?.value;
    const authtoken = req.cookies.get('adminauthToken')?.value;
    if (!token && !authtoken) {
      return NextResponse.json({
        success: false,
        error: 'Authentication token missing'
      }, { status: 401 });
    }
    // Verify the token
    if (token) {
      const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
      const userId = decoded.payload.id;
    }
    // Find the profile by userId to get the username
    const profile = await Profile.findById(id);
    if (!profile) {
      return NextResponse.json({
        success: false,
        error: 'Profile not found'
      }, { status: 404 });
    }
    // Hash the password if it is provided
    let updatedData = { ...data, username: profile.username };
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      updatedData.password = hashedPassword;
    }
    // Update the profile
    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true }
    );
    if (!updatedProfile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, data: updatedProfile },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update profile' },
      { status: 400 }
    );
  }
}

// DELETE method to delete a specific profile by ID
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    // Find and delete the profile by ID
    const deletedProfile = await Profile.findByIdAndDelete(id);
    if (!deletedProfile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, message: 'Profile deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete profile' },
      { status: 400 }
    );
  }
}



// PATCH route to toggle the active status
export async function PATCH(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params; // Await params

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

    // Fetch the profile by ID and ensure it belongs to the current user
    const fetchedProfile = await Profile.findById(id);
    if (!fetchedProfile || fetchedProfile.username !== profile.username) {
      return NextResponse.json(
        { success: false, error: 'Profile not found or unauthorized' },
        { status: 404 }
      );
    }

    // Toggle the active status
    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      { active: fetchedProfile.active === 'yes' ? 'no' : 'yes' },
      { new: true }
    );

    if (!updatedProfile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedProfile }, { status: 200 });
  } catch (error) {
    console.error('Error toggling active status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to toggle active status' },
      { status: 400 }
    );
  }
}