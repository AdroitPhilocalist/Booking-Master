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
      enum: ['Vacant', 'Confirmed'],  // Accept only these values
      required: true,
      default: 'Vacant',  // Set default to "Vacant"
    },
  });

export default mongoose.models.Room || mongoose.model('Room', RoomSchema);


