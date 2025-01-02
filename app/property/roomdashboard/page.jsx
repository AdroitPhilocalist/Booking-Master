"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bed, Home, PlaneLanding, PlaneTakeoff, UserCheck, UserPlus, Edit2, Trash2, CheckCircle2, XCircle, User, Key, Building, Tags, Info, Calendar } from "lucide-react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";

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

const RoomCard = ({ room, onDelete, onEdit, categories, setRooms, handleEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [updatedRoom, setUpdatedRoom] = useState(room);
  const [guestList, setGuestList] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [currentGuest, setCurrentGuest] = useState(null);

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    // Special handling for 'clean' to convert string to boolean
    if (name === 'clean') {
      setUpdatedRoom({
        ...updatedRoom,
        [name]: value === 'true' // This will convert 'true' to true, and 'false' to false
      });
    } else {
      setUpdatedRoom({
        ...updatedRoom,
        [name]: value
      });
    }

    // Fetch guests when status changes to "Occupied"
    if (e.target.name === "occupied" && e.target.value === "Occupied") {
      fetchGuests();
    }
  };
  const fetchGuests = async () => {
    try {
      const response = await fetch("/api/NewBooking");
      const data = await response.json();
      setGuestList(data.data);
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  };
  // Modified fetchGuestDetails to always try to fetch guest info
  const fetchGuestDetails = async () => {
    if (room.currentGuestId) {
      try {
        const response = await fetch("/api/NewBooking");
        const data = await response.json();
        const guest = data.data.find(g => g._id === room.currentGuestId);
        setCurrentGuest(guest);
      } catch (error) {
        console.error("Error fetching guest details:", error);
      }
    } else {
      setCurrentGuest(null);
    }
  };
  useEffect(() => {
    fetchGuestDetails();
  }, [room.occupied, room.currentGuestId]);

  const handleEditSubmit = async () => {
    // Validation: Ensure a guest is selected when the room is set to "Occupied"
    if (updatedRoom.occupied === "Occupied" && !selectedGuest) {
      alert("Please select a guest before saving an occupied room.");
      return;
    }

    if (updatedRoom.occupied === "Occupied" && selectedGuest) {
      try {
        // Retrieve checkIn and checkOut from selected guest
        const { checkIn, checkOut } = selectedGuest;

        // Find the matching room category
        const matchingCategory = categories.find(
          (cat) => cat._id === updatedRoom.category._id
        );

        // Calculate the number of nights (days between checkIn and checkOut)
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const numberOfNights = Math.ceil(
          (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
        );

        // Calculate total room charge
        const roomCharge = matchingCategory ? matchingCategory.total * numberOfNights : 0;

        // Create billing entry when room status changes to "Occupied"
        const newBilling = {
          roomNo: updatedRoom.number,
          itemList: ["Room Charge"], // Add more items as necessary
          priceList: [roomCharge], // Assuming the room has a price field
          billStartDate: checkIn, // Use the checkIn value from the selected guest
          billEndDate: checkOut, // Use the checkOut value from the selected guest
          totalAmount: roomCharge,
          amountAdvanced: 0,
          dueAmount: roomCharge,
        };

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
          // Get the generated billing record's ID
          const billingId = billingData.data._id;

          // Update the updatedRoom object with the new billing details and guest ID
          const updatedRoomWithBilling = {
            ...updatedRoom,
            billingStarted: "Yes",
            currentBillingId: billingId,
            currentGuestId: selectedGuest._id, // Add the current guest's ID
          };

          // Update the room in the database directly
          const roomUpdateResponse = await fetch(`/api/rooms/${updatedRoomWithBilling._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedRoomWithBilling),
          });

          const roomUpdateData = await roomUpdateResponse.json();
          if (roomUpdateData.success) {
            setRooms((prevRooms) =>
              prevRooms.map((room) =>
                room._id === updatedRoomWithBilling._id ? updatedRoomWithBilling : room
              )
            );
          } else {
            console.error("Failed to update room in database:", roomUpdateData.error);
          }
        } else {
          console.error("Error creating billing:", billingData.error);
        }
      } catch (error) {
        console.error(
          "Error updating guest room numbers or creating billing:",
          error
        );
      }
    } else {
      // Update the room in the database directly if no billing creation is needed
      try {
        const roomUpdateResponse = await fetch(`/api/rooms/${updatedRoom._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(updatedRoom),
        });

        const roomUpdateData = await roomUpdateResponse.json();
        if (roomUpdateData.success) {
          setRooms((prevRooms) =>
            prevRooms.map((room) =>
              room._id === updatedRoom._id ? updatedRoom : room
            )
          );
        } else {
          console.error("Failed to update room in database:", roomUpdateData.error);
        }
      } catch (error) {
        console.error("Error updating room:", error);
      }
    }

    window.location.reload(); // Finalize editing
    setIsEditing(false);
  };

  // Find category name and icon based on room's category ID
  const categoryInfo = categories.find((cat) => cat._id === room.category._id) || {
    category: "No Category",
    icon: Tags // Default icon if no category found
  };

  // Color and icon mapping for room status
  const statusConfig = {
    Vacant: { bgColor: "bg-green-50", textColor: "text-green-600", icon: CheckCircle2 },
    Occupied: { bgColor: "bg-red-100", textColor: "text-red-600", icon: XCircle }
  };

  const cleanStatusConfig = {
    true: { bgColor: "bg-emerald-100", textColor: "text-emerald-700", label: "Clean" },
    false: { bgColor: "bg-yellow-100", textColor: "text-yellow-700", label: "Needs Cleaning" }
  };


  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Room Card Container with Enhanced Hover Effect */}
      <div
        className={`
          relative overflow-hidden transition-all duration-400 ease-in-out 
          border border-gray-200 rounded-lg shadow-md 
          transform ${isHovered ? 'scale-[1.03] shadow-xl' : 'scale-100 shadow-md'}
          ${statusConfig[room.occupied].bgColor}
        `}
      >
        {/* Room Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Building
              className={`
                text-amber-500 transition-transform duration-300
                ${isHovered ? 'rotate-6 scale-110' : 'rotate-0 scale-100'}
              `}
              size={24}
            />
            <h3
              className={`
                text-xl font-semibold text-gray-800 transition-all duration-300
                ${isHovered ? 'text-amber-700' : 'text-gray-800'}
              `}
            >
              Room {room.number}
              {/* Guest Info Icon (only shows when occupied) */}
              {room.occupied === "Occupied" && currentGuest && (
                <button
                  onClick={() => setShowGuestModal(true)}
                  className="ml-2 text-amber-600 hover:text-amber-800 transition-colors"
                >
                  <Info size={20} />
                </button>
              )}
              { <div className="flex items-center space-x-2">
                {React.createElement(categoryInfo.icon || Calendar, {
                  className: `text-gray-500 transition-transform duration-300 ${
                    isHovered ? "rotate-12 scale-110" : "rotate-0 scale-100"
                  }`,
                  size: 20,
                })}
                <span className="text-sm text-gray-600">
                  {currentGuest ? ('Next Booking: '+
                    `${new Date(currentGuest.checkIn).toLocaleDateString('en-GB')}-${new Date(currentGuest.checkOut).toLocaleDateString('en-GB')}`
                  ) : (
                    "No New Bookings"
                  )}
                </span>
              </div>}

            </h3>
          </div>

          {/* Action Buttons with Advanced Hover Effects */}
          <div
            className={`
              flex space-x-2 transition-all duration-300 ease-in-out
              ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
            `}
          >
            {!currentGuest && (<button
              onClick={() => setIsEditing(true)}
              className="
                text-blue-500 hover:bg-blue-100 p-2 rounded-full 
                transition-all duration-300 hover:rotate-6 hover:scale-110
                focus:outline-none focus:ring-2 focus:ring-blue-300
              "
            >
              <Edit2 size={20} />
            </button>)}
            {!currentGuest && (<button
              onClick={() => onDelete(room._id)}
              className="
                text-red-500 hover:bg-red-100 p-2 rounded-full 
                transition-all duration-300 hover:rotate-6 hover:scale-110
                focus:outline-none focus:ring-2 focus:ring-red-300
              "
            >
              <Trash2 size={20} />
            </button>)}
          </div>
        </div>

        {/* Room Details with Hover Animations */}
        <div className="p-4 space-y-3">
          <div className="flex justify-between items-center">
            <div className="p-4 space-y-3">
              <div className={`flex flex-col items-start space-y-1 transition-all duration-300`}>
                {/* Floor Information */}
                <div className="flex items-center space-x-2">
                  <Key
                    className={`text-gray-500 transition-transform duration-300 ${isHovered ? "rotate-12 scale-110" : "rotate-0 scale-100"
                      }`}
                    size={20}
                  />
                  <span className="text-sm text-gray-600">Floor: {room.floor}</span>
                </div>

                {/* Category Information */}
                <div className="flex items-center space-x-2">
                  {React.createElement(categoryInfo.icon || Tags, {
                    className: `text-gray-500 transition-transform duration-300 ${isHovered ? "rotate-12 scale-110" : "rotate-0 scale-100"
                      }`,
                    size: 20,
                  })}
                  <span className="text-sm text-gray-600">{categoryInfo.category}</span>

                </div>


              </div>
            </div>
            {/* Status Indicator */}
            <div className={`
                flex items-center space-x-2 
                px-3 py-1 rounded-full 
                transition-all duration-300
                ${statusConfig[room.occupied].textColor}
                ${statusConfig[room.occupied].bgColor}
                ${isHovered ? 'scale-105' : 'scale-100'}
              `}>
              {React.createElement(statusConfig[room.occupied].icon, {
                size: 16,
                className: "transition-transform duration-300 " +
                  (isHovered ? 'rotate-12' : 'rotate-0')
              })}
              <span className="text-xs font-medium">
                {room.occupied}
              </span>
            </div>
          </div>

          {/* Clean Status with Hover Effect */}
          <div className={`
              text-center py-1 rounded 
              transition-all duration-300
              ${cleanStatusConfig[room.clean].bgColor} 
              ${cleanStatusConfig[room.clean].textColor}
              ${isHovered ? 'scale-105 shadow-md' : 'scale-100'}
            `}>
            {cleanStatusConfig[room.clean].label}
          </div>

          {/* Guest Information Modal */}
          {/* {showGuestModal && currentGuest && (
          <GuestInfoModal 
            guest={currentGuest} 
            onClose={() => setShowGuestModal(false)} 
          />
        )} */}
        </div>
      </div>
      {/* Guest Modal (similar to Edit Modal) */}
      {showGuestModal && currentGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white w-96 rounded-lg shadow-2xl p-6 animate-slide-up border-4 border-amber-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-amber-700">Guest Details</h2>
              <button
                onClick={() => { setShowGuestModal(false) }}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <XCircle size={28} />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="text-amber-600" size={24} />
                <div>
                  <p className="font-semibold text-gray-800">{currentGuest.guestName}</p>
                  <p className="text-sm text-gray-500">{currentGuest.guestType || "Guest"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 bg-amber-50 p-3 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Mobile</p>
                  <p className="font-medium">{currentGuest.mobileNo}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 bg-amber-50 p-3 rounded-lg">
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium">{currentGuest.guestEmail || "N/A"}</p>
                </div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <div>
                    <p className="text-xs text-gray-500">Check-In</p>
                    <p className="font-medium">
                      {new Date(currentGuest.checkIn).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Check-Out</p>
                    <p className="font-medium">
                      {new Date(currentGuest.checkOut).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <User size={16} className="text-gray-500" />
                  <p className="text-sm text-gray-600">
                    {currentGuest.adults} Adults, {currentGuest.children} Children
                  </p>
                </div>
              </div>
              {currentGuest.remarks && (
                <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-500">
                  <p className="text-xs text-gray-500">Remarks</p>
                  <p className="text-sm">{currentGuest.remarks}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Edit Modal (Centered and Animated) */}
      {isEditing &&  (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white w-96 rounded-lg shadow-2xl p-6 animate-slide-up">
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
              {/* <label className="block mt-2">
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
              </label> */}
              {/* // Guest Selection (conditionally rendered)
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
              )} */}
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // New state for filter
  const [isLoading, setIsLoading] = useState(true);

  const handleDelete = async (roomId) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (updatedRoom) => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const updateRoomStatusBasedOnDate = async (rooms) => {
    const today = new Date();
    console.log(today);
    today.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

    const updatedRooms = await Promise.all(
      rooms.map(async (room) => {
        if (room.currentGuestId) {
          try {
            // Fetch guest details
            const response = await fetch("/api/NewBooking");
            const data = await response.json();
            const guest = data.data.find(g => g._id === room.currentGuestId);

            if (guest) {
              const checkInDate = new Date(guest.checkIn);
              checkInDate.setHours(0, 0, 0, 0); // Set to start of day for accurate comparison

              // Check if today is check-in day
              if (checkInDate.getTime() === today.getTime()) {
                // Only update if the status needs to change
                if (room.occupied !== "Occupied" || room.clean !== false) {
                  const updatedRoom = {
                    ...room,
                    occupied: "Occupied",
                    clean: false
                  };

                  // Update room in the database
                  const updateResponse = await fetch(`/api/rooms/${room._id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedRoom),
                  });

                  if (updateResponse.ok) {
                    return updatedRoom;
                  }
                }
              }
            }
          } catch (error) {
            console.error("Error updating room status:", error);
          }
        }
        return room;
      })
    );

    return updatedRooms;
  };

  // Modified useEffect to include room status updates
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [roomsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/rooms"),
          fetch("/api/roomCategories"),
        ]);

        const roomsData = await roomsResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (roomsData.success && Array.isArray(roomsData.data)) {
          // Update room statuses based on check-in dates
          const updatedRooms = await updateRoomStatusBasedOnDate(roomsData.data);
          setRooms(updatedRooms);
        } else {
          console.error("Failed to fetch rooms or rooms is not an array");
        }

        if (categoriesData.success && Array.isArray(categoriesData.data)) {
          setCategories(categoriesData.data);
        } else {
          console.error("Failed to fetch categories or categories is not an array");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up an interval to check and update room status every hour
    const intervalId = setInterval(async () => {
      const updatedRooms = await updateRoomStatusBasedOnDate(rooms);
      setRooms(updatedRooms);
    }, 3600000); // 1 hour in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
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
    <div>
      <div className="min-h-screen bg-amber-50">
        {/* Navigation */}
        <Navbar />
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
              <svg
                aria-hidden="true"
                className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="mt-4 text-gray-700">Loading Rooms...</span>
            </div>
          </div>
        )}
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
              {/* <button
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
            </button> */}
            </div>
            <div className="flex space-x-2">
              {/* <Link
              href="roomdashboard/addRoom"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add Room
            </Link> */}
              <Link
                href="roomdashboard/newguest"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                New Guest +
              </Link>
            </div>
          </div>

          {/* Rooms List */}
          {(
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRooms.map((room) => (
                <RoomCard
                  key={room._id}
                  room={room}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  handleEdit={handleEdit}
                  categories={categories}
                  setRooms={setRooms}
                />
              ))}
              {filteredRooms.length === 0 && (
                <div className="text-center">No rooms found.</div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        
      </div>
      <Footer />
    </div>
  );
}