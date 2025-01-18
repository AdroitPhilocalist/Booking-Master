import mongoose from 'mongoose';
import connectSTR from '../../lib/dbConnect';
import Profile from '../../lib/models/Profile';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

// Connect to the database
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

// POST method to create a new profile
export async function POST(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    // Validate required fields
    if (
      !data.hotelName ||
      !data.mobileNo ||
      !data.email ||
      !data.username ||
      !data.password
    ) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    // Check if username already exists
    const existingProfile = await Profile.findOne({ username: data.username });
    if (existingProfile) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      );
    }
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newProfile = new Profile({
      ...data,
      password: hashedPassword,
    });
    const result = await newProfile.save();
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create profile' },
      { status: 400 }
    );
  }
}

// PUT method to update the profile
export async function PUT(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    // Validate required fields
    // if (
    //   !data.hotelName ||
    //   !data.mobileNo ||
    //   !data.email ||
    //   !data.username
    // ) {
    //   return NextResponse.json(
    //     { success: false, error: 'Missing required fields' },
    //     { status: 400 }
    //   );
    // }
    // Check if username already exists for another profile
    const existingProfile = await Profile.findOne({ username: data.username });
    if (existingProfile && existingProfile._id.toString() !== data._id) {
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
    const updatedProfile = await Profile.findOneAndUpdate(
      {}, // Empty filter to target the only profile in the database
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

// Fetch all profiles (GET)
export async function GET(req) {
  try {
    await connectToDatabase();
    const profiles = await Profile.find({});
    return NextResponse.json({ success: true, data: profiles }, { status: 200 });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profiles' },
      { status: 400 }
    );
  }
}