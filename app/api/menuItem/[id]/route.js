import MenuItem from '../../../lib/models/MenuItem';
import connectSTR from "../../../lib/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
    try {
        await mongoose.connect(connectSTR);

        const { id } = params;
        const data = await req.json();

        const updatedMenuItem = await MenuItem.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!updatedMenuItem) {
            return NextResponse.json(
                { success: false, error: 'Menu item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: updatedMenuItem });
    } catch (error) {
        console.error('Error updating menu item:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update menu item' },
            { status: 400 }
        );
    }
}

// Delete Menu Item
export async function DELETE(req, { params }) {
    try {
        await mongoose.connect(connectSTR);

        const { id } = params;

        const deletedMenuItem = await MenuItem.findByIdAndDelete(id);

        if (!deletedMenuItem) {
            return NextResponse.json(
                { success: false, error: 'Menu item not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: deletedMenuItem });
    } catch (error) {
        console.error('Error deleting menu item:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete menu item' },
            { status: 400 }
        );
    }
}
