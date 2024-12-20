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

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Input } from '@mui/material';
import { OutlinedInput } from '@mui/material';

export default function BookingForm() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredRooms, setFilteredRooms] = useState([]);

  const [focusedInput, setFocusedInput] = useState(null);
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
  const [rooms, setRooms] = useState([]); // Store available rooms
  const [selectedRooms, setSelectedRooms] = useState([]); // Store selected rooms
  const [modalOpen, setModalOpen] = useState(false); // Modal state

  const router = useRouter();

  useEffect(() => {
    const generateBookingId = () => {
      return "BMX-" + Math.random().toString(36).substring(2, 12).toUpperCase();
    };

    setFormData((prev) => ({ ...prev, bookingId: generateBookingId() }));
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getLabel = (fieldName, defaultLabel) => {
    if (focusedInput === fieldName && placeholders[fieldName]) {
      return placeholders[fieldName];
    }
    return defaultLabel;
  };
  const handleCheckAvailability = async () => {
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
          const hasOverlap = !(checkOutDate <= existingCheckIn || checkInDate >= existingCheckOut);

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
          const currentGuestCheckIn = new Date(currentGuestData.data.checkIn);

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

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-semibold text-cyan-800 mb-4">Booking Master Control Panel</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Booking ID */}
                <TextField
                  label="Booking ID"
                  name="bookingId"
                  value={formData.bookingId}
                  InputProps={{ readOnly: true }}
                  variant="outlined"
                  fullWidth
                  disabled
                />

                {/* Booking Type */}
                <FormControl fullWidth>
                  <InputLabel>Booking Type</InputLabel>
                  <Select
                    name="bookingType"
                    value={formData.bookingType}
                    onChange={handleChange}
                  >
                    {['FIT', 'Group', 'Corporate', 'Corporate Group', 'Office', 'Social Events'].map((type) => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Booking Reference */}
                <TextField
                  label="Booking Reference"
                  name="bookingReference"
                  value={formData.bookingReference}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />

                {/* Reference Number */}
                <TextField
                  label="Reference Number"
                  name="referenceno"
                  value={formData.referenceno}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />

                {/* Booking Status */}
                <FormControl fullWidth>
                  <InputLabel>Booking Status</InputLabel>
                  <Select
                    name="bookingStatus"
                    value={formData.bookingStatus}
                    onChange={handleChange}
                  >
                    {['Confirmed', 'Blocked'].map((status) => (
                      <MenuItem key={status} value={status}>{status}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Guest Name */}
                <TextField
                  label="Guest Name"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleChange}
                  fullWidth
                  required
                />

                {/* Mobile Number */}
                <TextField
                  label="Mobile Number"
                  name="mobileNo"
                  value={formData.mobileNo}
                  onChange={handleChange}
                  fullWidth
                  required
                />

                {/* Mail ID */}
                <TextField
                  label="Email ID"
                  name="guestEmail"
                  value={formData.guestEmail}
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
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />

                {/* Date of Anniversary */}
                <TextField
                  label="Date of Anniversary"
                  type="date"
                  name="dateofanniversary"
                  value={formData.dateofanniversary}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />

                {/* Company Name */}
                <TextField
                  label="Company Name"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  fullWidth
                />

                {/* GSTIN */}
                <TextField
                  label="GSTIN"
                  name="gstin"
                  value={formData.gstin}
                  onChange={handleChange}
                  fullWidth
                />

                {/* Guest ID */}
                <FormControl fullWidth>
                  <InputLabel>Guest ID</InputLabel>
                  <Select
                    name="guestid"
                    value={formData.guestid}
                    onChange={handleChange}
                  >
                    {['adhaar', 'driving license'].map((idType) => (
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
                  fullWidth
                />

                {/* Adults */}
                <TextField
                  label="Adults"
                  type="number"
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  fullWidth
                />

                {/* Children */}
                <TextField
                  label="Children"
                  type="number"
                  name="children"
                  value={formData.children}
                  onChange={handleChange}
                  fullWidth
                />

                {/* Check-in */}
                <TextField
                  label="Check-in"
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />

                {/* Check-out */}
                <TextField
                  label="Check-out"
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />

                {/* Expected Arrival */}
                <TextField
                  label="Expected Arrival"
                  type="date"
                  name="expectedArrival"
                  value={formData.expectedArrival}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />

                {/* Expected Departure */}
                <TextField
                  label="Expected Departure"
                  type="date"
                  name="expectedDeparture"
                  value={formData.expectedDeparture}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />

                {/* State */}
                <TextField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  fullWidth
                />

                {/* Meal Plan */}
                <FormControl fullWidth>
                  <InputLabel>Meal Plan</InputLabel>
                  <Select
                    name="mealPlan"
                    value={formData.mealPlan}
                    onChange={handleChange}
                  >
                    {['EP', 'AP', 'CP', 'MAP'].map((plan) => (
                      <MenuItem key={plan} value={plan}>{plan}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Address */}
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                  multiline
                />

                {/* Remarks */}
                <TextField
                  label="Remarks"
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  fullWidth
                  multiline
                />
              </div>
              <div className="flex items-center justify-end">
                <Button
                  variant="contained"
                  color="primary"

                  onClick={handleCheckAvailability}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#3b82f6', // Blue shade for hover effect
                    },
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