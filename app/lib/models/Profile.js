import mongoose from 'mongoose';

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
    required: true,
  },
  addressLine2: {
    type: String,
    required: false,
  },
  district: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    default: 'India',
  },
  pinCode: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile;
