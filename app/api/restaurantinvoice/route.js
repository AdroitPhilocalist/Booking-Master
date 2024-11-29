// api/restaurantinvoice/route.js
import connectSTR from '../../lib/dbConnect';
import restaurantinvoice from '../../lib/models/restaurantinvoice';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await mongoose.connect(connectSTR);
        const invoices = await restaurantinvoice.find({});
        return NextResponse.json({ success: true, data: invoices }, { status: 200 });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch invoices' }, { status: 400 });
    }
}

export async function POST(req) {
    try {
        await mongoose.connect(connectSTR);
        const data = await req.json();
        const newInvoice = await restaurantinvoice.create(data);
        return NextResponse.json({ success: true, data: newInvoice }, { status: 201 });
    } catch (error) {
        console.error('Error creating invoice:', error);
        return NextResponse.json({ success: false, error: 'Failed to create invoice' }, { status: 400 });
    }
}