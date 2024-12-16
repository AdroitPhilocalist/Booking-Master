// PUT route to update user details
import mongoose from 'mongoose';
import connectSTR from '../../../lib/dbConnect';
import User from '../../../lib/models/User';

export async function PUT(req, { params }) {


  try {
    await mongoose.connect(connectSTR);
    const data = await req.json();
 const { id } = params;
 console.log(id);
    // Find the user and update
    const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
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
export async function DELETE(req, { params }) {
    try {
      // Connect to the database
      await mongoose.connect(connectSTR);
  
      // Get the user ID from the URL parameters
      const { id } = params;
      console.log(id);
  
      // Find the user by ID and delete it
      const deletedUser = await User.findByIdAndDelete(id);
  
      // Check if the user was found and deleted
      if (!deletedUser) {
        return new Response(
          JSON.stringify({ success: false, error: 'User not found' }),
          { status: 404 }
        );
      }
  
      // Return success response
      return new Response(
        JSON.stringify({ success: true, message: 'User deleted' }),
        { status: 200 }
      );
    } catch (error) {
      console.error('Error deleting user:', error);
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 400 }
      );
    }
  }