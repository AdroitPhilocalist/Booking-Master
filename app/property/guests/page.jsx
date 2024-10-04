"use client";
import { useEffect, useState } from 'react';

const Guests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the guest data
  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const response = await fetch('/api/NewBooking');
        const data = await response.json();
        
        if (data.success) {
          setGuests(data.data); // Assuming the data array contains guest bookings
        } else {
          setError('Failed to load guest data');
        }
      } catch (err) {
        setError('Error fetching guests');
      } finally {
        setLoading(false);
      }
    };

    fetchGuests();
  }, []);

  // Handle delete guest
  const handleDelete = async (id) => {
    // You would implement the delete API call here, e.g., using fetch:
    // await fetch(`/api/NewBooking/${id}`, { method: 'DELETE' });
    console.log(`Delete guest with ID: ${id}`);
  };

  // Handle edit guest
  const handleEdit = (id) => {
    // Navigate to an edit page or open a modal for editing
    console.log(`Edit guest with ID: ${id}`);
  };

  // Handle activating a guest (e.g., marking as active)
  const handleActivate = (id) => {
    console.log(`Activate guest with ID: ${id}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <h1 className="text-2xl font-bold mb-4">Guest List</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Mobile</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Address</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {guests.map((guest) => (
            <tr key={guest._id}>
              <td className="py-2 px-4 border-b">{guest.guestName}</td>
              <td className="py-2 px-4 border-b">{guest.mobileNo}</td>
              <td className="py-2 px-4 border-b">{guest.guestEmail}</td>
              <td className="py-2 px-4 border-b">{guest.address}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mr-2"
                  onClick={() => handleActivate(guest._id)}
                >
                  Active
                </button>
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded mr-2"
                  onClick={() => handleEdit(guest._id)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                  onClick={() => handleDelete(guest._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Guests;
