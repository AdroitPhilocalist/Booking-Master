// pages/api/rooms/route.js

import connectSTR from '../../lib/dbConnect';
import Room from '../../lib/models/Rooms';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await mongoose.connect(connectSTR);
        const data = await req.json();

        const newRoom = new Room({
            number: data.number,
            category: data.category,
            floor: data.floor,
            clean: data.clean,
            occupied: data.occupied,  // Use string as passed from the frontend
          });

        await newRoom.save();

        return NextResponse.json({ success: true, data: newRoom }, { status: 201 });
    } catch (error) {
        console.error('Error creating new room:', error);
        return NextResponse.json({ success: false, error: 'Failed to create new room' }, { status: 400 });
    }
}

export async function GET(req) {
    try {
        await mongoose.connect(connectSTR);
        
        const rooms = await Room.find(); // Fetch all rooms from the database
        
        return NextResponse.json({ success: true, data: rooms }, { status: 200 });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch rooms' }, { status: 500 });
    }
}
