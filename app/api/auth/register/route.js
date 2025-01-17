import connectSTR from '../../../lib/dbConnect';
import Profile from '../../../lib/models/Profile';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
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


export async function POST(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    // Validate required fields
    if (!data.username || !data.password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
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
    // Create a new profile
    const newProfile = new Profile({
      hotelName: data.hotelName,
      mobileNo: data.mobileNo,
      altMobile: data.altMobile,
      email: data.email,
      gstNo: data.gstNo,
      website: data.website,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      district: data.district,
      country: data.country,
      pinCode: data.pinCode,
      username: data.username,
      password: data.password,
    });
    await newProfile.save();
    return NextResponse.json({ success: true, data: newProfile }, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create profile' },
      { status: 400 }
    );
  }
}