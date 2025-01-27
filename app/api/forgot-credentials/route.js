// app/api/forgot-credentials/route.js
import mongoose from 'mongoose';
import connectSTR from '../../lib/dbConnect';
import Profile from '../../lib/models/Profile';
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
    
    if (data.type === 'username') {
      // Handle forgotten username request
      const profile = await Profile.findOne({ email: data.email });
      
      if (!profile) {
        return NextResponse.json({
          success: false,
          error: 'No account found with this email'
        }, { status: 404 });
      }

      // Update forgotUsername flag
      await Profile.findByIdAndUpdate(profile._id, {
        forgotUsername: true
      });

      return NextResponse.json({
        success: true,
        message: 'Username recovery request registered'
      }, { status: 200 });

    } else if (data.type === 'password') {
      // Handle forgotten password request
      const profile = await Profile.findOne({ username: data.username });
      
      if (!profile) {
        return NextResponse.json({
          success: false,
          error: 'No account found with this username'
        }, { status: 404 });
      }

      // Update forgotPassword flag
      await Profile.findByIdAndUpdate(profile._id, {
        forgotPassword: true
      });

      return NextResponse.json({
        success: true,
        message: 'Password recovery request registered'
      }, { status: 200 });

    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid request type'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error processing forgot credentials request:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to process request'
    }, { status: 500 });
  }
}