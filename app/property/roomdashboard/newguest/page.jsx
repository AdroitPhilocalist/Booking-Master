'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Calendar, Clock } from 'lucide-react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Card, CardContent, Checkbox, Typography, Box } from '@mui/material';
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
{/* Date of Anniversary */}
            <TextField
  label="Date of Anniversary"
  type="date"
  name="dateofanniversary"
  value={formData.dateofanniversary}
  onChange={handleChange}
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
{/* Check-in */}
<TextField
  label="Check-in"
  type="date"
  name="checkIn"
  value={formData.checkIn}
  onChange={handleChange}
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

{/* Check-out */}
<TextField
  label="Check-out"
  type="date"
  name="checkOut"
  value={formData.checkOut}
  onChange={handleChange}
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
        onClose={() => setModalOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          style: { minWidth: '50vw', padding: '1rem' }, // Modal size
        }}
      >
        <DialogTitle style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
          Select Rooms
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 2,
            }}
          >
            {rooms.map((room) => (
              <Card
                key={room.number}
                variant="outlined"
                sx={{
                  border: selectedRooms.includes(room.number)
                    ? '2px solid #1976d2'
                    : '1px solid #ccc',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
                onClick={() => handleRoomSelection(room.number)}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    Room {room.number}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Category: {room.category.category}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Floor: {room.floor}
                  </Typography>
                  <Checkbox
                    checked={selectedRooms.includes(room.number)}
                    onChange={() => handleRoomSelection(room.number)}
                    color="primary"
                  />
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'space-between', padding: '1rem' }}>
          <Button
            onClick={() => setModalOpen(false)}
            color="secondary"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={selectedRooms.length === 0}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}