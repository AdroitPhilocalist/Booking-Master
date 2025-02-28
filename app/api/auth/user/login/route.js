import connectSTR from '../../../../lib/dbConnect';
import User from '../../../../lib/models/User';
import Profile from '../../../../lib/models/Profile'; // Import the Profile model
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

    // Validate required fields
    if (!data.email || !data.password || !data.hotelName) {
      return NextResponse.json(
        { success: false, error: 'Email, hotel name, and password are required' },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email' },
        { status: 400 }
      );
    }

    // Verify password
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 400 }
      );
    }

    // Find the profile by hotelName
    const profile = await Profile.findOne({ hotelName: data.hotelName });
    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Invalid hotel name' },
        { status: 400 }
      );
    }

    // Create JWT token with both user._id and profile._id
    const token = jwt.sign(
      { 
        userId: user._id, 
        profileId: profile._id, // Include the Profile _id
        roles: user.roles // Include roles for middleware redirection
      }, 
      SECRET_KEY, 
      { expiresIn: '24h' }
    );

    // Create the response
    const response = NextResponse.json(
      { 
        success: true, 
        data: { 
          id: user._id, 
          email: user.email, 
          hotelName: user.hotelName, 
          roles: user.roles, // Include roles in the response for client-side use
          profileId: profile._id // Include profileId for client-side reference
        } 
      },
      { status: 200 }
    );

    // Set both HTTP-only and client-accessible cookies
    response.cookies.set('userAuthToken', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });

    // // Set a non-HTTP-only cookie for client-side access
    // response.cookies.set('userClientToken', token, {
    //   httpOnly: false,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    //   maxAge: 86400,
    //   path: '/',
    // });

    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to log in' },
      { status: 400 }
    );
  }
}