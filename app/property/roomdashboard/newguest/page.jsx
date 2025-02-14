"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bed,
  Users,
  Calendar,
  Clock,
  Building,
  Tag,
  ArrowRight,
  CheckCircle,
  Home,
  Hotel,
  Coffee,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Checkbox,
  Typography,
  Box,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import Navbar from "../../../_components/Navbar";
import { Footer } from "../../../_components/Footer";
import TextField from "@mui/material/TextField";
import { Grid } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { Autocomplete } from "@mui/material";

export default function BookingForm() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [mobileNumbers, setMobileNumbers] = useState([]); // For storing all mobile numbers
  const [filteredMobileNumbers, setFilteredMobileNumbers] = useState([]); // For filtered mobile numbers
  const [focusedInput, setFocusedInput] = useState(null);
  // Add form validation state
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    bookingType: "",
    bookingId: "",
    bookingSource: "",
    bookingPoint: "",
    dateofbirth: "",
    dateofanniversary: "",
    referenceno: "",
    pinCode: "",
    mobileNo: "",
    guestName: "",
    guestid: "",
    guestidno: "",
    passportIssueDate: "",
    passportExpireDate: "",
    visaNumber: "",
    visaIssueDate: "",
    visaExpireDate: "",
    companyName: "",
    gstin: "",
    guestEmail: "",
    adults: 1,
    children: 0,
    checkIn: "",
    checkOut: "",
    expectedArrival: "",
    expectedDeparture: "",
    bookingStatus: "",
    address: "",
    remarks: "",
    state: "",
    mealPlan: "",
    bookingReference: "",
    stopPosting: false,
    guestType: "",
    guestNotes: "",
    internalNotes: "",
  });

  const placeholders = {
    bookingPoint: "Enter Booking Point",
    pinCode: "Enter Pin Code",
    mobileNo: "Enter Mobile Number",
    guestName: "Enter Guest Name",
    companyName: "Enter Company Name",
    dateofbirth: "Enter date of birth",
    dateofanniversary: "Enter date of anniversary",
    gstin: "Enter GSTIN",
    guestEmail: "Enter Guest Email",
    address: "Enter Guest Address",
    state: "Enter Guest State",
    bookingReference: "Enter Booking Reference",
    guestNotes: "Enter Guest Notes",
    internalNotes: "Enter Internal Notes",
    remarks: "Enter Remarks",
  };

  // Validation rules
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "guestName",
      "expectedArrival",
      "expectedDeparture",
      "mobileNo",
      "guestid",
      "guestidno",

      "checkIn",
      "checkOut",
      "dateofbirth",
      "bookingStatus",
    ];

    // Initialize all error flags at the start
    let dateErrors = false;
    let mobileError = false;

    let gstinError = false;

    let passportError = false;
    let visaError = false;
    let passportIssueError = false;
    let visaIssueError = false;
    let dobError = false;


    // Date of Birth validation (18 years or above)
    if (formData.dateofbirth) {
      const dobDate = new Date(formData.dateofbirth);
      const today = new Date();
      const age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();

      // Adjust age if birthday hasn't occurred this year
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dobDate.getDate())
      ) {
        const adjustedAge = age - 1;
        if (adjustedAge < 18) {
          newErrors.dateofbirth = "Guest must be 18 years or older";
          dobError = true;
        }
      } else if (age < 18) {
        newErrors.dateofbirth = "Guest must be 18 years or older";
        dobError = true;
      }
    }

    // Anniversary date validation (not in future)
    if (formData.dateofanniversary) {
      const anniversaryDate = new Date(formData.dateofanniversary);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison

      if (anniversaryDate > today) {
        newErrors.dateofanniversary =
          "Anniversary date cannot be in the future";
        anniversaryError = true;
      }
    }

    // Check if any required field is empty
    const hasEmptyFields = requiredFields.some((field) => !formData[field]);

    // Date validations
    const currentDate = new Date();
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);

    if (
      new Date(checkInDate).setHours(0, 0, 0, 0) <
      new Date(currentDate).setHours(0, 0, 0, 0)
    ) {
      newErrors.checkIn = "Check-in date cannot be in the past";
      dateErrors = true;
    }

    if (checkOutDate <= checkInDate) {
      newErrors.checkOut = "Check-out date must be after check-in date";
      dateErrors = true;
    }

    // Mobile number validation
    if (formData.mobileNo && !/^\d{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = "Mobile number must be 10 digits";
      mobileError = true;
    }



    // GSTIN validation
    if (
      formData.gstin &&
      !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/.test(formData.gstin)
    ) {
      newErrors.gstin = "Invalid GSTIN format";
      gstinError = true;
    }




    // Passport-related validations
    if (formData.guestid === "passport") {
      const today = new Date();
      const passportIssue = new Date(formData.passportIssueDate);
      const visaIssue = new Date(formData.visaIssueDate);
      const passportExpiry = new Date(formData.passportExpireDate);
      const visaExpiry = new Date(formData.visaExpireDate);

      if (passportIssue > today) {
        newErrors.passportIssueDate = "Passport issue date cannot be in future";
        passportIssueError = true;
      }

      if (visaIssue > today) {
        newErrors.visaIssueDate = "Visa issue date cannot be in future";
        visaIssueError = true;
      }

      if (passportExpiry < today) {
        newErrors.passportExpireDate = "Passport has expired";
        passportError = true;
      }

      if (visaExpiry < today) {
        newErrors.visaExpireDate = "Visa has expired";
        visaError = true;
      }
    }

    setErrors(newErrors);

    const isValid =
      !hasEmptyFields &&
      !dateErrors &&
      !mobileError &&

      !gstinError &&

      !passportError &&
      !visaError &&
      !passportIssueError &&
      !visaIssueError &&
      !dobError;

    setIsFormValid(isValid);
    return isValid && Object.keys(newErrors).length === 0;
  };

  const [rooms, setRooms] = useState([]); // Store available rooms
  const [selectedRooms, setSelectedRooms] = useState([]); // Store selected rooms
  const [modalOpen, setModalOpen] = useState(false); // Modal state

  const router = useRouter();

  useEffect(() => {
    const generateBookingId = () => {
      const timestamp = Date.now().toString(36);
      const randomString = Math.random().toString(36).substring(2, 8);
      return `SOLV-${timestamp}-${randomString}`.toUpperCase();
    };

    setFormData((prev) => ({ ...prev, bookingId: generateBookingId() }));
  }, []);

  // Function to format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Return empty string if invalid date
    return date.toISOString().split("T")[0];
  };

  // Add this useEffect to fetch all mobile numbers when component mounts
  useEffect(() => {
    const fetchMobileNumbers = async () => {
      try {
        const response = await fetch("/api/NewBooking");
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const result = await response.json();
        if (result.success && result.data) {
          // Extract unique mobile numbers
          const uniqueMobileNumbers = [
            ...new Set(result.data.map((booking) => booking.mobileNo)),
          ];
          setMobileNumbers(uniqueMobileNumbers);
        }
      } catch (error) {
        console.error("Error fetching mobile numbers:", error);
      }
    };

    fetchMobileNumbers();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/roomCategories");
      if (!response.ok) throw new Error("Failed to fetch categories");
      const result = await response.json();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter(
        (room) => room.category._id === selectedCategory
      );
      setFilteredRooms(filtered);
    }
  }, [selectedCategory, rooms]);

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Update handleChange to include validation
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error for the changed field
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const getLabel = (fieldName, defaultLabel) => {
    if (focusedInput === fieldName && placeholders[fieldName]) {
      return placeholders[fieldName];
    }
    return defaultLabel;
  };
  const handleCheckAvailability = async () => {
    if (!validateForm()) {
      alert(
        "Please fill in all required fields correctly before checking room availability"
      );
      return;
    }
    try {
      if (!formData.checkIn || !formData.checkOut) {
        alert("Please select both Check-in and Check-out dates first");
        return;
      }
      console.log(
        "Checking availability for:",
        formData.checkIn,
        formData.checkOut
      );
      const response = await fetch("/api/rooms");
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }
      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error("No room data available");
      }
      console.log("Fetched rooms:", result.data);
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);

      // Filter available rooms based on check-in and check-out date lists
      const availableRooms = result.data.filter((room) => {
        // If no existing bookings, room is available
        console.log("Checking room:", room.number);
        console.log("Check-in dates:", room.checkInDateList);
        console.log("Check-out dates:", room.checkOutDateList);
        if (
          !room.checkInDateList ||
          !room.checkOutDateList ||
          room.checkInDateList.length === 0 ||
          room.checkOutDateList.length === 0 ||
          room.billingStarted === "No"
        ) {
          return true;
        }

        // Check each booking period for conflicts
        for (let i = 0; i < room.checkInDateList.length; i++) {
          const existingCheckIn = new Date(room.checkInDateList[i]);
          const existingCheckOut = new Date(room.checkOutDateList[i]);
          console.log("Existing booking:", existingCheckIn, existingCheckOut);
          console.log("New booking:", checkInDate, checkOutDate);
          // Check for overlap
          const hasOverlap = !(
            checkOutDate < existingCheckIn || checkInDate >= existingCheckOut
          );
          console.log("No overlap found", hasOverlap);
          if (hasOverlap) {
            return false; // Room is not available if there's any overlap
          }
        }
        return true; // Room is available if no overlaps found
      });

      setRooms(availableRooms);
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching room data:", error.message);
      alert("Error fetching room data");
    }
  };

  const handleRoomSelection = (roomId) => {
    setSelectedRooms((prevSelectedRooms) => {
      const newSelectedRooms = prevSelectedRooms.includes(roomId)
        ? prevSelectedRooms.filter((room) => room !== roomId)
        : [...prevSelectedRooms, roomId];

      console.log("Updated selectedRooms:", newSelectedRooms); // Debugging selection

      return newSelectedRooms;
    });
  };

  const handleSubmit = async () => {
    // Sort function for dates with corresponding arrays
    const sortDatesWithCorrespondingArrays = (dates, ...arrays) => {
      const indices = dates.map((_, index) => index);
      indices.sort((a, b) => new Date(dates[a]) - new Date(dates[b]));
      return [
        indices.map(i => dates[i]),
        ...arrays.map(arr => indices.map(i => arr[i]))
      ];
    };
    try {
      console.log('Selected rooms:', selectedRooms);
      const bookingData = { ...formData, roomNumbers: selectedRooms };

      // Create booking
      const bookingResponse = await fetch('/api/NewBooking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      const bookingResult = await bookingResponse.json();
      const guestId = bookingResult.data._id;

      // Fetch necessary data
      const [roomsResponse, categoriesResponse] = await Promise.all([
        fetch('/api/rooms'),
        fetch('/api/roomCategories')
      ]);

      const roomsData = await roomsResponse.json();
      const categoriesData = await categoriesResponse.json();
      const rooms = roomsData.data;
      const categories = categoriesData.data;

      // Initialize arrays for consolidated billing
      let allRoomNumbers = [];
      let roomCharges = [];
      let roomTaxes = [];
      let quantities = [];
      let totalAmount = 0;

      // Process each selected room
      for (const selectedRoomNumber of selectedRooms) {
        const matchedRoom = rooms.find(room => room.number === selectedRoomNumber);
        const matchedCategory = categories.find(category => category._id === matchedRoom.category._id);

        // Calculate billing details
        const checkInDate = new Date(formData.checkIn);
        const checkOutDate = new Date(formData.checkOut);
        const numberOfNights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const roomCharge = matchedCategory.total * numberOfNights;
        const roomTax = matchedCategory.gst;

        // Collect data for consolidated billing
        allRoomNumbers.push(selectedRoomNumber);
        roomCharges.push([roomCharge]);
        roomTaxes.push([roomTax]);
        quantities.push([1]);
        totalAmount += roomCharge;

        // Update room records...
        // (Keep existing room update logic here)
      }

      // Create single billing record for all rooms
      const billingResponse = await fetch('/api/Billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomNo: allRoomNumbers,
          itemList: Array.from({ length: allRoomNumbers.length }, () => ['Room Charge']),
          priceList: roomCharges,
          taxList: roomTaxes,
          quantityList: quantities,
          billStartDate: new Date(formData.checkIn),
          billEndDate: new Date(formData.checkOut),
          totalAmount: totalAmount,
          amountAdvanced: 0,
          dueAmount: totalAmount,
          Bill_Paid: 'no',
        })
      });


      const billingData = await billingResponse.json();
      console.log("billing data", billingData);
      if (!billingData.success) throw new Error('Failed to create consolidated billing');

      // Update all rooms with the same billing ID
      for (const selectedRoomNumber of selectedRooms) {
        const matchedRoom = rooms.find(room => room.number === selectedRoomNumber);
        // Prepare new dates and lists
        const newCheckInDateList = [...(matchedRoom.checkInDateList || []), formData.checkIn];
        const newCheckOutDateList = [...(matchedRoom.checkOutDateList || []), formData.checkOut];
        const newBillWaitlist = [...(matchedRoom.billWaitlist || []), billingData.data._id];
        const newGuestWaitlist = [...(matchedRoom.guestWaitlist || []), guestId];

        // Sort all arrays based on proximity to current date
        const currentDate = new Date();
        const [sortedCheckInDates, sortedCheckOutDates, sortedBillWaitlist, sortedGuestWaitlist] =
          sortDatesWithCorrespondingArrays(
            newCheckInDateList,
            newCheckOutDateList,
            newBillWaitlist,
            newGuestWaitlist
          );

        // Initialize room update object
        const roomUpdate = {
          checkInDateList: sortedCheckInDates,
          checkOutDateList: sortedCheckOutDates,
          billWaitlist: sortedBillWaitlist,
          guestWaitlist: sortedGuestWaitlist
        };

        if (matchedRoom.billingStarted === 'No') {
          // If room is not currently booked, simply assign new booking as current
          roomUpdate.currentBillingId = billingData.data._id;
          roomUpdate.currentGuestId = guestId;
          roomUpdate.billingStarted = 'Yes';
        } else {
          // Fetch current guest's booking details
          console.log('matchedRoom:', matchedRoom);
          console.log('matchedRoom.currentGuestId:', matchedRoom.currentGuestId);
          const currentGuestResponse = await fetch(`/api/NewBooking/${matchedRoom.currentGuestId}`);
          const currentGuestData = await currentGuestResponse.json();
          console.log('currentGuestData:', currentGuestData);
          const currentGuestCheckIn = new Date(currentGuestData.checkIn);
          console.log('currentGuestCheckIn:', currentGuestCheckIn);
          console.log('sortedGuestWaitlist:', sortedGuestWaitlist);
          // Fetch first waitlisted guest's booking details
          const firstWaitlistedGuestResponse = await fetch(`/api/NewBooking/${sortedGuestWaitlist[0]._id}`);
          const firstWaitlistedGuestData = await firstWaitlistedGuestResponse.json();
          const firstWaitlistedCheckIn = new Date(firstWaitlistedGuestData.data.checkIn);

          // Compare dates to determine which should be current
          const currentDateDiff = Math.abs(currentDate - currentGuestCheckIn);
          const waitlistedDateDiff = Math.abs(currentDate - firstWaitlistedCheckIn);

          if (waitlistedDateDiff < currentDateDiff) {
            // If waitlisted guest's check-in is closer to current date
            roomUpdate.currentGuestId = sortedGuestWaitlist[0];
            roomUpdate.currentBillingId = sortedBillWaitlist[0];
          }
        }
        const roomUpdateResponse = await fetch(`/api/rooms/${matchedRoom._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roomUpdate)
        });
      }

      alert('Booking created with consolidated billing!');

      setModalOpen(false);
      router.push('/property/roomdashboard');

    } catch (error) {
      console.error('Error in booking submission:', error);
      alert(`Failed to create booking: ${error.message}`);
    }
  };

  const modalAnimation = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const cardAnimation = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const filterAnimation = {
    hidden: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setSelectedRooms([]); // Reset selected rooms
    setSelectedCategory("all"); // Reset category filter
    setModalOpen(false); // Close the modal
  };

  // Update handleMobileNumberChange to include validation
  const handleMobileNumberChange = async (event, newValue) => {
    const inputValue = newValue || event.target.value;

    setFormData((prev) => ({
      ...prev,
      mobileNo: inputValue,
    }));

    // Clear mobile number error
    setErrors((prev) => ({
      ...prev,
      mobileNo: undefined,
    }));

    if (newValue && mobileNumbers.includes(newValue)) {
      try {
        const response = await fetch("/api/NewBooking");
        if (!response.ok) throw new Error("Failed to fetch bookings");
        const result = await response.json();
        if (result.success && result.data) {
          const guestBooking = result.data.find(
            (booking) => booking.mobileNo === newValue
          );
          if (guestBooking) {
            setFormData((prev) => ({
              ...prev,
              guestName: guestBooking.guestName || "",
              dateofbirth: formatDate(guestBooking.dateofbirth) || "",
              dateofanniversary:
                formatDate(guestBooking.dateofanniversary) || "",
              guestEmail: guestBooking.guestEmail || "",
              guestid: guestBooking.guestid || "",
              guestidno: guestBooking.guestidno || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching guest details:", error);
      }
    }

    if (inputValue) {
      const filtered = mobileNumbers.filter((number) =>
        number.startsWith(inputValue)
      );
      setFilteredMobileNumbers(filtered);
    } else {
      setFilteredMobileNumbers([]);
    }
  };

  // Replace the mobile number TextField with Autocomplete
  const mobileNumberField = (
    <Autocomplete
      freeSolo
      options={filteredMobileNumbers}
      value={formData.mobileNo}
      onChange={(event, newValue) => handleMobileNumberChange(event, newValue)}
      onInputChange={(event, newValue) =>
        handleMobileNumberChange(event, newValue)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Mobile Number"
          required
          fullWidth
          variant="outlined"
        />
      )}
      filterOptions={(options, { inputValue }) =>
        options.filter((option) => option.startsWith(inputValue))
      }
    />
  );

  // Add useEffect for continuous form validation
  useEffect(() => {
    validateForm();
  }, [formData]);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-amber-50">
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow rounded-lg p-6">
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                color: "black",
                fontWeight: "bold",
                textTransform: "uppercase"
              }}
            >
              Guest Reservation Form
            </Typography>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Booking Details Section */}
      <div className="mb-6">
      <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#0277bd",
                fontWeight: "bold",
                textTransform: "uppercase"
              }}
            >
              Booking Details
            </Typography>
        <Grid container spacing={2} mt={1}>
          {/* Booking ID - read-only */}
          <Grid item xs={12} md={6} >
            <TextField
              label="Booking ID"
              name="bookingId"
              value={formData.bookingId}
              InputProps={{ readOnly: true }}
              variant="outlined"
              fullWidth
              disabled
            />
          </Grid>
          {/* Booking Type - select field */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Booking Type"
              name="bookingType"
              value={formData.bookingType}
              onChange={handleChange}
              fullWidth
              select
            >
              {[
                "FIT",
                "Group",
                "Corporate",
                "Corporate Group",
                "Social Events",
                "Others",
              ].map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {/* Booking Reference */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Booking Reference"
              name="bookingReference"
              value={formData.bookingReference}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          {/* Reference Number */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Reference Number"
              name="referenceno"
              value={formData.referenceno}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          {/* Booking Status */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Booking Status"
              name="bookingStatus"
              value={formData.bookingStatus}
              onChange={handleChange}
              fullWidth
              select
              required
            >
              {["Confirm", "Block"].map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </div>
                {/* Guest Details Section */}
<div className="mb-6">
<Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#0277bd",
                fontWeight: "bold",
                textTransform: "uppercase"
              }}
            >
              Guest Details
            </Typography>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <TextField
      label="Guest Name"
      name="guestName"
      value={formData.guestName}
      onChange={handleChange}
      fullWidth
      required
    />
    <Autocomplete
      freeSolo
      options={filteredMobileNumbers}
      value={formData.mobileNo}
      onChange={(event, newValue) => handleMobileNumberChange(event, newValue)}
      onInputChange={(event, newValue) => handleMobileNumberChange(event, newValue)}
      renderInput={(params) => (
        <TextField {...params} label="Mobile Number" required fullWidth />
      )}
      filterOptions={(options, { inputValue }) => options.filter((option) => option.startsWith(inputValue))}
    />
    <TextField
      label="Email ID"
      name="guestEmail"
      value={formData.guestEmail}
      onChange={handleChange}
      fullWidth
    />
    <TextField
      label="Date of Birth"
      type="date"
      name="dateofbirth"
      value={formData.dateofbirth}
      onChange={handleChange}
      error={(errors.dateofbirth)}
      helperText={errors.dateofbirth}
      InputLabelProps={{ shrink: true }}
      fullWidth
    />
    <TextField
      label="Date of Anniversary"
      type="date"
      name="dateofanniversary"
      value={formData.dateofanniversary}
      onChange={handleChange}
      
      InputLabelProps={{ shrink: true }}
      fullWidth
    />
  </div>
</div>

                {/* Identity Section */}
      <div className="mb-6">
      <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#0277bd",
                fontWeight: "bold",
                textTransform: "uppercase"
              }}
            >
              Identity
            </Typography>
        <Grid container spacing={2}>
          {/* Guest ID - select the type */}
          <Grid item xs={12} md={6}>
            <TextField
              name="guestid"
              label="Guest ID"
              value={formData.guestid}
              onChange={handleChange}
              fullWidth
              select
            >
              {[
                "Adhaar",
                "Driving License",
                "Voter ID Card",
                "Passport",
                "Others",
              ].map((idType) => (
                <MenuItem key={idType} value={idType}>
                  {idType}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          {/* Guest ID Number */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Guest ID Number"
              name="guestidno"
              value={formData.guestidno}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          {/* Conditional Passport fields if "Passport" is selected */}
          {formData.guestid === "Passport" && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Passport Issue Date"
                  type="date"
                  name="passportIssueDate"
                  value={formData.passportIssueDate}
                  onChange={handleChange}
                  error={!!errors.passportIssueDate}
                  helperText={errors.passportIssueDate}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Passport Expiry Date"
                  type="date"
                  name="passportExpireDate"
                  value={formData.passportExpireDate}
                  onChange={handleChange}
                  error={!!errors.passportExpireDate}
                  helperText={errors.passportExpireDate}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Visa Number"
                  name="visaNumber"
                  value={formData.visaNumber}
                  onChange={handleChange}
                  error={!!errors.visaNumber}
                  helperText={errors.visaNumber}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Visa Issue Date"
                  type="date"
                  name="visaIssueDate"
                  value={formData.visaIssueDate}
                  onChange={handleChange}
                  error={!!errors.visaIssueDate}
                  helperText={errors.visaIssueDate}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Visa Expiry Date"
                  type="date"
                  name="visaExpireDate"
                  value={formData.visaExpireDate}
                  onChange={handleChange}
                  error={!!errors.visaExpireDate}
                  helperText={errors.visaExpireDate}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  required
                />
              </Grid>
            </>
          )}
        </Grid>
      </div>
                {/* Reservation Accordion */}
                <div className="mb-6">
                <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#0277bd",
                fontWeight: "bold",
                textTransform: "uppercase"
              }}
            >
              Reservation
            </Typography>
                  <Grid container spacing={2} mt={1}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Check-in Date"
                        type="date"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Check-out Date"
                        type="date"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        required
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Check-in Time"
                        type="time"
                        name="expectedArrival"
                        value={formData.expectedArrival}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Check-out Time"
                        type="time"
                        name="expectedDeparture"
                        value={formData.expectedDeparture}
                        onChange={handleChange}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </div>

               {/* Guest Address Section */}
               <div className="mb-6">
               <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#0277bd",
                fontWeight: "bold",
                textTransform: "uppercase"
              }}
            >
              Guest Address
            </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        fullWidth
                        multiline
                      />
                    </Grid>
                  </Grid>
                </div>

                {/* Additional Details Section */}
                <div className="mb-6">
                <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#0277bd",
                fontWeight: "bold",
                textTransform: "uppercase"
              }}
            >
              Additional Details
            </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Meal Plan"
                        name="mealPlan"
                        select
                        fullWidth
                        value={formData.mealPlan}
                        onChange={handleChange}
                      >
                        {["EP", "CP", "AP", "MAP"].map((plan) => (
                          <MenuItem key={plan} value={plan}>
                            {plan}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        label="Remarks"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        fullWidth
                        multiline
                      />
                    </Grid>
                  </Grid>
                </div>

                <div className="flex items-center justify-end">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleCheckAvailability}
                    disabled={!isFormValid}
                    sx={{
                      "&:hover": { backgroundColor: "#3b82f6" },
                      fontWeight: "bold",
                    }}
                  >
                    Check Room Availability
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => router.push("/property/roomdashboard")}
                    sx={{
                      fontWeight: "bold",
                      ml: 4,
                      "&:hover": {
                        backgroundColor: "#e0e0e0",
                      },
                    }}
                  >
                    Back
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>

        {/* Modal for Room Selection */}

        <Dialog
          open={modalOpen}
          onClose={handleCloseModal} // Updated to use new close handler
          className="relative z-50"
        >
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
            onClick={handleCloseModal} // Close on backdrop click
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalAnimation}
              className="bg-white rounded-xl shadow-xl w-[95vw] max-w-[1400px]"
            >
              <DialogTitle className="p-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <div className="flex items-center space-x-2">
                  <Hotel className="w-6 h-6" />
                  <span className="text-2xl font-bold">Select Your Room</span>
                </div>
              </DialogTitle>

              <DialogContent className="p-6">
                {/* Category Filters */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={filterAnimation}
                  className="flex flex-wrap gap-3 mb-6"
                >
                  <Button
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    onClick={() => handleCategoryFilter("all")}
                    className="group transition-all duration-500 ease-in-out hover:shadow-lg"
                  >
                    <Building className="w-4 h-4 mr-2 transition-transform duration-500 ease-in-out group-hover:scale-125" />
                    All Rooms
                  </Button>

                  {categories.map((category) => (
                    <Button
                      key={category._id}
                      variant={
                        selectedCategory === category._id
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleCategoryFilter(category._id)}
                      className="group transition-all duration-500 ease-in-out hover:shadow-lg"
                    >
                      <Tag className="w-4 h-4 mr-2 transition-transform duration-500 ease-in-out group-hover:scale-125" />
                      {category.category}
                    </Button>
                  ))}
                </motion.div>

                {/* Room Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredRooms.map((room, index) => (
                      <motion.div
                        key={room.number}
                        layout
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover="hover"
                        variants={cardAnimation}
                        transition={{ delay: index * 0.05 }}
                        className={`
                        relative rounded-xl overflow-hidden transform-gpu
                        ${selectedRooms.includes(room.number)
                            ? "ring-2 ring-blue-500 shadow-lg"
                            : "ring-1 ring-gray-200"
                          }
                      `}
                      >
                        <motion.div
                          onClick={() => handleRoomSelection(room.number)}
                          className="cursor-pointer p-4 bg-white transition-colors duration-300"
                          whileHover={{
                            backgroundColor: "rgba(249, 250, 251, 1)",
                          }}
                        >
                          <motion.div
                            className="flex justify-between items-start mb-3"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center space-x-2">
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                              >
                                <Bed className="w-5 h-5 text-blue-500" />
                              </motion.div>
                              <span className="text-lg font-semibold">
                                Room {room.number}
                              </span>
                            </div>
                            <motion.div
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              {/* <Checkbox 
                              checked={selectedRooms.includes(room.number)}
                              className="h-5 w-5"
                            /> */}
                            </motion.div>
                          </motion.div>

                          <motion.div
                            className="space-y-2"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            {/* <div className="flex items-center text-gray-600 group">
                            <Building className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
                            <span>{room.category.category}</span>
                          </div> */}
                            <div className="flex items-center text-gray-600 group">
                              <ArrowRight className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                              <span>Floor {room.floor}</span>
                            </div>
                          </motion.div>

                          {selectedRooms.includes(room.number) && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                              className="absolute top-2 right-2"
                            >
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            </motion.div>
                          )}
                        </motion.div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </DialogContent>

              <div className="p-4 bg-gray-50 border-t flex justify-between items-center">
                <motion.div
                  className="flex items-center space-x-2 text-gray-600"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Users className="w-5 h-5" />
                  <span>{selectedRooms.length} rooms selected</span>
                </motion.div>

                <div className="space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCloseModal} // Updated to use new close handler
                    className="transition-all duration-300 ease-in-out hover:bg-gray-100 hover:scale-105"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={selectedRooms.length === 0}
                    onClick={handleSubmit}
                    sx={{ fontWeight: "bold", color: "white" }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600
                           transition-all duration-300 ease-in-out 
                           hover:opacity-90 hover:scale-105 hover:shadow-lg"
                  >
                    Confirm Selection
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
}
