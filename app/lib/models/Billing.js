import mongoose from 'mongoose';

const BillingSchema = new mongoose.Schema(
  {
    roomNo: {
      type: String,
      ref: 'Room', // Reference to the Room number
      required: true,
    },
    itemList: {
      type: [String], // Array of item names
      required: true,
    },
    priceList: {
      type: [Number], // Array of corresponding item prices
      required: true,
    },
    billStartDate: {
      type: Date,
      ref: 'NewBooking', // Reference to the checkIn date from NewBooking
      required: true,
    },
    billEndDate: {
      type: Date,
      ref: 'NewBooking', // Reference to the checkOut date from NewBooking
      required: true,
    },
    totalAmount: {
      type: Number, // Total amount for the bill
      required: true,
      default: 0,
    },
    amountAdvanced: {
      type: Number, // Amount advanced by the guest
      default: 0, // Default to 0 if not provided
    },
    dueAmount: {
      type: Number, // Amount yet to be paid
      default: function () {
        return this.totalAmount - this.amountAdvanced; // Auto-calculate based on totalAmount and amountAdvanced
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
  }
);

const Billing = mongoose.models.Billing || mongoose.model('Billing', BillingSchema);

export default Billing;