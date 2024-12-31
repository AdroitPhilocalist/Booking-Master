import Table from '../../../lib/models/Tables'; // Replace with the actual model for your table data
import connectSTR from '../../../lib/dbConnect';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
    try {
        // Connect to the database
        await mongoose.connect(connectSTR);

        // Extract the table ID from the URL params
        const { id } = params;

        // Parse the request body
        const data = await req.json();

        // Find and update the table by ID
        const updatedTable = await Table.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!updatedTable) {
            return NextResponse.json(
                { success: false, error: 'Table not found' },
                { status: 404 }
            );
        }

        // Return the updated table
        return NextResponse.json({ success: true, data: updatedTable });
    } catch (error) {
        console.error('Error updating table:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update table' },
            { status: 400 }
        );
    }
}


export async function DELETE(req, { params }) {
    try {
        // Connect to the database
        await mongoose.connect(connectSTR);

        // Extract the table ID from the URL params
        const { id } = params;

        // Find and delete the table by ID
        const deletedTable = await Table.findByIdAndDelete(id);

        if (!deletedTable) {
            return NextResponse.json(
                { success: false, error: 'Table not found' },
                { status: 404 }
            );
        }

        // Return a success response
        return NextResponse.json({ success: true, data: deletedTable });
    } catch (error) {
        console.error('Error deleting table:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete table' },
            { status: 400 }
        );
    }
}