import InventoryList from "../../lib/models/InventoryList";
import connectSTR from "../../lib/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(connectSTR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// GET all items with populated segment data
export async function GET() {
  try {
    await connectToDatabase();
    const items = await InventoryList.find().populate('segment');
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

    const newItem = new InventoryList(data);
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