import connectSTR from '../../../lib/dbConnect';
import User from '../../../lib/models/User';
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

    // // Extract the token from cookies
    // const token = req.cookies.get('authToken')?.value;
    // const usertoken = req.cookies.get('userAuthToken')?.value;
    // if (!token && !usertoken) {
    //   return NextResponse.json({ 
    //     success: false, 
    //     error: 'Authentication token missing' 
    //   }, { status: 401 });
    // }

    // // Verify the token
    // const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    // const userId = decoded.payload.id;

    // // Find the profile by userId to get the username
    // const profile = await Profile.findById(userId);
    // if (!profile) {
    //   return NextResponse.json({ 
    //     success: false, 
    //     error: 'Profile not found' 
    //   }, { status: 404 });
    // }

    // Fetch the user by ID and ensure it belongs to the current user
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
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

    // Fetch the user by ID and ensure it belongs to the current user
    const user = await User.findById(id);
    if (!user || user.username !== profile.username) {
      return NextResponse.json(
        { success: false, error: 'User not found or unauthorized' },
        { status: 404 }
      );
    }

    // Build the update object dynamically based on provided fields
    const updateFields = { ...data, username: profile.username }; // Ensure username is included

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
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

    // Fetch the user by ID and ensure it belongs to the current user
    const user = await User.findById(id);
    if (!user || user.username !== profile.username) {
      return NextResponse.json(
        { success: false, error: 'User not found or unauthorized' },
        { status: 404 }
      );
    }

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 400 }
    );
  }
}