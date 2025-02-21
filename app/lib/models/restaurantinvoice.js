import mongoose from "mongoose";

// List of Indian states and union territories (28 states + 8 UTs = 36 entities)
const indianStatesAndUTs = [
  // States (28)
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  // Union Territories (8)
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

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
      required: false,
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
    cgstArray: {
      type: [Number], // Array of CGST percentages for individual items
      required: true,
      validate: {
        validator: function (v) {
          return v.length === this.menuitem.length; // Ensure it matches the number of menu items
        },
        message: "CGST array length must match menu items length.",
      },
    },
    sgstArray: {
      type: [Number], // Array of SGST percentages for individual items
      required: true,
      validate: {
        validator: function (v) {
          return v.length === this.menuitem.length; // Ensure it matches the number of menu items
        },
        message: "SGST array length must match menu items length.",
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
    username: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      enum: indianStatesAndUTs, // Enum with all 36 states and union territories
      required: false, // Optional field, change to true if mandatory
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.restaurantinvoice ||
  mongoose.model("restaurantinvoice", restaurantInvoiceSchema);