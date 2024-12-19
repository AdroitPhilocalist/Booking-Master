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

  bookingSource: {
    type: String,
    enum:['Walk In','Front Office','Agent','Office','Goibibo','Make My Trip','Agoda.com','Booking.com','Cleartrip','Yatra','Expedia','Trivago','Ease My Trip','Hotels.com','Happy Easy Go','TBO','Booking Engine','GO-MMT','Booking Master','Hoichoi','Others'],
    default:'Walk In'
  },
  // bookingPoint: {
  //   type: String,
  //   required: true
  // },

  dateofbirth:{
    type:Date,
    required:true
  },
  dateofanniversary:{
    type:Date,
    required:true
  },
  pinCode: {
    type: String
  },
  mobileNo: {
    type: String
  },
  guestName: {
    type: String,
    required:true
  },
  guestid:{
    type: String,
    enum:['adhaar','driving license'],
    required:true
  },
  guestidno:{    
    type: String,
    required:true
  },
  referenceno:{
    type:Number,
    required: true

  },
  companyName: {
    type: String
  },
  gstin: {
    type: String
  },
  guestEmail: {
    type: String
  },
  adults: {
    type: Number,
    default:1
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
    type: Date,
    required: true
  },
  expectedDeparture: {
    type: Date,
    required: true
  },
  bookingStatus: {
    type: String,
    enum:['Confirmed','Blocked'],
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
    required: true
  },
  mealPlan: {
    type: String,
    enum:['EP','AP','CP','MAP'],
    default:'EP'
  },
  bookingReference: {
    type: String
  },
  stopPosting: {
    type: Boolean,
    enum:[true,false],
    default: false
  },
  guestType: {
    type: String,
    enum:['General','VIP Guest','VVIP Guest','Scanty baggage'],
    default:'General'
  },
  guestNotes: {
    type: String
  },
  internalNotes: {
    type: String
  },
  roomNumbers: {
    type: [Number], // Array of room numbers
    required: true // You can set this to false if it's optional
  }
}, {
  timestamps: true
});

const NewBooking = mongoose.models.NewBooking || mongoose.model('NewBooking', newBookingSchema);

export default NewBooking;