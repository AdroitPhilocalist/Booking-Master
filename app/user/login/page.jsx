"use client";

import { useState } from "react";
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
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        // Redirect to the dashboard (or desired route)
        router.push("/dashboard");
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
      </motion.div>
    </Box>
  );
}
