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
    const newTotalAmount = newSubTotal + newTaxTotal;
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
  const { id } = params;
  try {
    await mongoose.connect(connectSTR);
    const data = await req.json();
    console.log('Data:', data);
    const token = req.cookies.get('authToken')?.value;
    const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
    const userId = decoded.payload.id;
    const profile = await Profile.findById(userId);
    const bill = await Billing.findById(id);
    if (!bill || bill.username !== profile.username) {
      return NextResponse.json(
        { success: false, error: "Bill not found" },
        { status: 404 }
      );
    }
    // Handle Cancelled updates
    if (data.Cancelled) {
      bill.Cancelled = data.Cancelled;
    }
    // Handle itemList, priceList, quantityList, and taxList updates
    if (data.itemList && data.priceList && data.quantityList && data.taxList) {
      const newItemList = data.itemList || [];
      const newPriceList = data.priceList || [];
      const newQuantityList = data.quantityList || [];
      const newTaxList = data.taxList || [];
      bill.itemList = [...bill.itemList, ...newItemList];
      bill.priceList = [...bill.priceList, ...newPriceList];
      bill.quantityList = [...bill.quantityList, ...newQuantityList];
      bill.taxList = [...bill.taxList, ...newTaxList];
      // Update the total amount
      const newTotalAmount = bill.totalAmount + newPriceList.reduce((sum, price) => sum + price, 0);
      bill.totalAmount = newTotalAmount;
      bill.dueAmount = newTotalAmount - bill.amountAdvanced;
    }
    // Handle remarks updates
    if (data.FoodRemarks) {
      bill.FoodRemarks = [...bill.FoodRemarks, ...data.FoodRemarks];
    }
    if (data.ServiceRemarks) {
      bill.ServiceRemarks = [...bill.ServiceRemarks, ...data.ServiceRemarks];
    }
    if (data.RoomRemarks) {
      bill.RoomRemarks = [...bill.RoomRemarks, ...data.RoomRemarks];
    }
    // Update the Bill_Paid attribute if provided
    if (typeof data.Bill_Paid !== "undefined") {
      bill.Bill_Paid = data.Bill_Paid;
    }
    // Handle amountAdvanced updates
    if (typeof data.amountAdvanced !== "undefined") {
      const newAmountAdvanced = parseFloat(data.amountAdvanced);
      if (newAmountAdvanced > bill.totalAmount) {
        return NextResponse.json(
          { success: false, error: "Payment exceeds total amount" },
          { status: 400 }
        );
      }
      bill.amountAdvanced = newAmountAdvanced;
      bill.dueAmount = bill.totalAmount - bill.amountAdvanced;
    }
    if (data.DateOfPayment) {
      bill.DateOfPayment = [...bill.DateOfPayment, ...data.DateOfPayment];
    }
    if (data.ModeOfPayment) {
      bill.ModeOfPayment = [...bill.ModeOfPayment, ...data.ModeOfPayment];
    }
    if (data.AmountOfPayment) {
      bill.AmountOfPayment = [...bill.AmountOfPayment, ...data.AmountOfPayment];
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