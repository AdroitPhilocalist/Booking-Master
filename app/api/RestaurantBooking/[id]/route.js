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