import connectSTR from '../../../lib/dbConnect';
import restaurantinvoice from '../../../lib/models/restaurantinvoice';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
    const { id } = params; // Get the invoice ID from the URL

    try {
        // Ensure database connection
        await mongoose.connect(connectSTR);

        // Find the invoice by ID and populate items if necessary
        const invoice = await restaurantinvoice.findById(id);
        
        if (!invoice) {
            return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json(invoice, { status: 200 });
    } catch (error) {
        console.error('Error fetching invoice:', error);
        return NextResponse.json({ 
            success: false, 
            error: 'Failed to fetch invoice',
            details: error.message 
        }, { status: 400 });
    }
}

// Keep existing methods
export async function PUT(req, { params }) {
    const { id } = params; // Get the invoice ID from the URL

    try {
        await mongoose.connect(connectSTR);
        const data = await req.json();

        const updatedInvoice = await restaurantinvoice.findByIdAndUpdate(id, data, { new: true });
        
        if (!updatedInvoice) {
            return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedInvoice }, { status: 200 });
    } catch (error) {
        console.error('Error updating invoice:', error);
        return NextResponse.json({ success: false, error: 'Failed to update invoice' }, { status: 400 });
    }
}

export async function PATCH(req, { params }) {
    try {
        await mongoose.connect(connectSTR);

        const { id } = params; // Extract invoice ID from the request parameters
        const data = await req.json(); // Extract update data from the request body

        if (!id) {
            return NextResponse.json({ success: false, error: 'Invoice ID is required' }, { status: 400 });
        }

        // Find the invoice by its ID and update it
        const updatedInvoice = await restaurantinvoice.findByIdAndUpdate(
            id, // Invoice ID
            data, // Update data
            { new: true } // Return the updated document
        );

        if (!updatedInvoice) {
            return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedInvoice }, { status: 200 });
    } catch (error) {
        console.error('Error updating invoice:', error);
        return NextResponse.json({ success: false, error: 'Failed to update invoice' }, { status: 400 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params; // Get the invoice ID from the URL

    try {
        await mongoose.connect(connectSTR);
        const deletedInvoice = await restaurantinvoice.findByIdAndDelete(id);
        
        if (!deletedInvoice) {
            return NextResponse.json({ success: false, error: 'Invoice not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Invoice deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        return NextResponse.json({ success: false, error: 'Failed to delete invoice' }, { status: 400 });
    }
}