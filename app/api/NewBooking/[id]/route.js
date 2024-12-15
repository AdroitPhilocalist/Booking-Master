import connectSTR from '../../../lib/dbConnect';
import NewBooking from '../../../lib/models/NewBooking';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
    try {
        await mongoose.connect(connectSTR);

        // Extract guest ID from the route params
        const { id } = params;

        // Parse request body for updates
        const data = await req.json();

        // Update the guest's roomNumbers field
        const updatedGuest = await NewBooking.findByIdAndUpdate(
            id,
            { $addToSet: { roomNumbers: { $each: data.roomNumbers } } }, // Avoids duplicate room numbers
            { new: true, runValidators: true } // Return updated document and ensure validations
        );

        if (!updatedGuest) {
            return NextResponse.json({ success: false, error: 'Guest not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedGuest }, { status: 200 });
    } catch (error) {
        console.error('Error updating guest room numbers:', error);
        return NextResponse.json({ success: false, error: 'Failed to update guest room numbers' }, { status: 400 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await mongoose.connect(connectSTR);

        // Extract guest ID from the route params
        const { id } = params;

        // Delete the guest by ID
        const deletedGuest = await NewBooking.findByIdAndDelete(id);

        if (!deletedGuest) {
            return NextResponse.json({ success: false, error: 'Guest not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Guest successfully deleted' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting guest:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete guest' }, { status: 400 });
    }
}
