import connectSTR from '../../lib/dbConnect';
import Room from '../../lib/models/Rooms';
import RoomCategory from '../../lib/models/RoomCategory';
import Profile from '../../lib/models/Profile';
import NewBooking from '../../lib/models/NewBooking';
import Billing from '../../lib/models/Billing' // Import Profile model
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Import jwtVerify for decoding JWT

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';


// Connect to the database
const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(connectSTR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// POST method to create a new Room
export async function POST(req) {
  try {
    await connectToDatabase();
    const data = await req.json();

    // Validate date arrays
    if (data.checkInDateList && !Array.isArray(data.checkInDateList)) {
      return NextResponse.json({ 
        success: false, 
        error: 'checkInDateList must be an array of dates' 
      }, { status: 400 });
    }
    if (data.checkOutDateList && !Array.isArray(data.checkOutDateList)) {
      return NextResponse.json({ 
        success: false, 
        error: 'checkOutDateList must be an array of dates' 
      }, { status: 400 });
    }
    // Validate waitlist arrays
    if (data.guestWaitlist && !Array.isArray(data.guestWaitlist)) {
      return NextResponse.json({ 
        success: false, 
        error: 'guestWaitlist must be an array of ObjectIds' 
      }, { status: 400 });
    }
    if (data.billWaitlist && !Array.isArray(data.billWaitlist)) {
      return NextResponse.json({ 
        success: false, 
        error: 'billWaitlist must be an array of ObjectIds' 
      }, { status: 400 });
    }

    // Extract the token from cookies
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication token missing' 
      }, { status: 401 });
    }

    // Verify the token
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;

    // Find the profile by userId to get the username
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        error: 'Profile not found' 
      }, { status: 404 });
    }

    // Convert string dates to Date objects
    if (data.checkInDateList) {
      data.checkInDateList = data.checkInDateList.map(date => new Date(date));
    }
    if (data.checkOutDateList) {
      data.checkOutDateList = data.checkOutDateList.map(date => new Date(date));
    }

    const newRoom = new Room({
      number: data.number,
      category: data.category,
      floor: data.floor,
      clean: data.clean,
      occupied: data.occupied,
      checkInDateList: data.checkInDateList || [],
      checkOutDateList: data.checkOutDateList || [],
      guestWaitlist: data.guestWaitlist || [],
      billWaitlist: data.billWaitlist || [],
      username: profile.username, // Set the username from the profile
    });

    await newRoom.save();
    return NextResponse.json({ success: true, data: newRoom }, { status: 201 });
  } catch (error) {
    console.error('Error creating new room:', error);
    return NextResponse.json({ success: false, error: 'Failed to create new room' }, { status: 400 });
  }
}

// GET method to retrieve all Rooms
export async function GET(req) {
  try {
    await connectToDatabase();
    if (!mongoose.models.RoomCategory) {
        mongoose.model('RoomCategory', RoomCategory.schema);
      }
      if (!mongoose.models.NewBooking) {
        mongoose.model('NewBooking', NewBooking.schema);
      }
      if (!mongoose.models.Billing) {
        mongoose.model('Billing', Billing.schema);
      }

    // Extract the token from cookies
    const token = req.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication token missing' 
      }, { status: 401 });
    }

    // Verify the token
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    // Find the profile by userId to get the username
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        error: 'Profile not found' 
      }, { status: 404 });
    }
    

    // Fetch all rooms from the database filtered by username
    const rooms = await Room.find({ username: profile.username })
      .populate('category')
      .populate('guestWaitlist')
      .populate('billWaitlist');


    return NextResponse.json({ success: true, data: rooms }, { status: 200 });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch rooms' }, { status: 500 });
  }
}