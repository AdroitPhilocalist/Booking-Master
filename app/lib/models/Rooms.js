import mongoose from 'mongoose';

const RoomSchema = new mongoose.Schema({
    number: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RoomCategory',
      required: true,
    },
    floor: {
      type: String,
      required: true,
    },
    clean: {
      type: Boolean,
      default: true,
    },
    occupied: {
      type: String,
      enum: ['Vacant', 'Confirmed'],
      required: true,
      default: 'Vacant',
    },
    billingStarted: {
      type: String,
      enum: ['Yes', 'No'],
      default: 'No',
    },
    currentBillingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Billing',
      default: null,
    },
    currentGuestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NewBooking',
      default: null,
    },
    checkInDateList: [{
      type: Date,
      required: true
    }],
    checkOutDateList: [{
      type: Date,
      required: true
    }],
    guestWaitlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NewBooking',
      default: []
    }],
    billWaitlist: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Billing',
      default: []
    }],
    username: {  // New field
      type: String,
      required: true,
    },
});

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);

