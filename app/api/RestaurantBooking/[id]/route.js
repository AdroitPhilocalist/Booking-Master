import connectSTR from '../../../lib/dbConnect';
import RestaurantBooking from '../../../lib/models/restaurantbooking';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
export async function DELETE(req, { params }) {
    try {
      await mongoose.connect(connectSTR);
  
      const { id } = params; // Get the booking ID from the URL
  
      // Find and delete the booking
      const deletedBooking = await RestaurantBooking.findByIdAndDelete(id);
  
      if (!deletedBooking) {
        return NextResponse.json(
          { success: false, error: 'Booking not found' },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { success: true, message: 'Booking deleted successfully' },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting booking:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to delete booking' },
        { status: 500 }
      );
    }
  }


  export async function PUT(req, { params }) {
    try {
        // Connect to the database
        await mongoose.connect(connectSTR);

        // Extract the booking ID from the URL params
        const { id } = params;

        // Parse the request body to get the updated booking data
        const data = await req.json();

        // Find and update the booking by ID
        const updatedBooking = await RestaurantBooking.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        // If no booking is found with the given ID, return an error
        if (!updatedBooking) {
            return NextResponse.json(
                { success: false, error: 'Booking not found' },
                { status: 404 }
            );
        }

        // Return the updated booking data
        return NextResponse.json({ success: true, data: updatedBooking });
    } catch (error) {
        console.error('Error updating booking:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update booking' },
            { status: 400 }
        );
    }
}