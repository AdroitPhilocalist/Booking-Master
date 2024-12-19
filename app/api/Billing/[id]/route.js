import mongoose from 'mongoose';
import connectSTR from '../../../lib/dbConnect';
import Billing from '../../../lib/models/Billing';
import { NextResponse } from 'next/server';

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

        // Update existing fields with new logic to handle quantityList
        const updatedItemList = data.itemList || billingData.itemList;
        const updatedPriceList = data.priceList || billingData.priceList;
        const updatedQuantityList = data.quantityList || billingData.quantityList;
        const updatedTaxList = data.taxList || billingData.taxList;

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
        const bill = await Billing.findById(id);
        
        if (!bill) {
            return NextResponse.json(
                { success: false, error: "Bill not found" }, 
                { status: 404 }
            );
        }

        // Handle itemList, priceList, quantityList, and taxList updates
        if (data.itemList && data.priceList && data.quantityList) {
            const newItemList = data.itemList || [];
            const newPriceList = data.priceList || [];
            const newQuantityList = data.quantityList || [];
            const newTaxList = data.taxList || [];

            bill.itemList = [...bill.itemList, ...newItemList];
            bill.priceList = [...bill.priceList, ...newPriceList];
            bill.quantityList = [...bill.quantityList, ...newQuantityList];
            bill.taxList = [...bill.taxList, ...newTaxList];

            // Recalculate total amount including new items, quantities, and taxes
            const newSubtotalList = bill.priceList.map((price, index) => 
                price * (bill.quantityList[index] || 1)
            );
            const newSubTotal = newSubtotalList.reduce((sum, subtotal) => sum + subtotal, 0);
            const newTaxTotal = bill.taxList.reduce((sum, tax) => sum + tax, 0);
            
            bill.totalAmount = newSubTotal + newTaxTotal;
            bill.dueAmount = bill.totalAmount - bill.amountAdvanced;
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