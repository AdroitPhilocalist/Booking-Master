// pages/api/restaurantBookings/index.js
import mongoose from 'mongoose';
import connectSTR from '../../lib/dbConnect';
import RestaurantBooking from '../../lib/models/restaurantbooking';
import Table from '../../lib/models/Tables';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await mongoose.connect(connectSTR);

    // Optionally filter bookings by table number
    // const { tableNo } = req.query;
    // const filter = tableNo ? { tableNo } : {};

    const bookings = await RestaurantBooking.find();
    return NextResponse.json({ success: true, data: bookings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
  }
}



export async function POST(req) {
    try {
      await mongoose.connect(connectSTR);
  
      const data = await req.json();
      const { tableNo, date, time, guestName } = data;
  
      // Validate table existence
      const table = await Table.findOne({ tableNo });
      if (!table) {
        return NextResponse.json({ success: false, error: 'Table not found' }, { status: 404 });
      }
  
      // Create new booking
      const newBooking = new RestaurantBooking({ tableNo, date, time, guestName });
      await newBooking.save();
  
      return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
    } catch (error) {
      console.error('Error creating booking:', error);
      return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 });
    }
  }
