// pages/api/tables/route.js

import connectSTR from '../../lib/dbConnect';
import Table from '../../lib/models/Tables';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// POST method to create a new Table
export async function POST(req) {
    try {
        await mongoose.connect(connectSTR);

        const data = await req.json();

        // Debug: Check data before saving
        console.log('Received data:', data);

        const newTable = new Table({
            tableNo: data.tableNo,
            pos: data.pos,
            active: data.active || 'yes', // Defaults to 'yes' if active is not provided
        });

        // Debug: Check the newTable object before saving
        console.log('New table:', newTable);

        await newTable.save();

        return NextResponse.json({ success: true, data: newTable }, { status: 201 });
    } catch (error) {
        console.error('Error creating new table:', error);
        return NextResponse.json({ success: false, error: 'Failed to create new table' }, { status: 400 });
    }
}


// GET method to retrieve all Tables
export async function GET(req) {
    try {
        // Connect to the database
        await mongoose.connect(connectSTR);

        // Fetch all Tables from the database
        const tables = await Table.find();

        // Return success response with table data
        return NextResponse.json({ success: true, data: tables }, { status: 200 });
    } catch (error) {
        console.error('Error fetching tables:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch tables' }, { status: 500 });
    }
}