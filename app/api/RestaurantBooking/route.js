import mongoose from 'mongoose';
import connectSTR from '../../lib/dbConnect';
import RestaurantBooking from '../../lib/models/restaurantbooking';
import Table from '../../lib/models/Tables';
import Profile from '../../lib/models/Profile';
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

export async function GET(req) {
  try {
    await connectToDatabase();
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Authentication token missing' }, { status: 401 });
    }
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }
    const bookings = await RestaurantBooking.find({ username: profile.username });
    return NextResponse.json({ success: true, data: bookings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const { tableNo, date, time, guestName } = data;
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Authentication token missing' }, { status: 401 });
    }
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
    }
    const table = await Table.findOne({ tableNo });
    if (!table) {
      return NextResponse.json({ success: false, error: 'Table not found' }, { status: 404 });
    }
    const newBooking = new RestaurantBooking({
      tableNo,
      date,
      time,
      guestName,
      username: profile.username, // Set the username from the profile
    });
    await newBooking.save();
    return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 });
  }
}