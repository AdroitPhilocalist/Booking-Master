import connectSTR from '../../lib/dbConnect';
import MenuItem from '../../lib/models/MenuItem';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

// POST method to create a new MenuItem
export async function POST(req) {
    try {
        // Connect to the database
        await mongoose.connect(connectSTR);

        // Parse request body
        const data = await req.json();

        // Create a new MenuItem instance
        const newMenuItem = new MenuItem({
            itemCategory: data.itemCategory,
            itemSegment: data.itemSegment,
            itemCode: data.itemCode,
            itemName: data.itemName,
            price: data.price,
            gst: data.gst,
            total: data.total,
            showInProfile: data.showInProfile,
            isSpecialItem: data.isSpecialItem,
            discountAllowed: data.discountAllowed,
            storeItemCode: data.storeItemCode,
            ingredientCode: data.ingredientCode,
        });

        // Save the new MenuItem to the database
        await newMenuItem.save();

        // Return success response
        return NextResponse.json({ success: true, data: newMenuItem }, { status: 201 });
    } catch (error) {
        console.error('Error creating new menu item:', error);
        return NextResponse.json({ success: false, error: 'Failed to create new menu item' }, { status: 400 });
    }
}

// GET method to retrieve all MenuItems
export async function GET(req) {
    try {
        // Connect to the database
        await mongoose.connect(connectSTR);

        // Fetch all MenuItems from the database
        const menuItems = await MenuItem.find();

        // Return success response with menu items data
        return NextResponse.json({ success: true, data: menuItems }, { status: 200 });
    } catch (error) {
        console.error('Error fetching menu items:', error);
        return NextResponse.json({ success: false, error: 'Failed to fetch menu items' }, { status: 500 });
    }
}

