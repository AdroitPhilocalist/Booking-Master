"use client"
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  MenuItem,
} from "@mui/material";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getCookie } from 'cookies-next';
import { jwtVerify } from 'jose';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const [formData, setFormData] = useState({
    hotelName: "",
    mobileNo: "",
    altMobile: "",
    email: "",
    gstNo: "",
    website: "",
    addressLine1: "",
    addressLine2: "",
    district: "",
    pinCode: "",
  });

  const [profileExists, setProfileExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const router = useRouter();
  const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

  // Fetch existing profile data
  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      const token = getCookie('authToken');
      if (!token) {
        router.push('/'); // Redirect to login if no token is found
        return;
      }
      
      // Verify the token
      const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
      const userId = decoded.payload.id;
      
      // Fetch profile data
      const response = await fetch(`/api/Profile/${userId}`);
      console.log('Response:', response);
      const result = await response.json();
      
      console.log('Profile data:', result.data);
      
      if (result.success) {
        // Check Profile_Complete status
        setIsProfileComplete(result.data.Profile_Complete === 'yes');
        
        // Populate form data
        const profileData = result.data;
        const sanitizedData = {
          hotelName: profileData.hotelName || "",
          mobileNo: profileData.mobileNo || "",
          altMobile: profileData.altMobile || "",
          email: profileData.email || "",
          gstNo: profileData.gstNo || "",
          website: profileData.website || "",
          addressLine1: profileData.addressLine1 || "",
          addressLine2: profileData.addressLine2 || "",
          district: profileData.district || "",
          pinCode: profileData.pinCode || "",
        };
        setFormData(sanitizedData);
        setProfileExists(true);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast.error("Error loading profile data");
      router.push('/'); // Redirect to login on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Add a useEffect to handle navigation restriction
  useEffect(() => {
    if (!isProfileComplete) {
      // Prevent navigation to other pages
      const preventNavigation = (e) => {
        e.preventDefault();
        toast.error("Please complete your profile first");
        router.push('/master/profile');
      };

      // Block browser navigation attempts
      window.addEventListener('popstate', preventNavigation);
      
      // Optional: Block direct URL access
      if (window.location.pathname !== '/master/profile') {
        router.push('/master/profile');
      }

      // Cleanup
      return () => {
        window.removeEventListener('popstate', preventNavigation);
      };
    }
  }, [isProfileComplete, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch("/api/Profile", {
        method: profileExists ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          Profile_Complete: 'yes', // Set Profile_Complete to 'yes' upon submission
        }),
      });
      const result = await response.json();

      if (result.success) {
        // Check if profile is now complete
        if (result.data.Profile_Complete === 'yes') {
          setIsProfileComplete(true);
          toast.success("Profile completed successfully!");
        } else {
          toast.warning("Please complete all required fields");
        }
      } else {
        toast.error("Error creating/updating profile: " + result.error);
      }
    } catch (error) {
      console.error("Error posting data:", error);
      toast.error("Error creating/updating profile");
    } finally {
      setIsLoading(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
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
          <span className="mt-4 text-gray-700">Loading Profiles...</span>
        </div>
      </div>
    );
  }

  return (
 <div className="min-h-screen bg-amber-50">
     <div>
      {isProfileComplete && <Navbar />}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Box
        sx={{
          maxWidth: "800px",
          margin: "50px auto",
          padding: "20px",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          backgroundColor: "#fff",
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{ marginBottom: "20px", fontWeight: "bold", textAlign: "center" }}
        >
          Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} marginBottom={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Hotel Name *"
                variant="outlined"
                required
                name="hotelName"
                value={formData.hotelName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile No *"
                variant="outlined"
                required
                name="mobileNo"
                value={formData.mobileNo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Alt Mobile"
                variant="outlined"
                name="altMobile"
                value={formData.altMobile}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email *"
                variant="outlined"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} marginBottom={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="GST No"
                variant="outlined"
                name="gstNo"
                value={formData.gstNo}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Website"
                variant="outlined"
                name="website"
                value={formData.website}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Typography
            variant="h6"
            component="h2"
            sx={{ marginBottom: "10px", fontWeight: "bold" }}
          >
            Address
          </Typography>

          <Grid container spacing={3} marginBottom={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address Line 1 *"
                variant="outlined"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address Line 2"
                variant="outlined"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="District *"
                variant="outlined"
                select
                name="district"
                value={formData.district}
                onChange={handleChange}
              >
                <MenuItem value="District 1">District 1</MenuItem>
                <MenuItem value="District 2">District 2</MenuItem>
                <MenuItem value="District 3">District 3</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                variant="outlined"
                value="India"
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Pin Code *"
                variant="outlined"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box textAlign="center">
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: "#008080",
                color: "#fff",
                padding: "10px 20px",
                "&:hover": {
                  backgroundColor: "#006666",
                },
              }}
            >
              {profileExists ? "Update" : "Save"}
            </Button>
          </Box>
        </form>

      </Box>
      {isProfileComplete && <Footer />}
    </div>
 </div>
  );
};

export default ProfilePage;