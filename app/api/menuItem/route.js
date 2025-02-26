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
    // Extract the token from cookies
    const authToken = req.cookies.get('authToken')?.value;
    const userAuthToken = req.cookies.get('userAuthToken')?.value;
    if (!authToken && !userAuthToken) {
      return NextResponse.json({
        success: false,
        error: 'Authentication token missing'
      }, { status: 401 });
    }

    let decoded, userId;
    if (authToken) {
      // Verify the authToken (legacy check)
      decoded = await jwtVerify(authToken, new TextEncoder().encode(SECRET_KEY));
      userId = decoded.payload.id;
    } else if (userAuthToken) {
      // Verify the userAuthToken
      decoded = await jwtVerify(userAuthToken, new TextEncoder().encode(SECRET_KEY));
      userId = decoded.payload.profileId; // Use userId from the new token structure
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid token structure'
      }, { status: 400 });
    }
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
    // Extract the token from cookies
    const authToken = req.cookies.get('authToken')?.value;
    const userAuthToken = req.cookies.get('userAuthToken')?.value;
    if (!authToken && !userAuthToken) {
      return NextResponse.json({
        success: false,
        error: 'Authentication token missing'
      }, { status: 401 });
    }

    let decoded, userId;
    if (authToken) {
      // Verify the authToken (legacy check)
      decoded = await jwtVerify(authToken, new TextEncoder().encode(SECRET_KEY));
      userId = decoded.payload.id;
    } else if (userAuthToken) {
      // Verify the userAuthToken
      decoded = await jwtVerify(userAuthToken, new TextEncoder().encode(SECRET_KEY));
      userId = decoded.payload.profileId; // Use userId from the new token structure
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid token structure'
      }, { status: 400 });
    }
    const profile = await Profile.findById(userId);


    if (!profile) {
      return NextResponse.json({
        success: false,
        error: 'Profile not found'
      }, { status: 404 });
    }
    const menuItems = await MenuItem.find({ username: profile.username });


    return NextResponse.json({ success: true, data: menuItems }, { status: 200 });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch menu items' }, { status: 500 });
  }
}