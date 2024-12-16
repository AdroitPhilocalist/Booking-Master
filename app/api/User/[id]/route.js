// PUT route to update user details
import mongoose from 'mongoose';
import connectSTR from '../../../lib/dbConnect';
import User from '../../../lib/models/User';

export async function PUT(req, { params }) {
  const userId = params.id;
  try {
    await mongoose.connect(connectSTR);
    const data = await req.json();

    // Find the user and update
    const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });
console.log(updatedUser)
    if (!updatedUser) {
      return new Response(JSON.stringify({ success: false, error: 'User not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, data: updatedUser }), { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}
