import React, { useState } from "react";
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

const ProfilePage = () => {
    // State to store form data
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

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("/api/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                alert("Profile created successfully!");
            } else {
                alert("Error creating profile: " + result.error);
            }
        } catch (error) {
            console.error("Error posting data:", error);
            alert("Error creating profile");
        }
    };

    return (
        <div className="min-h-screen bg-amber-50">
            <Navbar />
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
                    {/* Hotel Name and Mobile Numbers */}
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

                    {/* GST Number and Website */}
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

                    {/* Address Fields */}
                    <Grid container spacing={3} marginBottom={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Address Line 1 *"
                                variant="outlined"
                                required
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
                                required
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

                    {/* Save Button */}
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
                            Save
                        </Button>
                    </Box>
                </form>
            </Box>
            <Footer />
        </div>
    );
};

export default ProfilePage;
