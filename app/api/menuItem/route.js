// app/api/menuItem/route.js
import connectSTR from '../../lib/dbConnect';
import MenuItem from '../../lib/models/MenuItem';
import mongoose from 'mongoose';
import Profile from '../../lib/models/Profile';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Import jwtVerify for decoding JWT
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(connectSTR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// POST method to create a new MenuItem
export async function POST(req) {
  try {
    await connectToDatabase();
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
    const newMenuItem = new MenuItem({
        itemCategory: data.itemCategory,
        itemSegment: data.itemSegment,
        itemCode: data.itemCode,
        itemName: data.itemName,
        price: data.price,
        sgst: data.sgst,
        cgst: data.cgst,
        total: data.total,
        showInProfile: data.showInProfile,
        isSpecialItem: data.isSpecialItem,
        discountAllowed: data.discountAllowed,
        storeItemCode: data.storeItemCode,
        ingredientCode: data.ingredientCode,
        username: profile.username
    });
    await newMenuItem.save();
    return NextResponse.json({ success: true, data: newMenuItem }, { status: 201 });
  } catch (error) {
    console.error('Error creating new menu item:', error);
    return NextResponse.json({ success: false, error: 'Failed to create new menu item' }, { status: 400 });
  }
}

// GET method to retrieve all MenuItems for the current user
export async function GET(req) {
  try {
    await connectToDatabase();
    const token = req.cookies.get('authToken')?.value;
    console.log("barnik ", token);

    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication token missing' 
      }, { status: 401 });
    }
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    const profile = await Profile.findById(userId);
    console.log("das",profile);

    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        error: 'Profile not found' 
      }, { status: 404 });
    }
    const menuItems = await MenuItem.find({ username: profile.username });
    console

    return NextResponse.json({ success: true, data: menuItems }, { status: 200 });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch menu items' }, { status: 500 });
  }
}