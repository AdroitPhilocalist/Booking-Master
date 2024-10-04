import connectSTR from '../../lib/dbConnect';
import NewBooking from '../../lib/models/NewBooking';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await mongoose.connect(connectSTR);
        const data = await req.json();

        // Create a new booking instance
        const newBooking = new NewBooking({
            bookingType: data.bookingType,
            bookingId: data.bookingId,
            bookingSource: data.bookingSource,
            bookingPoint: data.bookingPoint,
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
            guestType: data.guestType,
            guestNotes: data.guestNotes,
            internalNotes: data.internalNotes
        });

        await newBooking.save(); // Save new booking to the database

        return NextResponse.json({ success: true, data: newBooking }, { status: 201 });
    } catch (error) {
        console.error('Error creating new booking:', error);
        return NextResponse.json({ success: false, error: 'Failed to create new booking' }, { status: 400 });
    }
}

export async function GET(req) {
    try {
        await mongoose.connect(connectSTR);
        
        const bookings = await NewBooking.find(); // Fetch all bookings from the database
        
        return NextResponse.json({ success: true, data: bookings }, { status: 200 });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch bookings' }, { status: 500 });
    }
}