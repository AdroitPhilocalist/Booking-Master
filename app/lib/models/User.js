import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: { 
    type: String,
    required: true
  },
  hotelName: {
    type: String,
    required: true
  },
  roles: {
    type: [String],
    enum: ['Property & Frontdesk', 'Restaurant', 'Inventory'],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  userType: {
    type: String,
    enum: ['Online', 'Offline'],
    required: true
  },
  username: {  // New field
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
