'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bed, Users, Calendar, Clock, Building, Tag,
  ArrowRight, CheckCircle, Home, Hotel, Coffee
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Card, CardContent, Checkbox, Typography, Box, Chip } from '@mui/material';
import Navbar from "@/app/_components/Navbar";
import { Footer } from "@/app/_components/Footer";
import TextField from '@mui/material/TextField';
import { Grid } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Autocomplete } from '@mui/material';
import { Input } from '@mui/material';
import { OutlinedInput } from '@mui/material';

export default function BookingForm() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [mobileNumbers, setMobileNumbers] = useState([]); // For storing all mobile numbers
  const [filteredMobileNumbers, setFilteredMobileNumbers] = useState([]); // For filtered mobile numbers
  const [focusedInput, setFocusedInput] = useState(null);
  // Add form validation state
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [formData, setFormData] = useState({
    bookingType: 'FIT',
    bookingId: '',
    bookingSource: 'Walk In',
    bookingPoint: '',

    dateofbirth: '',
    dateofanniversary: '',
    pinCode: '',
    mobileNo: '',
    guestName: '',
    guestid: '',
    guestidno: '',
    companyName: '',
    gstin: '',
    guestEmail: '',
    adults: 1,
    children: 0,
    checkIn: '',
    checkOut: '',
    expectedArrival: '',
    expectedDeparture: '',
    bookingStatus: 'Confirmed',
    address: '',
    remarks: '',
    state: '',
    mealPlan: 'EP',
    bookingReference: '',
    stopPosting: false,
    guestType: 'General',
    guestNotes: '',
    internalNotes: '',
  });

  const placeholders = {
    bookingPoint: 'Enter Booking Point',
    pinCode: 'Enter Pin Code',
    mobileNo: 'Enter Mobile Number',
    guestName: 'Enter Guest Name',
    companyName: 'Enter Company Name',
    dateofbirth: 'Enter date of birth',
    dateofanniversary: 'Enter date of anniversary',
    gstin: 'Enter GSTIN',
    guestEmail: 'Enter Guest Email',
    address: 'Enter Guest Address',
    state: 'Enter Guest State',
    bookingReference: 'Enter Booking Reference',
    guestNotes: 'Enter Guest Notes',
    internalNotes: 'Enter Internal Notes',
    remarks: 'Enter Remarks'
  };

  // Validation rules
  const validateForm = () => {
    const newErrors = {};

    const requiredFields = [
      'guestName',
      'guestEmail',
      'companyName',
      'gstin',
      'address',
      'remarks',
      'bookingReference',
      'expectedArrival',
      'expectedDeparture',
      'mobileNo',
      'guestid',
      'guestidno',
      'referenceno',
      'state',
      'checkIn',
      'checkOut',
      'dateofbirth',
      'dateofanniversary'
    ];

    // Required fields validation
    // if (!formData.guestName) newErrors.guestName = 'Guest name is required';
    // if (!formData.guestEmail) newErrors.guestEmail = 'Guest email is required';
    // if (!formData.companyName) newErrors.companyName = 'Company name is required';
    // if (!formData.gstin) newErrors.gstin = 'GSTIN is required';
    // if (!formData.address) newErrors.address = 'Address is required';
    // if (!formData.remarks) newErrors.remarks = 'Remarks is required';
    // if (!formData.bookingReference) newErrors.bookingReference = 'Booking Reference is required';
    // if (!formData.expectedArrival) newErrors.expectedArrival = 'Expected Arrival is required';
    // if (!formData.expectedDeparture) newErrors.expectedDeparture = 'Expected Departure is required';
    // if (!formData.mobileNo) newErrors.mobileNo = 'Mobile number is required';
    // if (!formData.guestid) newErrors.guestid = 'Guest ID type is required';
    // if (!formData.guestidno) newErrors.guestidno = 'Guest ID number is required';
    // if (!formData.referenceno) newErrors.referenceno = 'Reference number is required';
    // if (!formData.state) newErrors.state = 'State is required';
    // if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
    // if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';
    // if (!formData.dateofbirth) newErrors.dateofbirth = 'Date of birth is required';
    // if (!formData.dateofanniversary) newErrors.dateofanniversary = 'Date of anniversary is required';
    // Check if any required field is empty
    const hasEmptyFields = requiredFields.some(field => !formData[field]);
    // Date validations
    let dateErrors = false;
    const currentDate = new Date();
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);

    if (checkInDate < currentDate) {
      newErrors.checkIn = 'Check-in date cannot be in the past';
      dateErrors = true;
    }

    if (checkOutDate <= checkInDate) {
      newErrors.checkOut = 'Check-out date must be after check-in date';
      dateErrors = true;
    }

    // Mobile number format validation (10 digits)
    let mobileError = false;
    if (formData.mobileNo && !/^\d{10}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = 'Mobile number must be 10 digits';
      mobileError = true;
    }

    // Email format validation
    let emailError = false;
    if (formData.guestEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.guestEmail)) {
      newErrors.guestEmail = 'Invalid email format';
      emailError = true;
    }

    // GSTIN format validation (if provided)
    let gstinError = false;
    if (formData.gstin && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/.test(formData.gstin)) {
      newErrors.gstin = 'Invalid GSTIN format';
      gstinError = true;
    }

    // Reference number validation
    let referenceError = false;
    if (formData.referenceno && (isNaN(formData.referenceno) || formData.referenceno < 0)) {
      newErrors.referenceno = 'Reference number must be a positive number';
      referenceError = true;
    }

    // Adults validation
    let adultsError = false;
    if (formData.adults < 1) {
      newErrors.adults = 'At least 1 adult is required';
      adultsError = true;
    }

    // Children validation
    let childrenError = false;
    if (formData.children < 0) {
      newErrors.children = 'Number of children cannot be negative';
      childrenError = true;
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
    const isValid = !hasEmptyFields &&
      !dateErrors &&
      !mobileError &&
      !emailError &&
      !gstinError &&
      !adultsError &&
      !childrenError;

    setIsFormValid(isValid);
    return isValid && Object.keys(newErrors).length === 0;
    return Object.keys(newErrors).length === 0;

  };

  const [rooms, setRooms] = useState([]); // Store available rooms
  const [selectedRooms, setSelectedRooms] = useState([]); // Store selected rooms
  const [modalOpen, setModalOpen] = useState(false); // Modal state

  const router = useRouter();

  useEffect(() => {
    const generateBookingId = () => {
      return "SOLV-" + Math.random().toString(36).substring(2, 12).toUpperCase();
    };

    setFormData((prev) => ({ ...prev, bookingId: generateBookingId() }));
  }, []);

  // Function to format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Return empty string if invalid date
    return date.toISOString().split('T')[0];
  };

  // Add this useEffect to fetch all mobile numbers when component mounts
  useEffect(() => {
    const fetchMobileNumbers = async () => {
      try {
        const response = await fetch('/api/NewBooking');
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const result = await response.json();
        if (result.success && result.data) {
          // Extract unique mobile numbers
          const uniqueMobileNumbers = [...new Set(result.data.map(booking => booking.mobileNo))];
          setMobileNumbers(uniqueMobileNumbers);
        }
      } catch (error) {
        console.error('Error fetching mobile numbers:', error);
      }
    };

    fetchMobileNumbers();
  }, []);


  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/roomCategories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const result = await response.json();
      if (result.success && result.data) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter(room => room.category._id === selectedCategory);
      setFilteredRooms(filtered);
    }
  }, [selectedCategory, rooms]);

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Update handleChange to include validation
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error for the changed field
    setErrors(prev => ({
      ...prev,
      [name]: undefined
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
      alert('Please fill in all required fields correctly before checking room availability');
      return;
    }
    try {
      if (!formData.checkIn || !formData.checkOut) {
        alert('Please select both Check-in and Check-out dates first');
        return;
      }

      const response = await fetch('/api/rooms');
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      const result = await response.json();
      if (!result.success || !result.data) {
        throw new Error('No room data available');
      }

      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);

      // Filter available rooms based on check-in and check-out date lists
      const availableRooms = result.data.filter(room => {
        // If no existing bookings, room is available
        if (!room.checkInDateList || !room.checkOutDateList ||
          room.checkInDateList.length === 0 || room.checkOutDateList.length === 0) {
          return true;
        }

        // Check each booking period for conflicts
        for (let i = 0; i < room.checkInDateList.length; i++) {
          const existingCheckIn = new Date(room.checkInDateList[i]);
          const existingCheckOut = new Date(room.checkOutDateList[i]);

          // Check for overlap
          const hasOverlap = !(checkOutDate < existingCheckIn || checkInDate >= existingCheckOut);

          if (hasOverlap) {
            return false; // Room is not available if there's any overlap
          }
        }
        return true; // Room is available if no overlaps found
      });

      setRooms(availableRooms);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching room data:', error.message);
      alert('Error fetching room data');
    }
  };


  const handleRoomSelection = (roomId) => {
    setSelectedRooms((prevSelectedRooms) => {
      const newSelectedRooms = prevSelectedRooms.includes(roomId)
        ? prevSelectedRooms.filter((room) => room !== roomId)
        : [...prevSelectedRooms, roomId];

      console.log('Updated selectedRooms:', newSelectedRooms); // Debugging selection

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
      const roomNumbers = selectedRooms.map((room) => Number(room));
      const bookingData = { ...formData, roomNumbers: roomNumbers };

      // Create booking
      const bookingResponse = await fetch('/api/NewBooking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (!bookingResponse.ok) {
        throw new Error('Failed to create booking');
      }

      const bookingResult = await bookingResponse.json();
      const guestId = bookingResult.data._id;

      // Fetch necessary data
      const [roomsResponse, categoriesResponse] = await Promise.all([
        fetch('/api/rooms'),
        fetch('/api/roomCategories')
      ]);

      const roomsData = await roomsResponse.json();
      const categoriesData = await categoriesResponse.json();

      if (!roomsData.success || !categoriesData.success) {
        throw new Error('Failed to fetch room or category data');
      }

      const rooms = roomsData.data;
      const categories = categoriesData.data;

      // Process each selected room
      for (const selectedRoomNumber of selectedRooms) {
        const matchedRoom = rooms.find(room => room.number === selectedRoomNumber);
        if (!matchedRoom) {
          console.error(`Room ${selectedRoomNumber} not found`);
          continue;
        }

        const matchedCategory = categories.find(
          category => category._id === matchedRoom.category._id
        );
        if (!matchedCategory) {
          console.error(`Category for room ${selectedRoomNumber} not found`);
          continue;
        }

        // Calculate billing details
        const checkInDate = new Date(formData.checkIn);
        const checkOutDate = new Date(formData.checkOut);
        const numberOfNights = Math.ceil(
          (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
        );
        const roomCharge = matchedCategory.total * numberOfNights;
        const roomTax = matchedCategory.gst;

        // Create billing record
        const billingResponse = await fetch('/api/Billing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            roomNo: selectedRoomNumber,
            itemList: ['Room Charge'],
            priceList: [roomCharge],
            taxList: [roomTax],
            quantityList: [1],
            billStartDate: checkInDate,
            billEndDate: checkOutDate,
            totalAmount: roomCharge,
            amountAdvanced: 0,
            dueAmount: roomCharge,
            Bill_Paid: 'no'
          })
        });

        const billingData = await billingResponse.json();
        if (!billingData.success) {
          throw new Error(`Failed to create billing for room ${selectedRoomNumber}`);
        }

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
          console.log('matchedRoom.currentGuestId:', matchedRoom.currentGuestId);
          const currentGuestResponse = await fetch(`/api/NewBooking/${matchedRoom.currentGuestId}`);
          const currentGuestData = await currentGuestResponse.json();
          console.log('currentGuestData:', currentGuestData.data);
          const currentGuestCheckIn = new Date(currentGuestData.checkIn);

          // Fetch first waitlisted guest's booking details
          const firstWaitlistedGuestResponse = await fetch(`/api/NewBooking/${sortedGuestWaitlist[0]}`);
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

        // Update room with new data
        const roomUpdateResponse = await fetch(`/api/rooms/${matchedRoom._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(roomUpdate)
        });

        if (!roomUpdateResponse.ok) {
          throw new Error(`Failed to update room ${selectedRoomNumber}`);
        }
      }

      alert('Booking created successfully!');
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
        ease: [0.4, 0, 0.2, 1]
      }
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const cardAnimation = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  const filterAnimation = {
    hidden: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  // Function to handle modal close
  const handleCloseModal = () => {
    setSelectedRooms([]); // Reset selected rooms
    setSelectedCategory('all'); // Reset category filter
    setModalOpen(false); // Close the modal
  };

  // Update handleMobileNumberChange to include validation
  const handleMobileNumberChange = async (event, newValue) => {
    const inputValue = newValue || event.target.value;

    setFormData(prev => ({
      ...prev,
      mobileNo: inputValue
    }));

    // Clear mobile number error
    setErrors(prev => ({
      ...prev,
      mobileNo: undefined
    }));

    if (newValue && mobileNumbers.includes(newValue)) {
      try {
        const response = await fetch('/api/NewBooking');
        if (!response.ok) throw new Error('Failed to fetch bookings');
        const result = await response.json();
        if (result.success && result.data) {
          const guestBooking = result.data.find(booking => booking.mobileNo === newValue);
          if (guestBooking) {
            setFormData(prev => ({
              ...prev,
              guestName: guestBooking.guestName || '',
              dateofbirth: formatDate(guestBooking.dateofbirth) || '',
              dateofanniversary: formatDate(guestBooking.dateofanniversary) || '',
              guestEmail: guestBooking.guestEmail || '',
              guestid: guestBooking.guestid || '',
              guestidno: guestBooking.guestidno || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching guest details:', error);
      }
    }

    if (inputValue) {
      const filtered = mobileNumbers.filter(number => number.startsWith(inputValue));
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
      onInputChange={(event, newValue) => handleMobileNumberChange(event, newValue)}
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
        options.filter(option =>
          option.startsWith(inputValue)
        )
      }
    />
  );


  // Add useEffect for continuous form validation
  useEffect(() => {
    validateForm();
  }, [formData]);

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-semibold text-cyan-800 mb-4">Guest Reservation Form</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Booking ID */}
                <TextField
                  label="Booking ID"
                  name="bookingId"
                  value={formData.bookingId}
                  InputProps={{ readOnly: true }}
                  error={!!errors.bookingId}
                  helperText={errors.bookingId}
                  variant="outlined"
                  fullWidth
                  disabled
                />

                {/* Booking Type */}
                <Grid item xs={12}>
                  <TextField
                    label="Booking Type"
                    name="bookingType"
                    value={formData.bookingType}
                    onChange={handleChange}
                    error={!!errors.bookingType}
                    helperText={errors.bookingType}
                    fullWidth
                    select
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300, // Adjust the maximum height for the dropdown
                          overflowY: 'auto', // Add scroll if needed
                        },
                      },
                    }}
                  >
                    {['FIT', 'Group', 'Corporate', 'Corporate Group', 'Social Events', 'Others'].map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>



                {/* Booking Reference */}
                <TextField
                  label="Booking Reference"
                  name="bookingReference"
                  value={formData.bookingReference}
                  onChange={handleChange}
                  error={!!errors.bookingReference}
                  helperText={errors.bookingReference}
                  fullWidth
                  variant="outlined"
                />

                {/* Reference Number */}
                <TextField
                  label="Reference Number"
                  name="referenceno"
                  value={formData.referenceno}
                  onChange={handleChange}
                  error={!!errors.referenceno}
                  helperText={errors.referenceno}
                  fullWidth
                  variant="outlined"
                />

                {/* Booking Status */}
                <Grid item xs={12}>
                  <TextField
                    label="Booking Status"
                    name="bookingStatus"
                    select
                    fullWidth
                    value={formData.bookingStatus}
                    onChange={handleChange}
                    error={!!errors.bookingStatus}
                    helperText={errors.bookingStatus}
                  >
                    {['Confirmed', 'Blocked'].map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}required
                  </TextField>

                </Grid>

                {/* Guest Name */}
                <TextField
                  label="Guest Name"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleChange}
                  error={!!errors.guestName}
                  helperText={errors.guestName}
                  fullWidth
                  required
                />

                {/* Mobile Number */}
                {/* <TextField
                  label="Mobile Number"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  fullWidth
                  required
                /> */}
                <Autocomplete
                  freeSolo
                  options={filteredMobileNumbers}
                  value={formData.mobileNo}
                  onChange={(event, newValue) => handleMobileNumberChange(event, newValue)}
                  onInputChange={(event, newValue) => handleMobileNumberChange(event, newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Mobile Number"
                      required
                      fullWidth
                      error={!!errors.mobileNo}
                      helperText={errors.mobileNo}
                    />
                  )}
                />

                {/* Mail ID */}
                <TextField
                  label="Email ID"
                  name="guestEmail"
                  value={formData.guestEmail}
                  error={!!errors.guestEmail}
                  helperText={errors.guestEmail}
                  onChange={handleChange}
                  fullWidth
                />

                {/* Date of Birth */}
                <TextField
                  label="Date of Birth"
                  type="date"
                  name="dateofbirth"
                  value={formData.dateofbirth}
                  onChange={handleChange}
                  error={!!errors.dateofbirth}
                  helperText={errors.dateofbirth}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />

                {/* Date of Anniversary */}
                {/* Date of Anniversary */}
                <TextField
                  label="Date of Anniversary"
                  type="date"
                  name="dateofanniversary"
                  value={formData.dateofanniversary}
                  onChange={handleChange}
                  error={!!errors.dateofanniversary}
                  helperText={errors.dateofanniversary}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#A020F0', // Blue-purple color
                      },
                      '&:hover fieldset': {
                        borderColor: '#A020F0', // Blue-purple color
                      }
                    }
                  }}
                />

                {/* Company Name */}
                <TextField
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  error={!!errors.companyName}
                  helperText={errors.companyName}
                  fullWidth
                />

                {/* GSTIN */}
                <TextField
                  label="GSTIN"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  error={!!errors.gstin}
                  helperText={errors.gstin}
                  fullWidth
                />

                {/* Guest ID */}
                <FormControl fullWidth>
                  <InputLabel>Guest ID</InputLabel>
                  <Select
                    name="guestid"
                    value={formData.guestid}
                    onChange={handleChange}
                    error={!!errors.guestid}
                    helperText={errors.guestid}
                  >
                    {['adhaar', 'driving license', 'voter id card', 'passport', 'others'].map((idType) => (
                      <MenuItem key={idType} value={idType}>{idType}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Guest ID Number */}
                <TextField
                  label="Guest ID Number"
                  name="guestidno"
                  value={formData.guestidno}
                  onChange={handleChange}
                  error={!!errors.guestidno}
                  helperText={errors.guestidno}
                  fullWidth
                />

                {/* Adults */}
                <TextField
                  label="Adults"
                  type="number"
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  error={!!errors.adults}
                  helperText={errors.adults}
                  fullWidth
                />

                {/* Children */}
                <TextField
                  label="Children"
                  type="number"
                  name="children"
                  value={formData.children}
                  onChange={handleChange}
                  error={!!errors.children}
                  helperText={errors.children}
                  fullWidth
                />

                {/* Check-in */}
                {/* Check-in */}
                <TextField
                  label="Check-in Date"
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  error={!!errors.checkIn}
                  helperText={errors.checkIn}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#f97316', // Orange color
                      },
                      '&:hover fieldset': {
                        borderColor: '#f97316', // Orange color
                      }
                    }
                  }}
                  required
                />

                {/* Check-out */}
                <TextField
                  label="Check-out Date"
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  error={!!errors.checkOut}
                  helperText={errors.checkOut}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#f97316', // Orange color
                      },
                      '&:hover fieldset': {
                        borderColor: '#f97316', // Orange color
                      }
                    }
                  }}
                  required
                />

                {/* Expected Arrival */}
                <TextField
                  label="Check-in Time"
                  type="time"
                  name="expectedArrival"
                  value={formData.expectedArrival}
                  onChange={handleChange}
                  error={!!errors.expectedArrival}
                  helperText={errors.expectedArrival}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#f97316', // Orange color
                      },
                      '&:hover fieldset': {
                        borderColor: '#f97316', // Orange color
                      }
                    }
                  }}
                />

                {/* Expected Departure */}
                <TextField
                  label="Check-out Time"
                  type="time"
                  name="expectedDeparture"
                  value={formData.expectedDeparture}
                  onChange={handleChange}
                  error={!!errors.expectedDeparture}
                  helperText={errors.expectedDeparture}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#f97316', // Orange color
                      },
                      '&:hover fieldset': {
                        borderColor: '#f97316', // Orange color
                      }
                    }
                  }}
                />

                {/* State */}
                <TextField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={!!errors.state}
                  helperText={errors.state}
                  fullWidth
                />

                {/* Meal Plan */}
                <Grid item xs={12}>
                  <TextField
                    label="Meal Plan"
                    name="mealPlan"
                    select
                    fullWidth
                    value={formData.mealPlan}
                    onChange={handleChange}
                    error={!!errors.mealPlan}
                    helperText={errors.mealPlan}
                  >
                    {['EP', 'CP', 'AP', 'MAP'].map((plan) => (
                      <MenuItem key={plan} value={plan}>{plan}</MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Address */}
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  error={!!errors.address}
                  helperText={errors.address}
                  fullWidth
                  multiline
                />

                {/* Remarks */}
                <TextField
                  label="Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  error={!!errors.remarks}
                  helperText={errors.remarks}
                  fullWidth
                  multiline
                />
              </div>
              <div className="flex items-center justify-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCheckAvailability}
                  disabled={!isFormValid}
                  sx={{
                    '&:hover': { backgroundColor: '#3b82f6' },
                    fontWeight: 'bold',
                  }}
                >
                  Check Room Availability
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => router.push('/property/roomdashboard')}
                  sx={{
                    fontWeight: 'bold',
                    ml: 4, // Margin-left for spacing
                    '&:hover': {
                      backgroundColor: '#e0e0e0', // Light gray shade for hover effect
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
      <Footer />
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
                  variant={selectedCategory === 'all' ? 'default' : 'outline'}
                  onClick={() => handleCategoryFilter('all')}
                  className="group transition-all duration-500 ease-in-out hover:shadow-lg"
                >
                  <Building className="w-4 h-4 mr-2 transition-transform duration-500 ease-in-out group-hover:scale-125" />
                  All Rooms
                </Button>

                {categories.map((category) => (
                  <Button
                    key={category._id}
                    variant={selectedCategory === category._id ? 'default' : 'outline'}
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
                          ? 'ring-2 ring-blue-500 shadow-lg'
                          : 'ring-1 ring-gray-200'}
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
                              damping: 30
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
                  sx={{ fontWeight: 'bold', color: 'white' }}
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
  )
}