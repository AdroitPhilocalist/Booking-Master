import mongoose from 'mongoose';
import connectSTR from '../../lib/dbConnect'; // Your database connection string
import User from '../../lib/models/User'; // Your User model
import { NextResponse } from 'next/server';



// POST: Create a new user
export async function POST(req) {
  try {
    await mongoose.connect(connectSTR);
    const data = await req.json();

    // Validate required fields
    if (!data.name || !data.property || !data.email || !data.phone || !data.userType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a new user
    const newUser = new User(data);
    const result = await newUser.save();

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create user' },
      { status: 400 }
    );
  }
}
