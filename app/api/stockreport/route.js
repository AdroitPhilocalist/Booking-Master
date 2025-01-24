import StockReport from "../../lib/models/Stockreport";
import InventoryList from "../../lib/models/InventoryList";
import Inventory from "../../lib/models/Inventorycategory"; // Ensure this is imported
import connectSTR from "../../lib/dbConnect";
import mongoose from "mongoose";
import Profile from "../../lib/models/Profile";
import { NextResponse } from "next/server";
import { jwtVerify } from 'jose'; // Import jwtVerify for decoding JWT
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

export async function GET(req) {
  try {
    await connectToDatabase();
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
    // Fetch the profile by userId to get the username
    // const profileResponse = await fetch(`/api/Profile/${userId}`);
    // const profileData = await profileResponse.json();
    // if (!profileData.success || !profileData.data) {
    //   return NextResponse.json({ 
    //     success: false, 
    //     error: 'Profile not found' 
    //   }, { status: 404 });
    // }
    const profile = await Profile.findById(userId);
    // const username = profileData.data.username;
    // Ensure all models are registered before querying
    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        error: 'Profile not found' 
      }, { status: 404 });
    }
    if (!mongoose.models.StockReport) {
      mongoose.model('StockReport', StockReport.schema);
    }
    if (!mongoose.models.InventoryList) {
      mongoose.model('InventoryList', InventoryList.schema);
    }
    if (!mongoose.models.Inventory) {
      mongoose.model('Inventory', Inventory.schema);
    }
    const stockReports = await StockReport.find({ username: profile.username })
      .populate({
        path: "name",
        model: "InventoryList",
        select: "name itemCode segment",
        populate: {
          path: "segment",
          model: "Inventory", // Ensure this matches your model name
          select: "itemName"
        }
      })
      .populate({ 
        path: "quantity", 
        model: "InventoryList", 
        select: "stock" 
      })
      .populate({ 
        path: "unit", 
        model: "InventoryList", 
        select: "quantityUnit" 
      })
      .populate({ 
        path: "taxpercent", 
        model: "InventoryList", 
        select: "tax" 
      })
      .lean(); // Add .lean() for better performance and error handling
    return NextResponse.json({ stockReports });
  } catch (error) {
    console.error("Detailed error fetching stock reports:", error);
    return NextResponse.json(
      { 
        error: "Error fetching stock reports from the database", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const requiredFields = [
      "purchaseorderno",
      "name",
      "purchasedate",
      "Invoiceno",
      "quantity",
      "unit",
      "rate",
      "taxpercent",
      "total",
      "purorsell"
    ];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        );
      }
    }
    await connectToDatabase();
    const token = request.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication token missing' 
      }, { status: 401 });
    }
    // Verify the token
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    // Fetch the profile by userId to get the username
    // const profileResponse = await fetch(`/api/Profile/${userId}`);
    // const profileData = await profileResponse.json();
    // if (!profileData.success || !profileData.data) {
    //   return NextResponse.json({ 
    //     success: false, 
    //     error: 'Profile not found' 
    //   }, { status: 404 });
    // }
    // const username = profileData.data.username;
    const profile = await Profile.findById(userId);
    if (!profile) {
      return NextResponse.json({ 
        success: false, 
        error: 'Profile not found' 
      }, { status: 404 });
    }
    const newStockReport = new StockReport({ ...data, username: profile.username });
    await newStockReport.save();
    const populatedStockReport = await StockReport.findById(newStockReport._id)
      .populate({
        path: "name",
        model: "InventoryList",
        select: "name itemCode segment"
      })
      .populate({
        path: "quantity",
        model: "InventoryList",
        select: "stock"
      })
      .populate({
        path: "unit",
        model: "InventoryList",
        select: "quantityUnit"
      })
      .populate({
        path: "taxpercent",
        model: "InventoryList",
        select: "tax"
      })
      .lean();
    return NextResponse.json(
      { message: "Stock report added successfully", stockReport: populatedStockReport },
      { status: 201 }
    );
  } catch (error) {
    console.error("Detailed error adding stock report:", error);
    return NextResponse.json(
      { 
        error: "Error adding stock report to the database", 
        details: error.message 
      },
      { status: 500 }
    );
  }
}