import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const profileSchema = new mongoose.Schema({
  hotelName: {
    type: String,
    required: true,
  },
  mobileNo: {
    type: String,
    required: true,
  },
  altMobile: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  gstNo: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
  addressLine1: {
    type: String,
    required: false,
  },
  addressLine2: {
    type: String,
    required: false,
  },
  district: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    default: 'India',
  },
  pinCode: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  Profile_Complete: { type: String, enum: ['yes', 'no'], default: 'no' },
  Active: { type: String, enum: ['yes', 'no'], default: 'yes' },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// Hash password before saving
profileSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);
export default Profile;