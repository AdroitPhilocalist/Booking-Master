// models/RestaurantBooking.js
import mongoose from 'mongoose';

const RestaurantBookingSchema = new mongoose.Schema({
  tableNo: {
    type: String,
    required: true,
    ref: 'Table', // Referencing the Table model
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  guestName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  username: {  // New field
    type: String,
    required: true,
  },
});

export default mongoose.models.RestaurantBooking ||
  mongoose.model('RestaurantBooking', RestaurantBookingSchema);
