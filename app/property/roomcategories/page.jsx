"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/app/_components/Navbar";
import { Footer } from "@/app/_components/Footer";

export default function RoomCategories() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/roomCategories");
      if (!res.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await res.json();
      if (data.success && data.data) {
        setCategories(data.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching room categories:", error);
      setCategories([]);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="min-h-screen bg-amber-50">
        <Navbar />
        <div className="p-4">
          <div className="bg-amber-950 p-4 mb-5">
            <h2 className="text-xl text-white">Category List</h2>
          </div>
          <div className="flex justify-between items-center mb-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => router.push("/property/roomcategories/addRoomCategory")}
            >
              Add New +
            </button>
            <div className="flex items-center">
              <span className="mr-2">Display</span>
              <select className="border p-1 rounded">
                <option>15</option>
              </select>
              <span className="ml-2">records</span>
            </div>
            <div>
              <input
                type="search"
                placeholder="Search..."
                className="ml-4 border rounded p-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Image</th>
                  <th className="border p-2">Category</th>
                  <th className="border p-2 w-48">Description</th>
                  <th className="border p-2">Tariff (INR)</th>
                  <th className="border p-2">GST (%)</th>
                  <th className="border p-2">Total (incl. GST)</th>
                  <th className="border p-2">Booking Eng.</th>
                  <th className="border p-2">Conf. Room</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((room) => (
                  <tr key={room.id} className="border-b">
                    <td className="border p-2">
                      <Image
                        src={room.image}
                        alt={room.category}
                        width={100}
                        height={100}
                      />
                    </td>
                    <td className="border p-2">{room.category}</td>
                    <td className="border p-2">
                      <div className="w-48 whitespace-normal">{room.description}</div>
                    </td>
                    <td className="border p-2">{room.tariff}</td>
                    <td className="border p-2">{room.gst}</td>
                    <td className="border p-2">{room.total}</td>
                    <td className="border p-2">{room.bookingEng}</td>
                    <td className="border p-2">{room.confRoom}</td>
                    <td className="border p-2">
                      <div className="flex flex-col space-y-2">
                        <button
                          className={`w-full px-2 py-1 rounded text-white ${
                            room.active === "Yes" ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {room.active === "Yes" ? "Active" : "Inactive"}
                        </button>
                        <button
                          className="w-full px-2 py-1 bg-blue-500 text-white rounded"
                          onClick={() => router.push(`roomcategories/editRoomCategory/${room._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full px-2 py-1 bg-red-500 text-white rounded"
                          onClick={() => deleteCategory(room._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}