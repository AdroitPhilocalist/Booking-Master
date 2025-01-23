// app/api/auth/admin/login/route.js
import connectSTR from '../../../../lib/dbConnect';
import Admin from '../../../../lib/models/Admin';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

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
    const admin = await Admin.findOne({ username: data.username });
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid username' },
        { status: 400 }
      );
    }
    const isMatch = await bcrypt.compare(data.password, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 400 }
      );
    }
    const token = jwt.sign({ id: admin._id }, SECRET_KEY, { expiresIn: '24h' });
    // Create the response
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );
    // Set both HTTP-only and client-accessible cookies
    response.cookies.set('adminauthToken', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
      maxAge: 3600,
      path: '/',
    });
    // Set a non-HTTP-only cookie for client-side access
    response.cookies.set('adminclientToken', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600,
      path: '/',
    });
    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to log in' },
      { status: 400 }
    );
  }
}