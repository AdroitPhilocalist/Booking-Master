"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bed,
  Home,
  PlaneLanding,
  PlaneTakeoff,
  UserCheck,
  UserPlus,
} from "lucide-react";
import Navbar from "@/app/_components/Navbar";
import { Footer } from "@/app/_components/Footer";

// Component for summary items at the top of the page
const SummaryItem = ({ icon: Icon, title, count }) => (
  <div className="flex items-center space-x-2 bg-white p-2 rounded shadow">
    <Icon className="text-amber-600" />
    <div>
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-lg font-bold">{count}</div>
    </div>
  </div>
);

const RoomCard = ({ room, onDelete, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedRoom, setUpdatedRoom] = useState(room);
  
    const handleEditChange = (e) => {
      setUpdatedRoom({ ...updatedRoom, [e.target.name]: e.target.value });
    };
  
    const handleEditSubmit = () => {
      // Prevent changing the category
      const { category, ...roomWithoutCategory } = updatedRoom;
      onEdit({ ...roomWithoutCategory, category: room.category.category }); // Keep original category
      setIsEditing(false);
    };
  
    return (
      <div className="bg-white rounded shadow p-4 relative">
        <button onClick={() => setIsEditing(true)} className="absolute top-2 right-2 text-blue-600">Edit</button>
        <button onClick={() => onDelete(room._id)} className="absolute top-2 right-16 text-red-600">Delete</button>
        <div className="flex justify-between items-start">
          <div>
            <div className="text-2xl font-bold">Room {room.number}</div>
            <div className="text-xs text-gray-500">
  {room.category ? room.category.category : 'No Category'}
</div>

          </div>
          <div className={`px-2 py-1 rounded text-xs ${room.occupied === 'Vacant' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {room.occupied === 'Vacant' ? 'Vacant' : 'Confirmed'}
          </div>
        </div>
        {room.guest && (
          <div className="mt-2">
            <div className="font-semibold">{room.guest.name}</div>
            <div className="text-xs text-gray-500">{room.guest.id}</div>
          </div>
        )}
        <div className="mt-2 text-center py-1 rounded bg-gray-100 text-gray-800">
          {room.clean ? 'CLEAN' : 'DIRTY'}
        </div>
        {/* Edit Modal */}
        {isEditing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded p-4">
              <h3 className="text-lg font-bold">Edit Room</h3>
              <div className="mt-2">
                <label className="block">
                  Room Number:
                  <input
                    type="text"
                    name="number"
                    value={updatedRoom.number}
                    onChange={handleEditChange}
                    className="border rounded w-full p-1"
                  />
                </label>
                <label className="block mt-2">
                  Category:
                  <div className="border rounded w-full p-1 bg-gray-200">{room.category.category}</div>
                </label>
                <label className="block mt-2">
                  Occupied:
                  <select
                    name="occupied"
                    value={updatedRoom.occupied}
                    onChange={handleEditChange}
                    className="border rounded w-full p-1"
                  >
                    <option value="Vacant">Vacant</option>
                    <option value="Occupied">Occupied</option>
                  </select>
                </label>
                <label className="block mt-2">
                  Clean:
                  <select
                    name="clean"
                    value={updatedRoom.clean ? 'true' : 'false'}
                    onChange={handleEditChange}
                    className="border rounded w-full p-1"
                  >
                    <option value="true">Clean</option>
                    <option value="false">Dirty</option>
                  </select>
                </label>
                <div className="flex justify-end mt-4">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={handleEditSubmit}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-300 text-black px-2 py-1 rounded ml-2"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  

export default function RoomDashboard() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (roomId) => {
    try {
      const res = await fetch(`/api/rooms/${roomId}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        setRooms(rooms.filter(room => room._id !== roomId));
      } else {
        console.error('Failed to delete room');
      }
    } catch (error) {
      console.error('Error deleting room:', error);
    }
  };

  const handleEdit = async (updatedRoom) => {
    try {
      const res = await fetch(`/api/rooms/${updatedRoom._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRoom),
      });
      const data = await res.json();
      if (data.success) {
        setRooms(rooms.map(room => (room._id === updatedRoom._id ? updatedRoom : room)));
      } else {
        console.error('Failed to update room');
      }
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  // Fetch rooms from the backend API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms');
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setRooms(data.data);
        } else {
          console.error('Failed to fetch rooms or rooms is not an array');
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter((room) =>
    room.number.toString().includes(searchTerm) ||
    room.category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Summary Data
  const summaryItems = [
    { icon: Bed, title: 'Occupied Rooms', count: rooms.filter(room => room.occupied === 'Confirmed').length },
    { icon: Home, title: 'Vacant Rooms', count: rooms.filter(room => room.occupied === 'Vacant').length },
    { icon: PlaneTakeoff, title: 'Expected Arrivals', count: '02' },
    { icon: PlaneLanding, title: 'Expected Departures', count: '00' },
    { icon: UserCheck, title: "Today's Check In", count: '00' },
    { icon: UserPlus, title: "Today's Check Out", count: '00' },
  ];

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto p-4">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by room number or category"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded w-full p-2"
          />
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {summaryItems.map((item, index) => (
            <SummaryItem key={index} {...item} />
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex space-x-2 mb-2 sm:mb-0">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">All Rooms</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded">Occupied</button>
            <button className="bg-green-500 text-white px-4 py-2 rounded">Vacant</button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded">Blocked</button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded">Dirty</button>
          </div>
          <Link href="roomdashboard/addRoom" className="bg-green-600 text-white px-4 py-2 rounded">
            Add Room
          </Link>
        </div>

        {/* Rooms List */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <RoomCard key={room._id} room={room} onDelete={handleDelete} onEdit={handleEdit} />
            ))}
            {filteredRooms.length === 0 && <div className="text-center">No rooms found.</div>}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}


