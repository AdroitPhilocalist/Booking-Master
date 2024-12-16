'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/app/_components/Navbar";
import { Footer } from "@/app/_components/Footer";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

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
      if (!res.ok) throw new Error("Failed to fetch categories");

      const data = await res.json();
      if (data.success && data.data) setCategories(data.data);
      else setCategories([]);
    } catch (error) {
      console.error("Error fetching room categories:", error);
      setCategories([]);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/roomCategories/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        alert("Category deleted successfully");
        fetchCategories();
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting room category:", error);
      alert("An error occurred while trying to delete the category");
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
          <div style={{ backgroundColor: "#f5f5f5", padding: "1rem", marginBottom: "1rem" }}>
            <h2 style={{ color: "#28bfdb", fontSize: "1.25rem" }}>Category List</h2>
          </div>
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="contained"
              color="success"
              onClick={() => router.push("/property/roomcategories/addRoomCategory")}
            >
              Add New +
            </Button>
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

          <TableContainer component={Paper} style={{ maxWidth: '80%', margin: '0 auto' }}>
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell  sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Image</TableCell>
                  <TableCell  sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Category</TableCell>
                  <TableCell  sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Description</TableCell>
                  <TableCell  sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Tariff (INR)</TableCell>
                  <TableCell  sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>GST (%)</TableCell>
                  <TableCell  sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Total (incl. GST)</TableCell>
                  <TableCell  sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Booking Eng.</TableCell>
                  <TableCell  sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Conf. Room</TableCell>
                  <TableCell  sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCategories.map((room) => (
                  <TableRow key={room.id} style={{ backgroundColor: "#f8f9fa" }}>
                    <TableCell>
                      <Image
                        src={room.image}
                        alt={room.category}
                        width={100}
                        height={100}
                      />
                    </TableCell>
                    <TableCell>{room.category}</TableCell>
                    <TableCell>{room.description}</TableCell>
                    <TableCell>{room.tariff}</TableCell>
                    <TableCell>{room.gst}</TableCell>
                    <TableCell>{room.total}</TableCell>
                    <TableCell>{room.bookingEng}</TableCell>
                    <TableCell>{room.confRoom}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={room.active === "Yes" ? "success" : "error"}
                        fullWidth
                      >
                        {room.active === "Yes" ? "Active" : "Inactive"}
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: "0.5rem" }}
                        onClick={() => router.push(`roomcategories/editRoomCategory/${room._id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        style={{ marginTop: "0.5rem" }}
                        onClick={() => deleteCategory(room._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
      <Footer />
    </div>
  );
}
