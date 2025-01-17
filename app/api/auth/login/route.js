import connectSTR from '../../../lib/dbConnect';
import Profile from '../../../lib/models/Profile';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

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
    // Validate required fields
    if (!data.username || !data.password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }
    // Find the profile by username
    const profile = await Profile.findOne({ username: data.username });
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 400 }
      );
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(data.password, profile.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 400 }
      );
    }
    // Generate JWT token
    const token = jwt.sign({ id: profile._id }, SECRET_KEY, { expiresIn: '1h' });
    return NextResponse.json({ success: true, token }, { status: 200 });
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to log in' },
      { status: 400 }
    );
  }
}