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
      enum: ['Vacant', 'Confirmed'], // Accept only these values
      required: true,
      default: 'Vacant', // Set default to "Vacant"
    },
    billingStarted: {
      type: String,
      enum: ['Yes', 'No'], // Enum for Yes/No values
      default: 'No', // Default to "No"
    },
    currentBillingId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the Invoice table
      ref: 'Invoice',
      default: null, // Default to null
    },
    currentGuestId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the NewBooking table
      ref: 'NewBooking',
      default: null, // Default to null
    },
  });

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);


