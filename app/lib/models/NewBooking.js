import mongoose from 'mongoose';

const newBookingSchema = new mongoose.Schema({
  bookingType: { 
    type: String, 
    enum: ['FIT','Group','Corporate','Corporate Group','Office','Social Events'], 
    default:'FIT' 
  },
  bookingId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  dateofbirth: { 
    type: Date, 
    required: true 
  },
  dateofanniversary: { 
    type: Date, 
  },
  pinCode: { 
    type: String 
  },
  mobileNo: { 
    type: String,
    required: true 
  },
  guestName: { 
    type: String, 
    required: true 
  },
  guestid: { 
    type: String, 
    enum: ['Adhaar','Driving License','Passport','Voter ID Card','Others'], 
    required: true 
  },
  guestidno: { 
    type: String, 
    required: true 
  },
  // New fields with conditional validation
  passportIssueDate: {
    type: Date,
    required: function() {
      return this.guestid === 'passport';
    }
  },
  passportExpireDate: {
    type: Date,
    required: function() {
      return this.guestid === 'passport';
    }
  },
  visaNumber: {
    type: String,
    required: function() {
      return this.guestid === 'passport';
    }
  },
  visaIssueDate: {
    type: Date,
    required: function() {
      return this.guestid === 'passport';
    }
  },
  visaExpireDate: {
    type: Date,
    required: function() {
      return this.guestid === 'passport';
    }
  },
  referenceno: { 
    type: String, 
     
  },
  companyName: { 
    type: String 
  },
  gstin: { 
    type: String 
  },
  guestEmail: { 
    type: String,
  },
  adults: { 
    type: Number, 
    default: 1 
  },
  children: { 
    type: Number, 
    default: 0 
  },
  checkIn: { 
    type: Date, 
    required: true 
  },
  checkOut: { 
    type: Date, 
    required: true 
  },
  expectedArrival: { 
    type: String 
  },
  expectedDeparture: { 
    type: String 
  },
  bookingStatus: { 
    type: String, 
    enum: ['Confirm', 'Block','Pencil'], 
    required: true 
  },
  address: { 
    type: String 
  },
  remarks: { 
    type: String 
  },
  state: { 
    type: String, 
  },
  mealPlan: { 
    type: String, 
    enum: ['EP','AP','CP','MAP'], 
    default: 'EP' 
  },
  bookingReference: { 
    type: String 
  },
  stopPosting: { 
    type: Boolean, 
    enum: [true,false], 
    default: false 
  },
  guestNotes: { 
    type: String 
  },
  internalNotes: { 
    type: String 
  },
  roomNumbers: { 
    type: [Number],
    required: true 
  },
  CheckedIn: {
    type: Boolean,
    default: false
  },
  CheckedOut: {
    type: Boolean,
    default: false
  },
  username: {  // New field
    type: String,
    required: true,
  },
}, { 
  timestamps: true 
});

const NewBooking = mongoose.models.NewBooking || mongoose.model('NewBooking', newBookingSchema);
export default NewBooking;