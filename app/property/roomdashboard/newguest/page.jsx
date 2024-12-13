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
        pinCode: '',
        mobileNo: '',
        guestName: '',
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
            // Fetch available rooms and populate the category field from the API
            const response = await fetch('/api/rooms');

            if (!response.ok) {
                throw new Error('Failed to fetch rooms');
            }

            const availableRooms = await response.json();

            // Ensure rooms have the populated category data
            if (availableRooms.success && availableRooms.data) {
                setRooms(availableRooms.data);
            } else {
                console.error('No room data available');
            }

            setModalOpen(true); // Open the modal with room data
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
        console.log('Selected rooms:', selectedRooms);

        const roomNumbers = selectedRooms.map((room) => Number(room)); // Ensure roomNumbers is numeric
        const bookingData = { ...formData, roomNumbers: roomNumbers };
        console.log('Booking data to be sent:', bookingData);

        // Submit the booking data
        const bookingResponse = await fetch('/api/NewBooking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookingData),
        });

        if (!bookingResponse.ok) {
            alert('Failed to create booking');
            return;
        }

        // Get the newly created guest's ID
        const bookingResult = await bookingResponse.json();
        const guestId = bookingResult.data._id; // Adjust based on your API response structure

        console.log('New Guest ID:', guestId);

        // Loop through the selected rooms and handle billing and room updates
        for (const room of selectedRooms) {
            console.log(room)
            try {
                // Step 1: Create a new billing record
                const newBilling = {
                    roomNo: room,
                    itemList: ['Room Charge'],
                    priceList: [room.category], // Assuming tariff is part of the room data
                    billStartDate: formData.checkIn,
                    billEndDate: formData.checkOut,
                    totalAmount: 0,
                    amountAdvanced: 0,
                    dueAmount: 0,
                    Bill_Paid: 'no',
                };

                console.log('Submitting billing data:', newBilling);

                const billingResponse = await fetch('/api/Billing', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newBilling),
                });

                if (!billingResponse.ok) {
                    console.error(`Failed to create billing record for room ${room.number}`);
                    continue;
                }

                const billingResult = await billingResponse.json();
                const billId = billingResult.data._id; // Adjust based on your API response structure

                console.log(`Bill ID for room ${room}:`, billId);

                // Step 2: Update room attributes
                const roomUpdate = {
                    currentBillingId: billId,
                    billingStarted: 'Yes',
                    currentGuestId: guestId,
                    occupied: 'Occupied',
                };
                const allRoomsResponse = await fetch('/api/rooms', {
                    method: 'GET', // Assuming this endpoint returns all room data
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!allRoomsResponse.ok) {
                    console.error('Failed to fetch all rooms');
                    return; // Handle the error or exit the function
                }

                const allRoomsData = await allRoomsResponse.json();

                // Filter the room with number = 49
                const targetRoom = allRoomsData.data.find((rooms) => rooms.number === room);

                if (!targetRoom) {
                    console.error(`Room with number ${room} not found`);
                    return; // Handle the case where the room doesn't exist
                }

                const roomId = targetRoom._id; // Extract the room ID
                console.log(`Room ID for room number 49: ${roomId}`);

                const roomUpdateResponse = await fetch(`/api/rooms/${roomId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(roomUpdate),
                });

                if (!roomUpdateResponse.ok) {
                    console.error(`Failed to update room ${room}`);
                    continue;
                }

                console.log(`Room ${room} updated successfully.`);
            } catch (error) {
                console.error(`Error processing room ${room.number}:`, error);
            }
        }

        alert('Booking created successfully!');
        setModalOpen(false);
        router.push('/property/roomdashboard');
    };



    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const response = await fetch('/api/NewBooking', {
    //         method: 'POST',
    //         headers: { 'Content-Type': 'application/json' },
    //         body: JSON.stringify(formData),
    //     });

    //     if (response.ok) {
    //         alert('Booking created successfully!');
    //         router.push('/property/roomdashboard');
    //     } else {
    //         alert('Failed to create booking');
    //     }
    // };

    return (
        <div className="min-h-screen bg-amber-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h1 className="text-2xl font-semibold text-cyan-800 mb-4">Booking Master Control Panel</h1>
                        <div className="mb-4 flex items-center text-sm text-cyan-900">
                            <a href="#" className="hover:underline">Home</a>
                            <span className="mx-2">&gt;</span>
                            <span>Reservations</span>
                        </div>
                        <div className="bg-cyan-800 text-white p-4 rounded-lg mb-6">
                            <h2 className="text-lg font-semibold">Add Booking</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3">

                                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
                                        <InputLabel id="demo-simple-select-standard-label">Booking</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={formData.bookingType}
                                            onChange={handleChange}
                                            label="Booking"
                                        >
                                            {['FIT', 'Group', 'Corporate', 'Corporate Group', 'Office', 'Social Events'].map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>

                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <TextField
                                        label="Booking ID"
                                        name="bookingId"
                                        value={formData.bookingId}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                        fullWidth
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        className="text-cyan-900"
                                        disabled
                                    />

                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">

                                    <TextField id="Booking Point" label="Booking Point" variant="outlined"
                                        type="text"
                                        name="bookingPoint"
                                        value={formData.bookingPoint}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('bookingPoint')}
                                        onBlur={() => setFocusedInput(null)}
                                        required
                                        className="border rounded w-full "
                                        placeholder={focusedInput === 'bookingPoint' ? '' : placeholders.bookingPoint}
                                    />

                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
                                        <InputLabel id="booking-source-label">Booking Source</InputLabel>
                                        <Select
                                            labelId="booking-source-label"
                                            id="booking-source-select"
                                            value={formData.bookingSource}
                                            onChange={handleChange}
                                            label="Booking Source"
                                        >
                                            {[
                                                'Walk In', 'Front Office', 'Agent', 'Office', 'Goibibo', 'Make My Trip',
                                                'Agoda.com', 'Booking.com', 'Cleartrip', 'Yatra', 'Expedia', 'Trivago',
                                                'Ease My Trip', 'Hotels.com', 'Happy Easy Go', 'TBO', 'Booking Engine',
                                                'GO-MMT', 'Booking Master', 'Hoichoi', 'Others'
                                            ].map((source) => (
                                                <MenuItem key={source} value={source}>
                                                    {source}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">


                                    <TextField id="Mobile Number" label="Mobile Number" variant="outlined"
                                        type="text"
                                        name="mobileNo"
                                        value={formData.mobileNo}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('mobileNo')}
                                        onBlur={() => setFocusedInput(null)}
                                        className="border rounded w-full "
                                        placeholder={focusedInput === 'mobileNo' ? '' : placeholders.mobileNo}
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <TextField id="Pincode" label="Pincode" variant="outlined"
                                        type="text"
                                        name="pinCode"
                                        value={formData.pinCode}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('pinCode')}
                                        onBlur={() => setFocusedInput(null)}
                                        className="border rounded w-full "
                                        placeholder={focusedInput === 'pinCode' ? '' : placeholders.pinCode}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3">
                                    <TextField id="Guest Name" label="Guest Name" variant="outlined"
                                        type="text"
                                        name="guestName"
                                        value={formData.guestName}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('guestName')}
                                        onBlur={() => setFocusedInput(null)}
                                        className="border rounded w-full "
                                        placeholder={focusedInput === 'guestName' ? '' : placeholders.guestName}
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <TextField id="Company Name" label="Company Name" variant="outlined"
                                        type="text"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('companyName')}
                                        onBlur={() => setFocusedInput(null)}
                                        className="border rounded w-full"
                                        placeholder={focusedInput === 'companyName' ? '' : placeholders.companyName}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3">
                                    <TextField id="GSTIN" label="GSTIN" variant="outlined"
                                        type="text"
                                        name="gstin"
                                        value={formData.gstin}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('gstin')}
                                        onBlur={() => setFocusedInput(null)}
                                        className="border rounded w-full "
                                        placeholder={focusedInput === 'gstin' ? '' : placeholders.gstin}
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">


                                    <TextField id="Guest Email" label="Guest Email" variant="outlined"
                                        type="email"
                                        name="guestEmail"
                                        value={formData.guestEmail}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('guestEmail')}
                                        onBlur={() => setFocusedInput(null)}
                                        required
                                        className="border rounded w-full "
                                        placeholder={focusedInput === 'guestEmail' ? '' : placeholders.guestEmail}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3">
                                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} fullWidth>
                                        <InputLabel htmlFor="adults-input">Adults</InputLabel>
                                        <Input
                                            id="adults-input"
                                            type="number"
                                            name="adults"
                                            value={formData.adults}
                                            onChange={handleChange}
                                            inputProps={{ min: 1 }}
                                        />
                                    </FormControl>

                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <FormControl fullWidth variant="outlined" sx={{ m: 1, minWidth: 120 }}>
                                        <InputLabel htmlFor="children-input">Children</InputLabel>
                                        <Input
                                            id="children-input"
                                            type="number"
                                            name="children"
                                            value={formData.children}
                                            onChange={handleChange}
                                            inputProps={{ min: 0 }}
                                            label="Children"
                                        />
                                    </FormControl>

                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                        <InputLabel shrink htmlFor="check-in-input">
                                            Check-In*
                                        </InputLabel>
                                        <Input
                                            id="check-in-input"
                                            type="date"
                                            name="checkIn"
                                            value={formData.checkIn}
                                            onChange={handleChange}
                                            required
                                            label="Check-In*"
                                        />
                                    </FormControl>

                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                        <InputLabel shrink htmlFor="check-out-input">
                                            Check-Out*
                                        </InputLabel>
                                        <Input
                                            id="check-out-input"
                                            type="date"
                                            name="checkOut"
                                            value={formData.checkOut}
                                            onChange={handleChange}
                                            required
                                            label="Check-Out*"
                                        />
                                    </FormControl>

                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                        <InputLabel shrink htmlFor="expected-arrival-input">
                                            Expected Arrival*
                                        </InputLabel>
                                        <Input
                                            id="expected-arrival-input"
                                            type="time"
                                            name="expectedArrival"
                                            value={formData.expectedArrival}
                                            onChange={handleChange}
                                            required
                                            label="Expected Arrival*"
                                        />
                                    </FormControl>

                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                        <InputLabel shrink htmlFor="expected-departure-input">
                                            Expected Departure*
                                        </InputLabel>
                                        <Input
                                            id="expected-departure-input"
                                            type="time"
                                            name="expectedDeparture"
                                            value={formData.expectedDeparture}
                                            onChange={handleChange}
                                            required
                                            label="Expected Departure*"
                                        />
                                    </FormControl>

                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">


                                    <TextField id="Address" label="Address" variant="outlined"
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('address')}
                                        onBlur={() => setFocusedInput(null)}
                                        required
                                        className="border rounded w-full "
                                        placeholder={focusedInput === 'address' ? '' : placeholders.address}
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <FormControl fullWidth variant="standard" sx={{ mb: 2 }}>
                                        <InputLabel htmlFor="booking-status-select">Booking Status*</InputLabel>
                                        <Select
                                            id="booking-status-select"
                                            name="bookingStatus"
                                            value={formData.bookingStatus}
                                            onChange={handleChange}
                                            required
                                            label="Booking Status*"
                                        >
                                            {['Confirmed', 'Blocked'].map((status) => (
                                                <MenuItem key={status} value={status}>
                                                    {status}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">


                                    <TextField id="State" label="State" variant="outlined"
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('state')}
                                        onBlur={() => setFocusedInput(null)}

                                        className="border rounded w-full "
                                        placeholder={focusedInput === 'state' ? '' : placeholders.state}
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <FormControl fullWidth variant="standard" sx={{ mb: 2 }}>
                                        <InputLabel htmlFor="meal-plan-select">Meal Plan</InputLabel>
                                        <Select
                                            id="meal-plan-select"
                                            name="mealPlan"
                                            value={formData.mealPlan}
                                            onChange={handleChange}
                                            required
                                            label="Meal Plan"
                                        >
                                            {['EP', 'AP', 'CP', 'MAP'].map((meal) => (
                                                <MenuItem key={meal} value={meal}>
                                                    {meal}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3">


                                    <TextField id="Booking Reference" label="Booking Reference" variant="outlined"
                                        type="text"
                                        name="bookingReference"
                                        value={formData.bookingReference}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('bookingReference')}
                                        onBlur={() => setFocusedInput(null)}

                                        className="border rounded w-full "
                                        placeholder={focusedInput === 'bookingReference' ? '' : placeholders.bookingReference}
                                    />
                                </div>
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-cyan-900 text-xs font-bold mb-2" htmlFor="mobile-no">
                                        Stop Posting
                                    </label>
                                    <input type="checkbox" name="stopPosting" checked={formData.stopPosting} onChange={(e) => setFormData((prev) => ({ ...prev, stopPosting: e.target.checked }))} />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3">
                                    <FormControl fullWidth variant="standard" sx={{ mb: 2 }}>
                                        <InputLabel htmlFor="guest-type-select">Guest Type</InputLabel>
                                        <Select
                                            id="guest-type-select"
                                            name="guestType"
                                            value={formData.guestType}
                                            onChange={handleChange}
                                            required
                                            label="Guest Type"
                                        >
                                            {['General', 'VIP Guest', 'VVIP Guest', 'Scanty baggage'].map((type) => (
                                                <MenuItem key={type} value={type}>
                                                    {type}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                </div>
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">


                                    <TextField id="Guest Notes" label="Guest Notes" variant="outlined"
                                        type="text"
                                        name="guestNotes"
                                        value={formData.guestNotes}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('guestNotes')}
                                        onBlur={() => setFocusedInput(null)}

                                        className="border rounded w-full "
                                        placeholder={focusedInput === 'guestNotes' ? '' : placeholders.guestNotes}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full px-3">


                                    <TextField id="Internal Notes" label="Internal notes" variant="outlined"

                                        name="internalNotes"
                                        value={formData.internalNotes}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('internalNotes')}
                                        onBlur={() => setFocusedInput(null)}

                                        className="border rounded w-full p-2"
                                        placeholder={focusedInput === 'internalNotes' ? '' : placeholders.internalNotes}>
                                    </TextField>

                                    <TextField id="Remarks" label="Remarks" variant="outlined"

                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedInput('remarks')}
                                        onBlur={() => setFocusedInput(null)}

                                        className="border rounded w-full p-2"
                                        placeholder={focusedInput === 'remarks' ? '' : placeholders.remarks}>

                                    </TextField>

                                </div>
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
                                        Category: {room.category.name}
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