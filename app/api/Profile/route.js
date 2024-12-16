import mongoose from 'mongoose';
import connectSTR from '../../lib/dbConnect';
import Profile from '../../lib/models/Profile';
import { NextResponse } from 'next/server';

// Create a new profile (POST)
export async function POST(req) {
  try {
    await mongoose.connect(connectSTR);
    const data = await req.json();

    // Validate required fields
    if (!data.hotelName || !data.mobileNo || !data.email || !data.addressLine1 || !data.district || !data.pinCode) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newProfile = new Profile(data);
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
export async function PUT(req) {
  try {
    await mongoose.connect(connectSTR);
    const data = await req.json();

    // Validate required fields
    if (
      !data.hotelName ||
      !data.mobileNo ||
      !data.email ||
      !data.addressLine1 ||
      !data.district ||
      !data.pinCode
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Update the profile
    const updatedProfile = await Profile.findOneAndUpdate(
      {}, // Empty filter to target the only profile in the database
      { $set: data }, // Update the profile with the provided data
      { new: true } // Return the updated document
    );

    if (!updatedProfile) {
      return NextResponse.json(
        { success: false, error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: updatedProfile },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile" },
      { status: 400 }
    );
  }
}
// Fetch all profiles (GET)
export async function GET(req) {
  try {
    await mongoose.connect(connectSTR);
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
