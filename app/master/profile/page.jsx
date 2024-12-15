import React from "react";
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
                <form>
                    {/* Hotel Name and Mobile Numbers */}
                    <Grid container spacing={3} marginBottom={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Hotel Name *"
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Mobile No *"
                                variant="outlined"
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Alt Mobile" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Email *" variant="outlined" required />
                        </Grid>
                    </Grid>

                    {/* GST Number and Website */}
                    <Grid container spacing={3} marginBottom={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="GST No" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Website" variant="outlined" />
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
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField fullWidth label="Address Line 2" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="District *"
                                variant="outlined"
                                select
                                required
                            >
                                {/* Example districts */}
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
                            <TextField fullWidth label="Pin Code *" variant="outlined" />
                        </Grid>
                    </Grid>

                    {/* Save Button */}
                    <Box textAlign="center">
                        <Button
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
