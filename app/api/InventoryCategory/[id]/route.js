import Inventory from "../../../lib/models/Inventorycategory";
import connectSTR from "../../../lib/dbConnect";
import mongoose from "mongoose";
import Profile from "../../../lib/models/Profile";
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

export async function PUT(request, { params }) {
  try {
    const { id } = params; // Extract ID from route params
    const data = await request.json(); // Parse the request body
    if (!id || (!data.itemName && data.isActive === undefined)) {
      // Validate inputs: at least one field should be provided
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
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
    // Build the update object dynamically based on provided fields
    const updateFields = { ...data, username: profile.username }; // Ensure username is included
    // Update the product
    const product = await Inventory.findByIdAndUpdate(
      id,
      updateFields, // Apply dynamic updates
      { new: true } // Return the updated document
    );
    if (!product || product.username !== profile.username) {
      return NextResponse.json(
        { error: "Product not found or unauthorized" },
        { status: 404 }
      );
    }
    return NextResponse.json({ product }); // Return updated product
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error updating product" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params; // Extract ID from route params
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
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
    // Find and delete the product
    const product = await Inventory.findByIdAndDelete(id);
    if (!product || product.username !== profile.username) {
      return NextResponse.json(
        { error: "Product not found or unauthorized" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error deleting product" },
      { status: 500 }
    );
  }
}