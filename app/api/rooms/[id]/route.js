// pages/api/rooms/[id].js

import connectSTR from '../../../lib/dbConnect';
import Room from '../../../lib/models/Rooms';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const { id } = params; // Extract room ID from the URL

    try {
        // Connect to the database
        await mongoose.connect(connectSTR);

        // Find the room by its ID and populate references
        const room = await Room.findById(id)
            .populate('guestWaitlist')
            .populate('billWaitlist');

        if (!room) {
            return NextResponse.json({ success: false, error: 'Room not found' }, { status: 404 });
        }

        // Return the room details
        return NextResponse.json({ success: true, data: room }, { status: 200 });
    } catch (error) {
        console.error('Error retrieving room:', error);
        return NextResponse.json({ success: false, error: 'Failed to retrieve room' }, { status: 400 });
    }
}

export async function PUT(req, { params }) {
    const { id } = params;

    try {
        await mongoose.connect(connectSTR);
        const data = await req.json();

        // Validate date arrays
        if (data.checkInDateList && !Array.isArray(data.checkInDateList)) {
            return NextResponse.json({ 
                success: false, 
                error: 'checkInDateList must be an array of dates' 
            }, { status: 400 });
        }
        
        if (data.checkOutDateList && !Array.isArray(data.checkOutDateList)) {
            return NextResponse.json({ 
                success: false, 
                error: 'checkOutDateList must be an array of dates' 
            }, { status: 400 });
        }

        // Validate waitlist arrays
        if (data.guestWaitlist && !Array.isArray(data.guestWaitlist)) {
            return NextResponse.json({ 
                success: false, 
                error: 'guestWaitlist must be an array of ObjectIds' 
            }, { status: 400 });
        }

        if (data.billWaitlist && !Array.isArray(data.billWaitlist)) {
            return NextResponse.json({ 
                success: false, 
                error: 'billWaitlist must be an array of ObjectIds' 
            }, { status: 400 });
        }

        // Convert string dates to Date objects
        if (data.checkInDateList) {
            data.checkInDateList = data.checkInDateList.map(date => new Date(date));
        }
        if (data.checkOutDateList) {
            data.checkOutDateList = data.checkOutDateList.map(date => new Date(date));
        }

        const updatedRoom = await Room.findByIdAndUpdate(id, data, { new: true })
            .populate('guestWaitlist')
            .populate('billWaitlist');
        
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

        // Validate date arrays if they exist in the update
        if (data.checkInDateList && !Array.isArray(data.checkInDateList)) {
            return NextResponse.json({
                success: false,
                error: 'checkInDateList must be an array of dates'
            }, { status: 400 });
        }

        if (data.checkOutDateList && !Array.isArray(data.checkOutDateList)) {
            return NextResponse.json({
                success: false,
                error: 'checkOutDateList must be an array of dates'
            }, { status: 400 });
        }

        // Convert string dates to Date objects
        if (data.checkInDateList) {
            data.checkInDateList = data.checkInDateList.map(date => new Date(date));
        }
        if (data.checkOutDateList) {
            data.checkOutDateList = data.checkOutDateList.map(date => new Date(date));
        }

        // Validate waitlist arrays
        if (data.guestWaitlist && !Array.isArray(data.guestWaitlist)) {
            return NextResponse.json({ 
                success: false, 
                error: 'guestWaitlist must be an array of ObjectIds' 
            }, { status: 400 });
        }

        if (data.billWaitlist && !Array.isArray(data.billWaitlist)) {
            return NextResponse.json({ 
                success: false, 
                error: 'billWaitlist must be an array of ObjectIds' 
            }, { status: 400 });
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