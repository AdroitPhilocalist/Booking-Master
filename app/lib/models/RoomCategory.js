import mongoose from 'mongoose';

const RoomCategorySchema = new mongoose.Schema({
  image: String,
  category: String,
  description: String,
  bedType: String,
  tariff: { type: Number, required: true },
  gst: { type: Number, required: true },
  total: { type: Number, required: true },
  baseAdult: Number,
  baseChild: Number,
  maxAdult: Number,
  maxChild: Number,
  maxCapacity: Number,
  extraAdult: Number,
  extraChild: Number,
  mealPlan: {
    EP: { type: String, enum: ['Yes', 'No'], default: 'No' },
    AP: { type: String, enum: ['Yes', 'No'], default: 'No' },
    CP: { type: String, enum: ['Yes', 'No'], default: 'No' },
    MAP: { type: String, enum: ['Yes', 'No'], default: 'No' },
  },
  bookingEng: { type: String, enum: ['Yes', 'No'], default: 'Yes' },
  confRoom: { type: String, enum: ['Yes', 'No'], default: 'No' },
  active: { type: String, enum: ['Yes', 'No'], default: 'Yes' },
});

export default mongoose.models.RoomCategory || mongoose.model('RoomCategory', RoomCategorySchema);
