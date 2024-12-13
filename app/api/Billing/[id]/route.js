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

    // Find the existing billing data
    const billingData = await Billing.findById(id);
    if (!billingData) {
      return NextResponse.json(
        { success: false, error: 'Bill not found' },
        { status: 404 }
      );
    }

    // Extract the itemList and priceList from the incoming request
    const updatedItemList = data.itemList || billingData.itemList;
    const updatedPriceList = data.priceList || billingData.priceList;

    // Calculate new totalAmount and dueAmount
    const newTotalAmount = updatedPriceList.reduce((total, price) => total + price, 0);
    const newDueAmount = newTotalAmount - billingData.amountAdvanced;

    // Update the billing data
    billingData.itemList = updatedItemList;
    billingData.priceList = updatedPriceList;
    billingData.totalAmount = newTotalAmount;
    billingData.dueAmount = newDueAmount;

    // Save the updated bill
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


// Update a bill by ID (PUT)
export async function PUT(req, { params }) {
  const { id } = params; // Bill ID
  try {
    await mongoose.connect(connectSTR);
    const data = await req.json();

    // Find the bill
    const bill = await Billing.findById(id);
    if (!bill) {
      return NextResponse.json(
        { success: false, error: "Bill not found" },
        { status: 404 }
      );
    }

    // Conditionally update fields based on the request payload
    if (data.itemList && data.priceList) {
      const newItemList = data.itemList || [];
      const newPriceList = data.priceList || [];

      // Append only new items and prices
      bill.itemList = [...bill.itemList, ...newItemList];
      bill.priceList = [...bill.priceList, ...newPriceList];

      // Update the total amount
      const newTotalAmount =
        bill.totalAmount + newPriceList.reduce((sum, price) => sum + price, 0);
      bill.totalAmount = newTotalAmount;
      bill.dueAmount = newTotalAmount - bill.amountAdvanced;
    }

    // Update the Bill_Paid attribute if provided
    if (typeof data.Bill_Paid !== "undefined") {
      bill.Bill_Paid = data.Bill_Paid;
    }

    // Handle amountAdvanced updates
    if (typeof data.amountAdvanced !== "undefined") {
      const newAmountAdvanced = parseFloat(data.amountAdvanced);
      // console.log("newAmountAdvanced ="+newAmountAdvanced);
      // console.log("data.amountToBePaid = "+data.amountToBePaid);

      // Prevent overpayment
      if (newAmountAdvanced > bill.totalAmount) {
        return NextResponse.json(
          { success: false, error: "Payment exceeds total amount" },
          { status: 400 }
        );
      }

      bill.amountAdvanced = newAmountAdvanced;
      bill.dueAmount=bill.totalAmount-bill.amountAdvanced;

      // // Update the Bill_Paid status based on payment completion
      // bill.Bill_Paid = newAmountAdvanced >= bill.totalAmount ? "Yes" : "No";
    }

    // Save changes
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



// Delete a bill by ID (DELETE)
export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    await mongoose.connect(connectSTR);
    const deletedBill = await Billing.findByIdAndDelete(id);

    if (!deletedBill) {
      return NextResponse.json(
        { success: false, error: 'Bill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deletedBill }, { status: 200 });
  } catch (error) {
    console.error('Error deleting bill:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete bill' },
      { status: 400 }
    );
  }
}