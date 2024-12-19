// pages/api/rooms/route.js

import connectSTR from '../../lib/dbConnect';
import Room from '../../lib/models/Rooms';
import RoomCategory from '../../lib/models/RoomCategory';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function POST(req) {
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

        const newRoom = new Room({
            number: data.number,
            category: data.category,
            floor: data.floor,
            clean: data.clean,
            occupied: data.occupied,
            checkInDateList: data.checkInDateList || [],
            checkOutDateList: data.checkOutDateList || [],
            guestWaitlist: data.guestWaitlist || [],
            billWaitlist: data.billWaitlist || []
        });

        await newRoom.save();

        return NextResponse.json({ success: true, data: newRoom }, { status: 201 });
    } catch (error) {
        console.error('Error creating new room:', error);
        return NextResponse.json({ success: false, error: 'Failed to create new room' }, { status: 400 });
    }
}

export async function GET() {
    try {
        await mongoose.connect(connectSTR);
        if (!mongoose.models.RoomCategory) {
            mongoose.model('RoomCategory', RoomCategory.schema);
        }
        const rooms = await Room.find()// Fetch all rooms from the database
        .populate({
            path: 'category',
            model: 'RoomCategory',
            select: 'category',
        });
        return NextResponse.json({ success: true, data: rooms }, { status: 200 });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch rooms' }, { status: 500 });
    }
}
