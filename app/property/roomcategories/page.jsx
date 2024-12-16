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
import { IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';

export default function RoomCategories() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/roomCategories");
      console.log(res);
      const data = await res.json();
      console.log(data);
      if (data.success && data.data) setCategories(data.data);
      else setCategories([]);
    } catch (error) {
      console.error("Error fetching room categories:", error);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="min-h-screen bg-amber-50">
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
              <span className="mt-4 text-gray-700">Loading Room Categories...</span>
            </div>
          </div>
        )}
        <div className="p-4">
          <div style={{ backgroundColor: "#f5f5f5", padding: "1rem", marginBottom: "1rem",justifyItems:"center" }}>
            <h2 style={{ color: "#0e2f42", fontWeight: "bold", justifyContent:"center",fontSize:"1.25rem" }}>Category List</h2>
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
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Tariff (INR)</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>GST (%)</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Total (incl. GST)</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Booking Eng.</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Conf. Room</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Action</TableCell>
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
                      {/* <Button
                        variant="contained"
                        color={room.active === "Yes" ? "success" : "error"}
                        fullWidth
                      >
                        {room.active === "Yes" ? "Active" : "Inactive"}
                      </Button> */}
                      {/* <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: "0.5rem" }}
                        onClick={() => router.push(`roomcategories/editRoomCategory/${room._id}`)}
                      >
                        Edit
                      </Button> */}
                      <IconButton
                        color="primary"
                        onClick={() => router.push(`roomcategories/editRoomCategory/${room._id}`)}
                      >
                        <Edit />
                      </IconButton>
                      {/* <Button
                        variant="contained"
                        color="error"
                        fullWidth
                        style={{ marginTop: "0.5rem" }}
                        onClick={() => deleteCategory(room._id)}
                      >
                        Delete
                      </Button> */}
                      <IconButton
                        color="secondary"
                        onClick={() => deleteCategory(room._id)}
                      >
                        <Delete />
                      </IconButton>
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
