import connectSTR from '../../../lib/dbConnect';
import NewBooking from '../../../lib/models/NewBooking';
import mongoose from 'mongoose';
import Profile from '../../../lib/models/Profile';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Import jwtVerify for decoding JWT
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';


export async function GET(req, { params }) {
  try {
    await mongoose.connect(connectSTR);
    // Extract the token from cookies
    const authToken = req.cookies.get('authToken')?.value;
    const userAuthToken = req.cookies.get('userAuthToken')?.value;
    if (!authToken && !userAuthToken) {
      return NextResponse.json({
        success: false,
        error: 'Authentication token missing'
      }, { status: 401 });
    }

    let decoded, userId;
    if (authToken) {
      // Verify the authToken (legacy check)
      decoded = await jwtVerify(authToken, new TextEncoder().encode(SECRET_KEY));
      userId = decoded.payload.id;
    } else if (userAuthToken) {
      // Verify the userAuthToken
      decoded = await jwtVerify(userAuthToken, new TextEncoder().encode(SECRET_KEY));
      userId = decoded.payload.profileId; // Use userId from the new token structure
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid token structure'
      }, { status: 400 });
    }
    // Find the profile by userId to get the username
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json({
        success: false,
        error: 'Profile not found'
      }, { status: 404 });
    }
    const { id } = params;
    const guest = await NewBooking.findById(id);

    if (!guest) {
      return NextResponse.json(
        { success: false, error: 'Guest not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: guest }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving guest details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve guest details' },
      { status: 400 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    await mongoose.connect(connectSTR);
    const { id } = params;
    const data = await req.json();
    // Extract the token from cookies
    const authToken = req.cookies.get('authToken')?.value;
    const userAuthToken = req.cookies.get('userAuthToken')?.value;
    if (!authToken && !userAuthToken) {
      return NextResponse.json({
        success: false,
        error: 'Authentication token missing'
      }, { status: 401 });
    }

    let decoded, userId;
    if (authToken) {
      // Verify the authToken (legacy check)
      decoded = await jwtVerify(authToken, new TextEncoder().encode(SECRET_KEY));
      userId = decoded.payload.id;
    } else if (userAuthToken) {
      // Verify the userAuthToken
      decoded = await jwtVerify(userAuthToken, new TextEncoder().encode(SECRET_KEY));
      userId = decoded.payload.profileId; // Use userId from the new token structure
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid token structure'
      }, { status: 400 });
    }
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }
    const updatedGuest = await NewBooking.findByIdAndUpdate(
      id,
      { $set: { ...data, username: profile.username } },
      { new: true, runValidators: true }
    );

    if (!updatedGuest) {
      return NextResponse.json(
        { success: false, error: 'Guest not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedGuest }, { status: 200 });
  } catch (error) {
    console.error('Error updating guest details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update guest details' },
      { status: 400 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await mongoose.connect(connectSTR);
    const { id } = params;
    // Extract the token from cookies
    const authToken = req.cookies.get('authToken')?.value;
    const userAuthToken = req.cookies.get('userAuthToken')?.value;
    if (!authToken && !userAuthToken) {
      return NextResponse.json({
        success: false,
        error: 'Authentication token missing'
      }, { status: 401 });
    }

    let decoded, userId;
    if (authToken) {
      // Verify the authToken (legacy check)
      decoded = await jwtVerify(authToken, new TextEncoder().encode(SECRET_KEY));
      userId = decoded.payload.id;
    } else if (userAuthToken) {
      // Verify the userAuthToken
      decoded = await jwtVerify(userAuthToken, new TextEncoder().encode(SECRET_KEY));
      userId = decoded.payload.profileId; // Use userId from the new token structure
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid token structure'
      }, { status: 400 });
    }
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }
    const deletedGuest = await NewBooking.findByIdAndDelete(id);

    if (!deletedGuest) {
      return NextResponse.json(
        { success: false, error: 'Guest not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Guest successfully deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting guest:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete guest' },
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