import connectSTR from '../../../lib/dbConnect';
import RestaurantBooking from '../../../lib/models/restaurantbooking';
import Profile from '../../../lib/models/Profile';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

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
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }
    const booking = await RestaurantBooking.findById(id);
    if (!booking || booking.username !== profile.username) {
      return NextResponse.json({ success: false, error: 'Booking not found or unauthorized' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: booking }, { status: 200 });
  } catch (error) {
    console.error('Error retrieving booking:', error);
    return NextResponse.json({ success: false, error: 'Failed to retrieve booking' }, { status: 400 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
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
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }
    const booking = await RestaurantBooking.findById(id);
    if (!booking || booking.username !== profile.username) {
      return NextResponse.json({ success: false, error: 'Booking not found or unauthorized' }, { status: 404 });
    }
    const updatedBooking = await RestaurantBooking.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    if (!updatedBooking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updatedBooking }, { status: 200 });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ success: false, error: 'Failed to update booking' }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();
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
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }
    const booking = await RestaurantBooking.findById(id);
    if (!booking || booking.username !== profile.username) {
      return NextResponse.json({ success: false, error: 'Booking not found or unauthorized' }, { status: 404 });
    }
    const deletedBooking = await RestaurantBooking.findByIdAndDelete(id);
    if (!deletedBooking) {
      return NextResponse.json({ success: false, error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Booking deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete booking' }, { status: 400 });
  }
}