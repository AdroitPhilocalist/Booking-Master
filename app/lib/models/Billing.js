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
    Bill_Paid: {
      type: String,
      enum: ['yes', 'no'], // Restrict values to 'yes' or 'no'
      default: 'no', // Default value for every new bill
    },
    // New fields
    DateOfPayment: {
      type: [Date], // Array of payment dates
      default: [], // Empty by default
    },
    ModeOfPayment: {
      type: [String], // Array of modes of payment
      default: [], // Empty by default
      validate: {
        validator: function (modes) {
          const validModes = ['UPI', 'Cash', 'Credit Card', 'Debit Card', 'Net Banking', 'Other'];
          return modes.every((mode) => validModes.includes(mode));
        },
        message: 'Invalid mode of payment. Allowed values are UPI, Cash, Credit Card, Debit Card, Net Banking, or Other.',
      },
    },
    
    AmountOfPayment: {
      type: [Number], // Array of payment amounts
      default: [], // Empty by default
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt timestamps
  }
);

const Billing = mongoose.models.Billing || mongoose.model('Billing', BillingSchema);

export default Billing;