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

const RoomCard = ({ room, onDelete, onEdit, categories }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedRoom, setUpdatedRoom] = useState(room);

  const handleEditChange = (e) => {
    setUpdatedRoom({ ...updatedRoom, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = () => {
    onEdit(updatedRoom);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded shadow p-4 relative">
      {/* Edit and Delete Buttons */}
      <div className="flex justify-between mb-2">
        <button onClick={() => setIsEditing(true)} className="text-blue-600">
          Edit
        </button>
        <button onClick={() => onDelete(room._id)} className="text-red-600">
          Delete
        </button>
      </div>

      {/* Room Information */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-2xl font-bold">Room {room.number}</div>
          <div className="text-xs text-gray-500">
            {room.category ? room.category.category : "No Category"}
          </div>
        </div>
      </div>

      {/* Vacant/Occupied Status */}
      <div
        className={`mt-2 px-2 py-1 rounded text-xs font-bold ${room.occupied === "Vacant"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
          }`}
      >
        {room.occupied === "Vacant" ? "Vacant" : "Occupied"}
      </div>

      {/* Guest Information */}
      {room.guest && (
        <div className="mt-2">
          <div className="font-semibold">{room.guest.name}</div>
          <div className="text-xs text-gray-500">{room.guest.id}</div>
        </div>
      )}

      {/* Clean/Dirty Status */}
      <div className="mt-2 text-center py-1 rounded bg-gray-100 text-gray-800">
        {room.clean ? "CLEAN" : "DIRTY"}
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
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
                <select
                  name="category"
                  value={updatedRoom.category._id}
                  onChange={handleEditChange}
                  className="border rounded w-full p-1"
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.category}
                    </option>
                  ))}
                </select>
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
                  value={updatedRoom.clean ? "true" : "false"}
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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (roomId) => {
    try {
      const res = await fetch(`https://booking-master-psi.vercel.app/api/rooms/${roomId}`, {
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

  // Fetch rooms and categories from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/rooms'),
          fetch('/api/roomCategories')
        ]);
        const roomsData = await roomsResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (roomsData.success && Array.isArray(roomsData.data)) {
          setRooms(roomsData.data);
        } else {
          console.error('Failed to fetch rooms or rooms is not an array');
        }

        if (categoriesData.success && Array.isArray(categoriesData.data)) {
          setCategories(categoriesData.data);
        } else {
          console.error('Failed to fetch categories or categories is not an array');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredRooms = rooms.filter((room) => {
    const category = categories.find(cat => cat._id === room.category);
    return room.number.toString().includes(searchTerm) ||
      (category && category.category.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  // Summary Data
  const summaryItems = [
    { icon: Bed, title: 'Occupied Rooms', count: rooms.filter(room => room.occupied === 'Occupied').length },
    { icon: Home, title: 'Vacant Rooms', count: rooms.filter(room => room.occupied === 'Vacant').length },
    { icon: PlaneTakeoff, title: 'Expected Arrivals', count: rooms.filter(room => room.occupied === 'Occupied').length },
    { icon: PlaneLanding, title: 'Expected Departures', count: '0' },
    { icon: UserCheck, title: "Today's Check In", count: '0' },
    { icon: UserPlus, title: "Today's Check Out", count: '0' },
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
          <Link href="roomdashboard/newguest" className="bg-blue-600 text-white px-4 py-2 rounded">
            New Guest +
          </Link>
        </div>

        {/* Rooms List */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onDelete={handleDelete}
                onEdit={handleEdit}
                categories={categories}
              />
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


