import StockReport from "../../lib/models/Stockreport";
import InventoryList from "../../lib/models/InventoryList";
import connectSTR from "../../lib/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(connectSTR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// GET all stock reports with populated inventory references
export async function GET() {
  try {
    await connectToDatabase();
    const stockReports = await StockReport.find()
      .populate("quantity", "stock") // Populates stock field from InventoryList
      .populate("unit", "quantityUnit") // Populates quantityUnit field from InventoryList
      .populate("taxpercent", "tax"); // Populates tax field from InventoryList

    return NextResponse.json({ stockReports });
  } catch (error) {
    console.error("Error fetching stock reports:", error);
    return NextResponse.json(
      { error: "Error fetching stock reports from the database" },
      { status: 500 }
    );
  }
}

// POST a new stock report
export async function POST(request) {
  try {
    const data = await request.json();
    const requiredFields = [
      "purchaseorderno",
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

    const newStockReport = new StockReport(data);
    await newStockReport.save();

    const populatedStockReport = await StockReport.findById(newStockReport._id)
      .populate("quantity", "stock")
      .populate("unit", "quantityUnit")
      .populate("taxpercent", "tax");

    return NextResponse.json(
      { message: "Stock report added successfully", stockReport: populatedStockReport },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding stock report:", error);
    return NextResponse.json(
      { error: "Error adding stock report to the database" },
      { status: 500 }
    );
  }
}
