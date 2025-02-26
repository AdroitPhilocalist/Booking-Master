"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, TextField, Grid, Typography, Paper, Box, Container, Chip, InputLabel, Select, MenuItem, CircularProgress, IconButton, InputAdornment } from "@mui/material";
import { styled } from "@mui/system";
import { useForm, Controller } from "react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import visibility icons
import Navbar from "../../../_components/Navbar";
import { Footer } from "../../../_components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "cookies-next";
import { jwtVerify } from "jose";

// Custom styling for the form container with enhanced design
const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: "600px",
  margin: "auto",
  borderRadius: "12px",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
  background: "#ffffff",
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.2)",
  },
}));

// Custom styling for the form fields with fallback values
const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-root": {
    borderRadius: "8px",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: (theme && theme.palette && theme.palette.grey && theme.palette.grey[300]) || "#d9d9d9",
    },
    "&:hover fieldset": {
      borderColor: (theme && theme.palette && theme.palette.primary && theme.palette.primary.main) || "#1976d2",
    },
    "&.Mui-focused fieldset": {
      borderColor: (theme && theme.palette && theme.palette.primary && theme.palette.primary.main) || "#1976d2",
    },
  },
  "& .MuiInputLabel-root": {
    fontSize: "0.875rem",
    color: (theme && theme.palette && theme.palette.grey && theme.palette.grey[700]) || "#666",
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  "& .MuiSelect-select": {
    borderRadius: "8px",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: (theme && theme.palette && theme.palette.grey && theme.palette.grey[300]) || "#d9d9d9",
    },
    "&:hover fieldset": {
      borderColor: (theme && theme.palette && theme.palette.primary && theme.palette.primary.main) || "#1976d2",
    },
    "&.Mui-focused fieldset": {
      borderColor: (theme && theme.palette && theme.palette.primary && theme.palette.primary.main) || "#1976d2",
    },
  },
}));

export default function AddUser() {
  const [loading, setLoading] = useState(false);
  const [hotelName, setHotelName] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const router = useRouter();

  const { register, control, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      name: "",
      hotelName: "",
      email: "",
      phone: "",
      password: "",
      userType: "Online",
      roles: [], // Array for multiple roles, now matching schema enum values
    },
  });

  // Fetch profile and hotel name on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getCookie("authToken");
        if (!token) {
          router.push("/");
          return;
        }

        const decoded = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || "your_secret_key"));
        const userId = decoded.payload.id;

        const response = await fetch(`/api/Profile/${userId}`);
        const result = await response.json();

        if (result.success) {
          const fetchedHotelName = result.data.hotelName || "";
          setHotelName(fetchedHotelName);
          setValue("hotelName", fetchedHotelName, { shouldValidate: true }); // Manually set the form value and validate
        } else {
          toast.error("Failed to fetch profile data");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Error occurred while fetching profile");
      }
    };

    fetchProfile();
  }, [router, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log(data);
      const response = await fetch("/api/User", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, roles: data.roles }),
      });
      const result = await response.json();
      console.log(result);
      if (result.success) {
        toast.success("User added successfully!");
        router.push("/master/users"); // Navigate back to the user list page
      } else {
        toast.error("Failed to create user: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while creating user");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "Property & Frontdesk", label: "Property & Frontdesk" }, // Updated to match schema
    { value: "Restaurant", label: "Restaurant" },
    { value: "Inventory", label: "Inventory" },
  ];

  const userTypeOptions = [
    { value: "Online", label: "Online" },
    { value: "Offline", label: "Offline" },
  ];

  // Toggle password visibility
  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Navbar />
      <div className="bg-amber-50 min-h-screen">
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
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <FormContainer>
            <Typography
              variant="h4"
              gutterBottom
              align="center"
              sx={{ color: "#1976d2", fontWeight: 600, mb: 3 }}
            >
              Add New User
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Name"
                    fullWidth
                    required
                    variant="outlined"
                    {...register("name", { required: "Name is required" })}
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Hotel Name"
                    fullWidth
                    required
                    variant="outlined"
                    value={hotelName || ""}
                    InputProps={{
                      readOnly: true,
                      disabled: true,
                    }}
                    {...register("hotelName", { 
                      required: "Hotel Name is required", 
                      validate: (value) => value.trim() !== "" || "Hotel Name cannot be empty" 
                    })}
                    error={!!errors.hotelName}
                    helperText={errors.hotelName?.message}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Email"
                    fullWidth
                    required
                    variant="outlined"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                        message: "Invalid email address",
                      },
                    })}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Phone"
                    fullWidth
                    required
                    variant="outlined"
                    {...register("phone", { required: "Phone number is required" })}
                    error={!!errors.phone}
                    helperText={errors.phone?.message}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <StyledTextField
                    label="Password"
                    fullWidth
                    required
                    variant="outlined"
                    type={showPassword ? "text" : "password"} // Toggle between text and password
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    sx={{ mb: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <InputLabel id="roles-label" sx={{ fontSize: "0.875rem", color: "#666", mb: 1 }}>
                      Roles
                    </InputLabel>
                    <Controller
                      name="roles"
                      control={control}
                      rules={{ required: "At least one role is required" }}
                      render={({ field }) => (
                        <StyledSelect
                          {...field}
                          labelId="roles-label"
                          multiple
                          fullWidth
                          variant="outlined"
                          renderValue={(selected) =>
                            selected
                              .map((value) => roleOptions.find((opt) => opt.value === value)?.label || value)
                              .join(", ")
                          }
                          error={!!errors.roles}
                          sx={{ mb: errors.roles ? 0 : 2 }}
                        >
                          {roleOptions.map((role) => (
                            <MenuItem key={role.value} value={role.value}>
                              {role.label}
                              {field.value?.includes(role.value) && (
                                <Chip
                                  label={role.label}
                                  size="small"
                                  sx={{ ml: 1, backgroundColor: "#e0f7fa", color: "#00796b" }}
                                  onDelete={() => {
                                    field.onChange(field.value.filter((v) => v !== role.value));
                                  }}
                                  onMouseDown={(e) => e.stopPropagation()}
                                />
                              )}
                            </MenuItem>
                          ))}
                        </StyledSelect>
                      )}
                    />
                    {errors.roles && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {errors.roles.message}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ mb: 2 }}>
                    <InputLabel id="userType-label" sx={{ fontSize: "0.875rem", color: "#666", mb: 1 }}>
                      User Type
                    </InputLabel>
                    <Controller
                      name="userType"
                      control={control}
                      rules={{ required: "User type is required" }}
                      render={({ field }) => (
                        <StyledSelect
                          {...field}
                          labelId="userType-label"
                          fullWidth
                          variant="outlined"
                          value={field.value || "Online"}
                          error={!!errors.userType}
                          sx={{ mb: errors.userType ? 0 : 2 }}
                        >
                          {userTypeOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </StyledSelect>
                      )}
                    />
                    {errors.userType && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {errors.userType.message}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box textAlign="center">
                    <Button
                      variant="contained"
                      fullWidth
                      color="primary"
                      type="submit"
                      disabled={loading}
                      size="large"
                      sx={{
                        mt: 2,
                        backgroundColor: "#1976d2",
                        "&:hover": { backgroundColor: "#1565c0" },
                        padding: "12px 24px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        transition: "background-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                      }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : "Add User"}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </FormContainer>
        </Container>
      </div>
      <Footer />
    </div>
  );
}