import mongoose from 'mongoose';
import connectSTR from '../../../lib/dbConnect';
import Profile from '../../../lib/models/Profile';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

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
    const { id } = params;
    const profile = await Profile.findById(id);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
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
    // Validate required fields
    if (
      !data.hotelName ||
      !data.mobileNo ||
      !data.email ||
      !data.username
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    // Check if username already exists for another profile
    const existingProfile = await Profile.findOne({ username: data.username }).where('_id').ne(id);
    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      );
    }
    // Hash the password if it is provided
    let updatedData = { ...data };
    if (data.password) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      updatedData.password = hashedPassword;
    }
    // Update the profile
    const updatedProfile = await Profile.findByIdAndUpdate(
      id,
      { $set: updatedData },
      { new: true, runValidators: true }
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