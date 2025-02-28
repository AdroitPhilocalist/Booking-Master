"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import { getCookie } from "cookies-next";
import { jwtVerify } from "jose";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timestamp, setTimestamp] = useState(null);

  // Function to delete specific cookies
  const deleteSpecificCookies = () => {
    // Delete adminauthToken if it exists
    if (document.cookie.split("; ").find((row) => row.startsWith("authToken="))) {
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
    // Delete userAuthToken if it exists
    if (document.cookie.split("; ").find((row) => row.startsWith("adminauthToken="))) {
      document.cookie = "adminauthToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
  };

  useEffect(() => {
    setTimestamp(new Date().getFullYear());
    // Delete adminauthToken and userAuthToken if they exist
    deleteSpecificCookies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !hotelName || !password) {
      toast.error("Please fill in all the fields", {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, hotelName, password }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
        });

        const token = getCookie("userAuthToken");
        if (!token) {
          router.push("/user/login");
          return;
        }

        const decoded = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || "your_secret_key"));
        console.log("Decoded token:", decoded);
        const userId = decoded.payload.userId;
        const profileId = decoded.payload.profileId;

        const response = await fetch(`/api/User/${userId}`);
        const result = await response.json();
        console.log("Profile data:", result.data._id);
        // Fetch user data to get roles
        const userRes = await fetch(`/api/User/${result.data._id}`);
        const userData = await userRes.json();
        console.log("User data:", userData);
        if (userData.success && userData.data && userData.data.roles) {
          const roles = userData.data.roles;
          console.log("User roles:", roles);
          // Determine the first role and its first route
          if (roles.length > 0) {
            const firstRole = roles[0]; // Get the first role from the array
            let redirectPath = "/dashboard"; // Default redirect if no role match
            switch (firstRole) {
              case "Property & Frontdesk":
                redirectPath = "/property/roomdashboard"; // First link for Property & Frontdesk
                break;
              case "Restaurant":
                redirectPath = "/Restaurant/dashboard"; // First link for Restaurant
                break;
              case "Inventory":
                redirectPath = "/Inventory/Category"; // First link for Inventory
                break;
              default:
                redirectPath = "/dashboard"; // Fallback redirect
            }
            router.push(redirectPath);
          } else {
            router.push("/dashboard"); // Redirect to dashboard if no roles
          }
        } else {
          router.push("/dashboard"); // Fallback redirect if user data fetch fails
        }
      } else {
        toast.error(data.error || "Login failed", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login", {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1de9b6 0%, #1dc4e9 100%)",
        padding: 2,
      }}
    >
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          sx={{
            maxWidth: 400,
            padding: 3,
            borderRadius: 3,
            boxShadow: 10,
          }}
        >
          <CardContent>
            <Typography
              variant="h4"
              align="center"
              sx={{
                fontWeight: "bold",
                mb: 3,
                color: "#1c313a",
              }}
            >
              User Login
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Hotel Name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
              />
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #00acc1, #1de9b6)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #1de9b6, #00acc1)",
                  },
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <div className="mt-8 text-center text-white text-sm">
          © 2025, Hotel Booking. All Rights Reserved.
        </div>
      </motion.div>
    </Box>
  );
}