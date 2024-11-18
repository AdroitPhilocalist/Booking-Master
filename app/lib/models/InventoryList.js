import mongoose from "mongoose";

const inventoryListSchema = new mongoose.Schema(
  {
    itemCode: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      required: true,
    },
    segment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Inventory',  // References the Inventory Category model
      required: true,
    },
    auditable: {
      type: String,
      enum: ['yes', 'no'],
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    quantityUnit: {
      type: String,
      enum: ['pieces', 'kgs', 'grams', 'litres'],
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

const InventoryList = mongoose.models.InventoryList || mongoose.model("InventoryList", inventoryListSchema);

export default InventoryList;