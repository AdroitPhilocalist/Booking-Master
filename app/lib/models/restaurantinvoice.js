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
    custaddress: {
      type: String, // Optional customer address
      required: false,
    },
    custgst: {
      type: String, // Optional customer GST number
      required: false,
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
    gstArray: {
      type: [Number], // Array of GST percentages for individual items
      required: true,
      validate: {
        validator: function (v) {
          return v.length === this.menuitem.length; // Ensure it matches the number of menu items
        },
        message: "GST array length must match menu items length.",
      },
    },
    amountWithGstArray: {
      type: [Number], // Array of amounts including GST for individual items
      required: true,
      validate: {
        validator: function (v) {
          return v.length === this.menuitem.length; // Ensure it matches the number of menu items
        },
        message: "Amount with GST array length must match menu items length.",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.restaurantinvoice ||
  mongoose.model("restaurantinvoice", restaurantInvoiceSchema);