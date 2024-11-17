import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true, // Active by default
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

const Inventory = mongoose.models.Inventory || mongoose.model("Inventory", inventorySchema);

export default Inventory;
