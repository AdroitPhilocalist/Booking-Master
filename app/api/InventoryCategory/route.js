import Inventory from "../../lib/models/Inventorycategory";
import connectSTR from "../../lib/dbConnect";
import mongoose from "mongoose";
import Profile from "../../lib/models/Profile";
import { NextResponse } from "next/server";
import { jwtVerify } from 'jose'; // Import jwtVerify for decoding JWT
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Connect to the database
const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(connectSTR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// GET all products
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
    const products = await Inventory.find({ username: profile.username });
    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error fetching products from the database" },
      { status: 500 }
    );
  }
}

// POST a new product
export async function POST(request) {
  try {
    const data = await request.json();
    if (!data.itemName) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
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
    const newProduct = new Inventory({
      itemName: data.itemName,
      isActive: data.isActive !== true, // Default true unless explicitly false
      username: profile.username,
    });
    await newProduct.save();
    return NextResponse.json(
      { message: "Product added successfully", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: "Error adding product to the database" },
      { status: 500 }
    );
  }
}