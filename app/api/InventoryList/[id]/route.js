import InventoryList from "../../../lib/models/InventoryList";
import connectSTR from "../../../lib/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

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

    const updatedItem = await InventoryList.findByIdAndUpdate(
      id,
      data,
      { new: true }
    ).populate('segment');

    if (!updatedItem) {
      return NextResponse.json(
        { error: "Item not found" },
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

    const item = await InventoryList.findById(id);
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
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