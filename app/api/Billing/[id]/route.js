// Dynamic Route (api/billing/[id]/route.js)
import mongoose from 'mongoose';
import connectSTR from '../../../lib/dbConnect'
import Billing from '../../../lib/models/Billing';
import Profile from '../../../lib/models/Profile'; // Import Profile model
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Import jwtVerify for decoding JWT
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

export async function GET(req, { params }) {
  const { id } = params;
  try {
    await mongoose.connect(connectSTR);
    const token = req.cookies.get('authToken')?.value;
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    const profile = await Profile.findById(userId);
    const bill = await Billing.findById(id);
    console.log('Bill:', bill);
    if (!bill || bill.username !== profile.username) {
      return NextResponse.json(
        { success: false, error: 'Bill not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: bill }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bill' },
      { status: 400 }
    );
  }
}

export async function PATCH(req, { params }) {
  const { id } = params;
  try {
    await mongoose.connect(connectSTR);
    const data = await req.json();
    const token = req.cookies.get('authToken')?.value;
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    const profile = await Profile.findById(userId);
    const billingData = await Billing.findById(id);
    if (!billingData || billingData.username !== profile.username) {
      return NextResponse.json(
        { success: false, error: 'Bill not found' },
        { status: 404 }
      );
    }
    // Update existing fields with new logic to handle quantityList
    const updatedItemList = data.itemList || billingData.itemList;
    const updatedPriceList = data.priceList || billingData.priceList;
    const updatedQuantityList = data.quantityList || billingData.quantityList;
    const updatedTaxList = data.taxList || billingData.taxList;
    // Handle remarks updates
    if (data.FoodRemarks) billingData.FoodRemarks = data.FoodRemarks;
    if (data.ServiceRemarks) billingData.ServiceRemarks = data.ServiceRemarks;
    if (data.RoomRemarks) billingData.RoomRemarks = data.RoomRemarks;
    // Calculate new totalAmount including taxes and quantities
    const newSubtotalList = updatedPriceList.map((price, index) => 
      price * (updatedQuantityList[index] || 1)
    );
    const newSubTotal = newSubtotalList.reduce((total, subtotal) => total + subtotal, 0);
    const newTaxTotal = updatedTaxList.reduce((total, tax) => total + tax, 0);
    const newTotalAmount = newSubTotal;
    const newDueAmount = newTotalAmount - billingData.amountAdvanced;
    // Update the billing data
    billingData.itemList = updatedItemList;
    billingData.priceList = updatedPriceList;
    billingData.quantityList = updatedQuantityList;
    billingData.taxList = updatedTaxList;
    billingData.totalAmount = newTotalAmount;
    billingData.dueAmount = newDueAmount;
    await billingData.save();
    return NextResponse.json({ success: true, data: billingData }, { status: 200 });
  } catch (error) {
    console.error('Error updating bill:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update bill' },
      { status: 400 }
    );
  }
}

export async function PUT(req, { params }) {
  const { id } = await params; // Add await for Next.js 15
  try {
    await mongoose.connect(connectSTR);
    const data = await req.json();
    
    // Authentication and authorization
    const token = req.cookies.get('authToken')?.value;
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    const profile = await Profile.findById(userId);
    
    // Get existing bill
    const bill = await Billing.findById(id);
    if (!bill || bill.username !== profile.username) {
      return NextResponse.json(
        { success: false, error: "Bill not found" },
        { status: 404 }
      );
    }

    // Initialize arrays if not present
    const initializeNestedArrays = (arr, length) => 
      Array.isArray(arr) ? arr : Array(length).fill([]);

    // Handle nested array updates
    const updateNestedArray = (target, source, index) => {
      if (!target[index]) target[index] = [];
      target[index].push(...source);
      return target;
    };

    // Handle itemList, priceList, quantityList, and taxList updates
    if (data.itemList && data.priceList && data.quantityList && data.taxList) {
      const roomIndex = data.roomIndex || 0; // Default to first room

      // Initialize arrays if needed
      bill.itemList = initializeNestedArrays(bill.itemList, bill.roomNo.length);
      bill.priceList = initializeNestedArrays(bill.priceList, bill.roomNo.length);
      bill.quantityList = initializeNestedArrays(bill.quantityList, bill.roomNo.length);
      bill.taxList = initializeNestedArrays(bill.taxList, bill.roomNo.length);

      // Update specific room's arrays
      bill.itemList = updateNestedArray([...bill.itemList], data.itemList, roomIndex);
      bill.priceList = updateNestedArray([...bill.priceList], data.priceList.map(Number), roomIndex);
      bill.quantityList = updateNestedArray([...bill.quantityList], data.quantityList.map(Number), roomIndex);
      bill.taxList = updateNestedArray([...bill.taxList], data.taxList.map(Number), roomIndex);

      // Recalculate totals
      bill.totalAmount = bill.priceList.flatMap((roomPrices, i) => 
        roomPrices.map((price, j) => 
          price + (price * (bill.taxList[i][j] || 0) / 100)
        )
      ).reduce((sum, price) => sum + price, 0);

      bill.dueAmount = bill.totalAmount - bill.amountAdvanced;
    }

    // Handle remarks updates
    const updateRemarks = (field, newRemarks) => {
      if (newRemarks) {
        bill[field] = Array.isArray(bill[field]) 
          ? [...bill[field], ...newRemarks]
          : newRemarks;
      }
    };

    updateRemarks('FoodRemarks', data.FoodRemarks);
    updateRemarks('ServiceRemarks', data.ServiceRemarks);
    updateRemarks('RoomRemarks', data.RoomRemarks);

    // Handle payment updates
    if (data.amountAdvanced !== undefined) {
      const newPayment = Number(data.amountAdvanced);
      if (newPayment > bill.totalAmount) {
        return NextResponse.json(
          { success: false, error: "Payment exceeds total amount" },
          { status: 400 }
        );
      }
      bill.amountAdvanced += newPayment;
      bill.dueAmount = bill.totalAmount - bill.amountAdvanced;
      
      // Add payment details
      const now = new Date();
      bill.DateOfPayment.push(now);
      bill.ModeOfPayment.push(data.ModeOfPayment || 'Cash');
      bill.AmountOfPayment.push(newPayment);
    }

    // Handle status updates
    if (typeof data.Bill_Paid !== "undefined") {
      bill.Bill_Paid = data.Bill_Paid;
      if (data.Bill_Paid === "yes") bill.dueAmount = 0;
    }

    if (data.Cancelled) {
      bill.Cancelled = data.Cancelled;
    }

    const updatedBill = await bill.save();
    return NextResponse.json({ success: true, data: updatedBill }, { status: 200 });

  } catch (error) {
    console.error("Error updating bill:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update bill" },
      { status: 400 }
    );
  }
}


export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    await mongoose.connect(connectSTR);
    const token = req.cookies.get('authToken')?.value;
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    const profile = await Profile.findById(userId);
    const bill = await Billing.findById(id);
    if (!bill || bill.username !== profile.username) {
      return NextResponse.json(
        { success: false, error: 'Bill not found' },
        { status: 404 }
      );
    }
    const deletedBill = await Billing.findByIdAndDelete(id);
    if (!deletedBill) {
      return NextResponse.json(
        { success: false, error: 'Bill not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, message: 'Bill deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting bill:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete bill" },
      { status: 400 }
    );
  }
}