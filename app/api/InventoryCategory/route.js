import Inventory from "@/app/lib/models/Inventorycategory";
import connectSTR from "@/app/lib/dbConnect";
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

// GET all products
export async function GET() {
  try {
    await connectToDatabase();
    const products = await Inventory.find();
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

    const newProduct = new Inventory({
      itemName: data.itemName,
      isActive: data.isActive !== false, // Default true unless explicitly false
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
