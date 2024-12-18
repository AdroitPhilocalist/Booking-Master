import mongoose from 'mongoose';
import connectSTR from '../../../lib/dbConnect';
import Billing from '../../../lib/models/Billing';
import { NextResponse } from 'next/server';

// Fetch a single bill by ID (GET)
export async function GET(req, { params }) {
  const { id } = params;
  try {
    await mongoose.connect(connectSTR);
    const bill = await Billing.findById(id);

    if (!bill) {
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

    const billingData = await Billing.findById(id);
    if (!billingData) {
      return NextResponse.json(
        { success: false, error: 'Bill not found' },
        { status: 404 }
      );
    }

    // Update existing fields with new logic to handle taxList
    const updatedItemList = data.itemList || billingData.itemList;
    const updatedPriceList = data.priceList || billingData.priceList;
    const updatedTaxList = data.taxList || billingData.taxList;

    // Calculate new totalAmount including taxes
    const newSubTotal = updatedPriceList.reduce((total, price) => total + price, 0);
    const newTaxTotal = updatedTaxList.reduce((total, tax) => total + tax, 0);
    const newTotalAmount = newSubTotal + newTaxTotal;

    const newDueAmount = newTotalAmount - billingData.amountAdvanced;

    // Update the billing data
    billingData.itemList = updatedItemList;
    billingData.priceList = updatedPriceList;
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

    const bill = await Billing.findById(id);
    if (!bill) {
      return NextResponse.json(
        { success: false, error: "Bill not found" },
        { status: 404 }
      );
    }

    // Handle itemList, priceList, and taxList updates
    if (data.itemList && data.priceList) {
      const newItemList = data.itemList || [];
      const newPriceList = data.priceList || [];
      const newTaxList = data.taxList || [];

      bill.itemList = [...bill.itemList, ...newItemList];
      bill.priceList = [...bill.priceList, ...newPriceList];
      bill.taxList = [...bill.taxList, ...newTaxList];

      // Recalculate total amount including new taxes
      const newSubTotal = bill.priceList.reduce((sum, price) => sum + price, 0);
      const newTaxTotal = bill.taxList.reduce((sum, tax) => sum + tax, 0);
      bill.totalAmount = newSubTotal + newTaxTotal;
      bill.dueAmount = bill.totalAmount - bill.amountAdvanced;
    }

    // Rest of the PUT method remains the same...
    
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

// Existing DELETE method remains the same