import connectSTR from '../../lib/dbConnect';
import NewBooking from '../../lib/models/NewBooking';
import Profile from '../../lib/models/Profile';
import mongoose from 'mongoose';
import { jwtVerify } from 'jose'; // Import jwtVerify for decoding JWT
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await mongoose.connect(connectSTR);
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
    // Find the profile by userId to get the username
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json({
        success: false,
        error: 'Profile not found'
      }, { status: 404 });
    }
    // Create a new booking instance with all fields including the new ones
    const newBooking = new NewBooking({
      bookingType: data.bookingType,
      bookingId: data.bookingId,
      pinCode: data.pinCode,
      mobileNo: data.mobileNo,
      guestName: data.guestName,
      companyName: data.companyName,
      gstin: data.gstin,
      guestEmail: data.guestEmail,
      adults: data.adults,
      children: data.children,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      expectedArrival: data.expectedArrival,
      expectedDeparture: data.expectedDeparture,
      bookingStatus: data.bookingStatus,
      address: data.address,
      remarks: data.remarks,
      state: data.state,
      mealPlan: data.mealPlan,
      bookingReference: data.bookingReference,
      stopPosting: data.stopPosting,
      guestNotes: data.guestNotes,
      internalNotes: data.internalNotes,
      roomNumbers: data.roomNumbers,
      referenceno: data.referenceno,
      guestidno: data.guestidno,
      guestid: data.guestid,
      dateofbirth: data.dateofbirth,
      dateofanniversary: data.dateofanniversary,
      // New fields
      passportIssueDate: data.passportIssueDate,
      passportExpireDate: data.passportExpireDate,
      visaNumber: data.visaNumber,
      visaIssueDate: data.visaIssueDate,
      visaExpireDate: data.visaExpireDate,
      username: profile.username
    });

    await newBooking.save();
    return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
  } catch (error) {
    console.error('Error creating new booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create new booking' },
      { status: 400 }
    );
  }
}

export async function GET(req) {
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
    const bookings = await NewBooking.find({ username: profile.username });
    return NextResponse.json({ success: true, data: bookings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
