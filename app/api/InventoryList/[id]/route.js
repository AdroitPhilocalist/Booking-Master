import InventoryList from "../../../lib/models/InventoryList";
import connectSTR from "../../../lib/dbConnect";
import mongoose from "mongoose";
import Profile from "../../../lib/models/Profile";
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

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
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
    const updatedItem = await InventoryList.findByIdAndUpdate(
      id,
      { ...data, username: profile.username }, // Ensure username is included
      { new: true }
    ).populate('segment');
    if (!updatedItem || updatedItem.username !== profile.username) {
      return NextResponse.json(
        { error: "Item not found or unauthorized" },
        { status: 404 }
      );
    }
    return NextResponse.json({ item: updatedItem });
  } catch (error) {
    console.error("Error updating inventory item:", error);
    return NextResponse.json(
      { error: "Error updating inventory item" },
      { status: 500 }
    );
  }
}

// Stock management endpoints
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const { action, quantity } = await request.json();
    if (!id || !action || !quantity) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
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
    const item = await InventoryList.findById(id);
    if (!item || item.username !== profile.username) {
      return NextResponse.json({ error: "Item not found or unauthorized" }, { status: 404 });
    }
    if (action === 'buy') {
      item.stock += quantity;
    } else if (action === 'sell') {
      if (item.stock < quantity) {
        return NextResponse.json({ error: "Insufficient stock" }, { status: 400 });
      }
      item.stock -= quantity;
    }
    await item.save();
    const updatedItem = await InventoryList.findById(id).populate('segment');
    return NextResponse.json({ item: updatedItem });
  } catch (error) {
    console.error("Error managing stock:", error);
    return NextResponse.json(
      { error: "Error managing stock" },
      { status: 500 }
    );
  }
}

// DELETE method to delete an inventory item
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
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
    const item = await InventoryList.findById(id);
    if (!item || item.username !== profile.username) {
      return NextResponse.json({ error: "Item not found or unauthorized" }, { status: 404 });
    }
    // Delete the item
    const deletedItem = await InventoryList.findByIdAndDelete(id);
    if (!deletedItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    return NextResponse.json(
      { error: "Error deleting inventory item" },
      { status: 500 }
    );
  }
}