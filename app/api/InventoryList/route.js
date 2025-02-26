import InventoryList from "../../lib/models/InventoryList";
import connectSTR from "../../lib/dbConnect";
import mongoose from "mongoose";
import Profile from "../../lib/models/Profile"
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

// GET all items with populated segment data
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
    // Find the profile by userId to get the username
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        error: 'Profile not found' 
      }, { status: 404 });
    }
    const items = await InventoryList.find({ username: profile.username }).populate('segment');
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    return NextResponse.json(
      { error: "Error fetching inventory items from the database" },
      { status: 500 }
    );
  }
}

// POST a new item
export async function POST(request) {
  try {
    const data = await request.json();
    const requiredFields = ['itemCode', 'name', 'group', 'segment', 'auditable', 'tax', 'quantityUnit'];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    await connectToDatabase();
    const token = request.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication token missing' 
      }, { status: 401 });
    }
    // Verify the token
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    // Find the profile by userId to get the username
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        error: 'Profile not found' 
      }, { status: 404 });
    }
    const newItem = new InventoryList({
      ...data,
      username: profile.username, // Set the username from the profile
    });
    await newItem.save();
    const populatedItem = await InventoryList.findById(newItem._id).populate('segment');
    return NextResponse.json(
      { message: "Item added successfully", item: populatedItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding inventory item:", error);
    return NextResponse.json(
      { error: "Error adding inventory item to the database" },
      { status: 500 }
    );
  }
}