// app/api/auth/admin/register/route.js
import connectSTR from '../../../../lib/dbConnect';
import Admin from '../../../../lib/models/Admin';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import { NextResponse } from 'next/server';

const connectToDatabase = async () => {
  if (mongoose.connections[0]?.readyState === 1) return;
  try {
    await mongoose.connect(connectSTR, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err.message);
    throw new Error("Database connection failed.");
  }
};

export async function POST(req) {
  try {
    await connectToDatabase();
    const data = await req.json();
    if (!data.username || !data.password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }
    // Check if username already exists
    const existingAdmin = await Admin.findOne({ username: data.username });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: 'Username already exists' },
        { status: 400 }
      );
    }
    // Hash the password before saving
    // const hashedPassword = await bcrypt.hash(data.password, 10);
    const newAdmin = new Admin({
      username: data.username,
      password: data.password
    });
    await newAdmin.save();
    return NextResponse.json(
      { success: true, message: 'Admin registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering admin:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to register admin' },
      { status: 400 }
    );
  }
}