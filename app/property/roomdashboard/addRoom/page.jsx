// pages/rooms/new.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewRoomForm() {
  const [roomNumber, setRoomNumber] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [floorNumber, setFloorNumber] = useState("");
  const [clean, setClean] = useState("Yes");
  const [occupied, setOccupied] = useState("Vacant"); // Added occupied state
  const router = useRouter();

  useEffect(() => {
    // Fetch room categories from the backend
    async function fetchCategories() {
      const res = await fetch("/api/roomCategories");
      const data = await res.json();
      setCategories(data.data);
    }

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Create new room object with the correct enum values
    const newRoom = {
      number: roomNumber,           // Assuming roomNumber is the state for room number
      category,                     // Assuming category is the selected category ID
      floor: floorNumber,           // Assuming floorNumber is the state for floor number
      clean: clean === "Yes",       // Convert clean to a boolean, assuming clean is "Yes" or "No"
      occupied: occupied === "Confirmed" ? "Confirmed" : "Vacant", // Enum values as "Confirmed" or "Vacant"
    };
  
    try {
      // Submit new room to backend
      const res = await fetch("http://localhost:3000/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoom),
      });
  
      // Handle response
      if (res.ok) {
        // Redirect to the room dashboard if the room creation is successful
        router.back();
      } else {
        console.error("Failed to create new room", res.statusText);
      }
    } catch (error) {
      // Handle any fetch errors
      console.error("An error occurred while creating the room:", error);
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Add New Room</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Room Number</label>
          <input
            type="text"
            className="border rounded w-full p-2"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Room Category</label>
          <select
            className="border rounded w-full p-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.category}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Floor Number</label>
          <input
            type="text"
            className="border rounded w-full p-2"
            value={floorNumber}
            onChange={(e) => setFloorNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Clean</label>
          <select
            className="border rounded w-full p-2"
            value={clean}
            onChange={(e) => setClean(e.target.value)}
            required
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="mb-4">
        <label className="block text-gray-700">Occupied</label>
        <select
          className="border rounded w-full p-2"
          value={occupied}
          onChange={(e) => setOccupied(e.target.value)}
          required
        >
          <option value="Vacant">Vacant</option>
          <option value="Confirmed">Confirmed</option>
        </select>
      </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Room
        </button>
      </form>
    </div>
  );
}
