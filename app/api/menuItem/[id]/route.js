// app/api/menuItem/[id]/route.js
import MenuItem from '../../../lib/models/MenuItem';
import Profile from '../../../lib/models/Profile'; // Import Profile model
import connectSTR from "../../../lib/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { jwtVerify } from 'jose'; // Import jwtVerify for decoding JWT
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(connectSTR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;
    const data = await req.json();
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication token missing' 
      }, { status: 401 });
    }
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        error: 'Profile not found' 
      }, { status: 404 });
    }
    const menuItem = await MenuItem.findById(id);
    if (!menuItem || menuItem.username !== profile.username) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found or unauthorized' },
        { status: 404 }
      );
    }
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      { $set: { ...data, username: profile.username } }, // Ensure username is included
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
    await connectToDatabase();
    const { id } = params;
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication token missing' 
      }, { status: 401 });
    }
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        error: 'Profile not found' 
      }, { status: 404 });
    }
    const menuItem = await MenuItem.findById(id);
    if (!menuItem || menuItem.username !== profile.username) {
      return NextResponse.json(
        { success: false, error: 'Menu item not found or unauthorized' },
        { status: 404 }
      );
    }
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