// pages/rooms/new.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function NewRoomForm() {
  const [roomNumber, setRoomNumber] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [floorNumber, setFloorNumber] = useState("");
  const [clean, setClean] = useState("Yes");
  const [error, setError] = useState(null);

  //const [occupied, setOccupied] = useState("Vacant"); // Added occupied state
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
    setError(null); // Reset error state

    // Create new room object with the correct enum values
    const newRoom = {
      number: roomNumber, // Assuming roomNumber is the state for room number
      category, // Assuming category is the selected category ID
      floor: floorNumber, // Assuming floorNumber is the state for floor number
      clean: clean === "Yes", // Convert clean to a boolean, assuming clean is "Yes" or "No"
      //occupied: occupied === "Confirmed" ? "Confirmed" : "Vacant", // Enum values as "Confirmed" or "Vacant"
    };

    try {
      // Check if room number already exists
      const roomsResponse = await fetch("/api/rooms");
      const roomsData = await roomsResponse.json();
      const existingRooms = roomsData.data;
      console.log("existingRooms",existingRooms)

      // Check if room number already exists
      const roomExists = existingRooms.some(
        (room) => room.number === roomNumber
      );
      console.log("room exist",roomExists)

      if (roomExists) {
        toast.error("Room number already exists!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }
      // Submit new room to backend
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoom),
      });

      // Handle response
      if (res.ok) {
        // Redirect to the room dashboard if the room creation is successful
        toast.success("New room added successfully!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        router.push("/property/roomlist");
      } else {
        console.error("Failed to create new room", res.statusText);
        toast.error("Failed to add new room!");
      }
    } catch (error) {
      // Handle any fetch errors
      console.error("An error occurred while creating the room:", error);
      toast.error("Failed to add new room!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-md animate-pulse">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />

      <h1 className="text-2xl mb-4">Add New Room</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <TextField
            id="Room Number"
            label="Room Number"
            variant="outlined"
            type="text"
            className="border rounded w-full "
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Box sx={{ minWidth: 120 }}>
            <FormControl
              variant="standard"
              sx={{ m: 1, minWidth: 120 }}
              fullWidth
            >
              <InputLabel id="demo-simple-select-label">
                Select a category
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select a category</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </div>
        <div className="mb-4">
          <TextField
            id="Floor Number"
            label="Floor Number"
            variant="outlined"
            type="text"
            className="border rounded w-full"
            value={floorNumber}
            onChange={(e) => setFloorNumber(e.target.value)}
            required
          />
        </div>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
          <InputLabel id="demo-clean-select-label ">Clean</InputLabel>
          <Select
            labelId="demo-clean-select-label"
            id="demo-clean-select"
            value={clean}
            onChange={(e) => setClean(e.target.value)}
          >
            <MenuItem value="">
              <em>Choose an option</em>
            </MenuItem>
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </FormControl>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
          onClick={() => router.push("/property/roomlist")}
        >
          Add Room
        </button>
      </form>
    </div>
  );
}
