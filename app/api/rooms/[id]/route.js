// pages/api/rooms/[id].js

import connectSTR from '../../../lib/dbConnect';
import Room from '../../../lib/models/Rooms';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
    const { id } = params; // Get the room ID from the URL

    try {
        await mongoose.connect(connectSTR);
        const data = await req.json();

        const updatedRoom = await Room.findByIdAndUpdate(id, data, { new: true });
        
        if (!updatedRoom) {
            return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedRoom }, { status: 200 });
    } catch (error) {
        console.error('Error updating room:', error);
        return NextResponse.json({ success: false, error: 'Failed to update room' }, { status: 400 });
    }
}
// pages/api/rooms/[id].js
export async function PATCH(req, { params }) {
    try {
        await mongoose.connect(connectSTR);

        const { id } = params; // Extract room ID from the request parameters
        const data = await req.json(); // Extract update data from the request body

        if (!id) {
            return NextResponse.json({ success: false, error: 'Room ID is required' }, { status: 400 });
        }

        // Find the room by its ID and update it
        const updatedRoom = await Room.findByIdAndUpdate(
            id, // Room ID
            data, // Update data
            { new: true } // Return the updated document
        );

        if (!updatedRoom) {
            return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedRoom }, { status: 200 });
    } catch (error) {
        console.error('Error updating room:', error);
        return NextResponse.json({ success: false, error: 'Failed to update room' }, { status: 400 });
    }
}
export async function DELETE(req, { params }) {
    const { id } = params; // Get the room ID from the URL

    try {
        await mongoose.connect(connectSTR);
        const deletedRoom = await Room.findByIdAndDelete(id);
        
        if (!deletedRoom) {
            return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Room deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting room:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete room' }, { status: 400 });
    }
}