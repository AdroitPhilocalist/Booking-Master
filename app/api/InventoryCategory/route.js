import connectSTR from '../../lib/dbConnect';
import Inventory from '../../lib/models/Inventorycategory';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';

const connectToDatabase = async () => {
    if (mongoose.connections[0].readyState) {
      // If already connected, return the existing connection
      return;
    }
    // Connect to the database
    await mongoose.connect(connectSTR, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  };
  
  // Handle GET request to fetch all products
  export async function GET() {
    try {
      await connectToDatabase();
      const products = await Inventory.find();
      return NextResponse.json({ products });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: 'Error fetching products from the database' },
        { status: 500 }
      );
    }
  }
  
  // Handle POST request to add a new product
  export async function POST(request) {
    try {
      const { name } = await request.json();
  
      if (!name) {
        return NextResponse.json(
          { error: 'Product name is required' },
          { status: 400 }
        );
      }
  
      await connectToDatabase();
  
      // Create a new product with the provided name and default active status
      const newProduct = new Inventory({ itemName: name, isActive: true });
  
      // Save the product to the database
      await newProduct.save();
  
      return NextResponse.json(
        { message: 'Product added successfully', product: newProduct },
        { status: 201 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: 'Error adding product to the database' },
        { status: 500 }
      );
    }
  }
  
  // Handle PUT request to update product (including active/inactive status)
  export async function PUT(request) {
    try {
      const { id, isActive } = await request.json();
  
      if (!id || typeof isActive !== 'boolean') {
        return NextResponse.json(
          { error: 'Invalid data' },
          { status: 400 }
        );
      }
  
      await connectToDatabase();
  
      // Find the product by ID and update its isActive status
      const product = await Inventory.findByIdAndUpdate(
        id,
        { isActive },
        { new: true }
      );
  
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
  
      return NextResponse.json({ product });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: 'Error updating product' },
        { status: 500 }
      );
    }
  }