import mongoose from "mongoose";

const restaurantInvoiceSchema = new mongoose.Schema(
  {
    invoiceno: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    custname: {
      type: String,
      required: true,
    },
    custphone: {
      type: String,
      required: true,
    },
    quantity: {
      type: [Number],
      required: true,
    },
    menuitem: {
      type: [String],
      required: true,
    },
    price: {
      type: [Number],
      required: true,
    },
    totalamt: {
      type: Number,
      required: true,
    },
    gst: {
      type: Number,
      required: true,
    },
    payableamt: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.restaurantinvoice || 
  mongoose.model("restaurantinvoice", restaurantInvoiceSchema);