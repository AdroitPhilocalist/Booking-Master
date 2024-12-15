import connectSTR from '../../../lib/dbConnect';
import NewBooking from '../../../lib/models/NewBooking';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
    try {
        // Connect to the database
        await mongoose.connect(connectSTR);

        // Extract guest ID from the route params
        const { id } = params;

        // Parse request body for updates
        const data = await req.json();

        // Perform the update with dynamic fields
        const updatedGuest = await NewBooking.findByIdAndUpdate(
            id,
            { $set: data }, // Use $set to update only the fields provided in the request body
            { new: true, runValidators: true } // Return the updated document and validate data
        );

        // Check if the guest exists
        if (!updatedGuest) {
            return NextResponse.json(
                { success: false, error: 'Guest not found' },
                { status: 404 }
            );
        }

        // Respond with the updated guest data
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
