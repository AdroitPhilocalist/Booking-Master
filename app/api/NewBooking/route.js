import connectSTR from '../../lib/dbConnect';
import NewBooking from '../../lib/models/NewBooking';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await mongoose.connect(connectSTR);
    const data = await req.json();

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
      visaExpireDate: data.visaExpireDate
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
    const bookings = await NewBooking.find();
    return NextResponse.json({ success: true, data: bookings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' }, 
      { status: 500 }
    );
  }
}
