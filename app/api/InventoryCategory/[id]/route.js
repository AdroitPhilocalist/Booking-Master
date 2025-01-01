import Inventory from "../../../lib/models/Inventorycategory";
import connectSTR from "../../../lib/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

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
  
      // Build the update object dynamically based on provided fields
      const updateFields = {};
      if (data.itemName) updateFields.itemName = data.itemName;
      if (data.isActive !== undefined) updateFields.isActive = data.isActive;
  
      // Update the product
      const product = await Inventory.findByIdAndUpdate(
        id,
        updateFields, // Apply dynamic updates
        { new: true } // Return the updated document
      );
  
      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
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
  
      // Find and delete the product
      const product = await Inventory.findByIdAndDelete(id);
  
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
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
  
  
  
