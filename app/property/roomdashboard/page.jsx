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
  const [guestList, setGuestList] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdatedRoom({ ...updatedRoom, [name]: value });

    // Fetch guests when status changes to "Occupied"
    if (e.target.name === "occupied" && e.target.value === "Occupied") {
      console.log("occupied");
      fetchGuests();
    }
  };
  const fetchGuests = async () => {
    try {
      const response = await fetch("/api/NewBooking"); // Replace with your actual API endpoint
      const data = await response.json();
      console.log(data.data);
      setGuestList(data.data);
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  };

  const handleEditSubmit = async () => {
    // Validation: Ensure a guest is selected when the room is set to "Occupied"
    if (updatedRoom.occupied === "Occupied" && !selectedGuest) {
      alert("Please select a guest before saving an occupied room.");
      return; // Prevent submission if validation fails
    }
    if (updatedRoom.occupied === "Occupied" && selectedGuest) {
      try {
        // Update the guest's roomNumbers in the database
        await fetch(`/api/NewBooking/${selectedGuest._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            roomNumbers: [...selectedGuest.roomNumbers, updatedRoom.number],
          }),
        });

        // Create billing entry when room status changes to "Occupied"
        const newBilling = {
          roomNo: updatedRoom.number,
          itemList: ["Room Charge"], // You can add more items here
          priceList: [updatedRoom.category.tarrif], // Assuming the room has a price field
          billStartDate: new Date().toISOString(), // Ensure proper date format
          billEndDate: new Date().toISOString(), // Ensure proper date format
          totalAmount: 0, // Set total amount based on room price
          amountAdvanced: 0, // Assuming no amount advanced initially
          dueAmount: 0, // Assuming no advance payment
        };

        console.log("Submitting billing data:", newBilling);

        // Create Billing Record in the database
        const billingResponse = await fetch("/api/Billing", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newBilling),
        });

        const billingData = await billingResponse.json();
        if (billingData.success) {
          console.log('Billing created successfully:', billingData.data);

          // Get the generated billing record's ID
          const billingId = billingData.data._id;
          console.log('Billing ID:', billingId);
          // Update the updatedRoom object with the new billing details
          const updatedRoomWithBilling = {
            ...updatedRoom, // Copy existing properties
            billingStarted: "Yes",  // Ensure that this is a string 'Yes'
            currentBillingId: billingId // Set to the newly created billing ID
          };

          // Update the room in the state
          setRooms((prevRooms) =>
            prevRooms.map((room) =>
              room._id === updatedRoom._id ? updatedRoomWithBilling : room
            )
          );

          // Call the handleEdit function to update the room in the database
          handleEdit(updatedRoomWithBilling);
        } else {
          console.error("Error creating billing:", billingData.error);
        }

      } catch (error) {
        console.error(
          "Error updating guest room numbers or creating billing:",
          error
        );
      }
    }

    // Save the room changes
    onEdit(updatedRoom);
    setIsEditing(false);
  };

  // Find category name based on room's category ID
  const categoryName =
    categories.find((cat) => cat._id === room.category)?.category ||
    "No Category";

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
          <div className="text-xs text-gray-500">Floor {room.floor}</div>{" "}
          {/* Display floor info */}
          <div className="text-xs text-gray-500">{categoryName}</div>
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
                Floor:
                <input
                  type="text"
                  name="floor"
                  value={updatedRoom.floor}
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
                Occupancy:
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
              {/* // Guest Selection (conditionally rendered) */}
              {updatedRoom.occupied === "Occupied" && (
                <label className="block mt-2">
                  Guest:
                  <select
                    onChange={(e) =>
                      setSelectedGuest(
                        guestList.find((g) => g._id === e.target.value)
                      )
                    }
                    className="border rounded w-full p-1"
                  >
                    <option value="">Select Guest</option>
                    {guestList.map((guest) => (
                      <option key={guest._id} value={guest._id}>
                        {guest.guestName} - {guest.mobileNo}
                      </option>
                    ))}
                  </select>
                </label>
              )}
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
  const [filter, setFilter] = useState("all"); // New state for filter

  const handleDelete = async (roomId) => {
    try {
      const res = await fetch(`/api/rooms/${roomId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setRooms(rooms.filter((room) => room._id !== roomId));
      } else {
        console.error("Failed to delete room");
      }
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const handleEdit = async (updatedRoom) => {
    try {
      const res = await fetch(`/api/rooms/${updatedRoom._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRoom),
      });
      const data = await res.json();
      if (data.success) {
        setRooms(
          rooms.map((room) =>
            room._id === updatedRoom._id ? updatedRoom : room
          )
        );
      } else {
        console.error("Failed to update room");
      }
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  // Fetch rooms and categories from the backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/rooms"),
          fetch("/api/roomCategories"),
        ]);
        const roomsData = await roomsResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (roomsData.success && Array.isArray(roomsData.data)) {
          setRooms(roomsData.data);
        } else {
          console.error("Failed to fetch rooms or rooms is not an array");
        }

        if (categoriesData.success && Array.isArray(categoriesData.data)) {
          setCategories(categoriesData.data);
        } else {
          console.error(
            "Failed to fetch categories or categories is not an array"
          );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter rooms based on search term and selected filter
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.number.toString().includes(searchTerm) ||
      categories
        .find((cat) => cat._id === room.category)
        ?.category.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "occupied" && room.occupied === "Occupied") ||
      (filter === "vacant" && room.occupied === "Vacant") ||
      (filter === "clean" && room.clean) ||
      (filter === "dirty" && !room.clean);

    return matchesSearch && matchesFilter;
  });

  // Summary Data
  const summaryItems = [
    {
      icon: Bed,
      title: "Occupied Rooms",
      count: rooms.filter((room) => room.occupied === "Occupied").length,
    },
    {
      icon: Home,
      title: "Vacant Rooms",
      count: rooms.filter((room) => room.occupied === "Vacant").length,
    },
    {
      icon: PlaneTakeoff,
      title: "Expected Arrivals",
      count: rooms.filter((room) => room.occupied === "Occupied").length,
    },
    { icon: PlaneLanding, title: "Expected Departures", count: "0" },
    { icon: UserCheck, title: "Today's Check In", count: "0" },
    { icon: UserPlus, title: "Today's Check Out", count: "0" },
  ];

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto p-4">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {summaryItems.map((item, index) => (
            <SummaryItem key={index} {...item} />
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setFilter("all")}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              All Rooms
            </button>
            <button
              onClick={() => setFilter("occupied")}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Occupied
            </button>
            <button
              onClick={() => setFilter("vacant")}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Vacant
            </button>
            <button
              onClick={() => setFilter("clean")}
              className="bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Clean
            </button>
            <button
              onClick={() => setFilter("dirty")}
              className="bg-purple-500 text-white px-4 py-2 rounded"
            >
              Dirty
            </button>
          </div>
          <div className="flex space-x-2">
            <Link
              href="roomdashboard/addRoom"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Room
            </Link>
            <Link
              href="roomdashboard/newguest"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              New Guest +
            </Link>
          </div>
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
            {filteredRooms.length === 0 && (
              <div className="text-center">No rooms found.</div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}