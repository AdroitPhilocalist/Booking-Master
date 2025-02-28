'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Button, TextField } from '@mui/material';
import { IconButton, Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import { getCookie } from 'cookies-next'; // Import getCookie from cookies-next
import { jwtVerify } from 'jose'; // Import jwtVerify for decoding JWT
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

export default function GuestList() {
    const [guests, setGuests] = useState([]);
    const [error, setError] = useState(null);
    const [deleteGuestId, setDeleteGuestId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editGuest, setEditGuest] = useState(null);
    // New state for room pricing data
    const [roomCategories, setRoomCategories] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

    // Fetch room categories on component mount
    useEffect(() => {
        const fetchRoomCategories = async () => {
            try {
                const response = await fetch('/api/roomCategories');
                const data = await response.json();
                if (data.success) {
                    // Create a map of category ID to price
                    const categoryPrices = {};
                    data.data.forEach(category => {
                        categoryPrices[category._id] = category.total;
                    });
                    setRoomCategories(categoryPrices);
                }
            } catch (error) {
                console.error('Error fetching room categories:', error);
            }
        };
        fetchRoomCategories();
    }, []);

    // Modified useEffect for fetching guests
    useEffect(() => {
        const fetchGuests = async () => {
            try {
                setIsLoading(true);
                const token = getCookie('authToken');
                const usertoken = getCookie("userAuthToken");
                if (!token && !usertoken) {
                    router.push("/"); // Redirect to login if no token is found
                    return;
                }

                let decoded, userId;
                if (token) {
                    // Verify the authToken (legacy check)
                    decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
                    userId = decoded.payload.id;
                }
                if (usertoken) {
                    // Verify the userAuthToken
                    decoded = await jwtVerify(usertoken, new TextEncoder().encode(SECRET_KEY));
                    userId = decoded.payload.profileId; // Use userId from the new token structure
                }

                const profileResponse = await fetch(`/api/Profile/${userId}`);
                const profileData = await profileResponse.json();
                if (!profileData.success || !profileData.data) {
                    router.push('/');
                    return;
                }
                const username = profileData.data.username;

                // Fetch guest data
                const response = await fetch(`/api/NewBooking?username=${username}`);
                const data = await response.json();

                if (data.success) {
                    // Fetch all billing data
                    const billingResponse = await fetch('/api/Billing');
                    const billingData = await billingResponse.json();

                    const guestMap = new Map();
                    const sortedGuests = [...data.data].sort((a, b) => {
                        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                    });

                    sortedGuests.forEach(guest => {
                        if (!guestMap.has(guest.mobileNo)) {
                            // Check if the guest is checked out or has a cancelled bill
                            const isCancelled = billingData.success && billingData.data.some(bill => {
                                const billRoomSet = new Set(bill.roomNo);
                                const hasMatchingRoom = guest.roomNumbers.some(roomNum =>
                                    billRoomSet.has(roomNum.toString())
                                );
                                return hasMatchingRoom && bill.Cancelled === 'yes';
                            });
                            console.log('Guest:', guest.CheckedOut);
                            // Add a flag to indicate if edit/delete should be disabled
                            guest.disableActions = guest.CheckedOut === true || isCancelled;
                            guestMap.set(guest.mobileNo, guest);
                        }
                    });

                    setGuests(Array.from(guestMap.values()));
                } else {
                    setError('Failed to load guest data');
                }
            } catch (err) {
                setError('Error fetching guests');
            } finally {
                setIsLoading(false);
            }
        };
        fetchGuests();
    }, []);

    // Handle delete button click
    const handleDeleteClick = (id) => {
        setDeleteGuestId(id);
        setOpenDeleteDialog(true);
    };

    // Function to calculate nights between dates
    const calculateNights = (checkIn, checkOut) => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    // Function to calculate new room price
    const calculateRoomPrice = async (roomNumbers, checkIn, checkOut) => {
        try {
            // Get room details for each room number
            const roomPromises = roomNumbers.map(async (roomNum) => {
                const response = await fetch(`/api/rooms?number=${roomNum}`);
                const data = await response.json();
                if (data.success && data.data.length > 0) {
                    const room = data.data[0];
                    return roomCategories[room.category._id] || 0;
                }
                return 0;
            });

            const roomPrices = await Promise.all(roomPromises);
            const totalRoomPrice = roomPrices.reduce((sum, price) => sum + price, 0);
            const nights = calculateNights(checkIn, checkOut);

            return totalRoomPrice * nights;
        } catch (error) {
            console.error('Error calculating room price:', error);
            return 0;
        }
    };

    // Modified handleConfirmDelete function
    const handleConfirmDelete = async () => {
        try {
            setIsLoading(true);
            const token = getCookie('authToken');
            const usertoken = getCookie("userAuthToken");
            if (!token && !usertoken) {
                router.push("/"); // Redirect to login if no token is found
                return;
            }

            // Find the guest to be deleted
            const guestToDelete = guests.find(guest => guest._id === deleteGuestId);
            if (!guestToDelete) {
                throw new Error('Guest not found');
            }

            // Get billing records for this guest's rooms
            const billingResponse = await fetch('/api/Billing');
            const billingData = await billingResponse.json();

            if (!billingData.success) {
                throw new Error('Failed to fetch billing data');
            }

            // Find relevant billing records for guest's rooms
            const relevantBillings = billingData.data.filter(bill => {
                const billRoomSet = new Set(bill.roomNo);
                return guestToDelete.roomNumbers.some(roomNum =>
                    billRoomSet.has(roomNum.toString()) && bill.Bill_Paid === 'no'
                );
            });

            // Process each billing record
            for (const billing of relevantBillings) {

                // If billing has only one room, mark it as cancelled
                await fetch(`/api/Billing/${billing._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        Cancelled: "yes",
                        dueAmount: 0
                    })
                });
            }

            // Update room status for each room
            for (const roomNumber of guestToDelete.roomNumbers) {
                // Get room details
                console.log('Room number:', roomNumber);
                const roomsResponse = await fetch('/api/rooms');
                const roomsData = await roomsResponse.json();

                if (!roomsData.success) {
                    throw new Error('Failed to fetch rooms data');
                }

                const room = roomsData.data.find(r => r.number === roomNumber.toString());
                if (!room) continue;
                console.log('Room:', room);
                // Get current room data
                const roomResponse = await fetch(`/api/rooms/${room._id}`);
                const roomData = await roomResponse.json();
                const currentRoomData = roomData.data;
                // Find position of current billing ID
                const guestPosition = currentRoomData.guestWaitlist.findIndex(
                    (guestId) => guestId._id.toString() === deleteGuestId.toString()
                );
                console.log('Guest position:', guestPosition);
                // Find position of current billing ID
                const currentBilling = relevantBillings.find(bill =>
                    bill.roomNo.includes(roomNumber.toString())
                );
                console.log('Current billing:', currentBilling);
                if (!currentBilling) continue;

                const currentPosition = currentRoomData.billWaitlist.findIndex(
                    (billId) => billId._id.toString() === currentBilling._id.toString()
                );

                // Prepare update data
                let updateData = {
                    billWaitlist: currentRoomData.billWaitlist,
                    guestWaitlist: currentRoomData.guestWaitlist,
                    checkInDateList: currentRoomData.checkInDateList,
                    checkOutDateList: currentRoomData.checkOutDateList,
                };
                console.log('Current position:', currentPosition);
                console.log('Current room data:', currentRoomData.billWaitlist.length);
                // Check if there's a next booking
                const hasNextBooking = guestPosition < currentRoomData.billWaitlist.length - 1;
                if (hasNextBooking) {
                    console.log('Next booking found');
                    updateData = {
                        ...updateData,
                        currentBillingId: currentRoomData.billWaitlist[currentPosition + 1],
                        currentGuestId: currentRoomData.guestWaitlist[currentPosition + 1],
                        occupied: "Vacant",
                        clean: true,
                        billingStarted: "No"
                    };
                } else {
                    updateData = {
                        ...updateData,
                        currentBillingId: null,
                        currentGuestId: null,
                        occupied: "Vacant",
                        clean: true,
                        billingStarted: "No"
                    };
                }

                console.log('Update data:', updateData);

                // Update room with new data
                await fetch(`/api/rooms/${room._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                });
            }

            // Update local state
            setGuests(guests.filter((guest) => guest._id !== deleteGuestId));
            setOpenDeleteDialog(false);
            alert('Guest booking cancelled and deleted successfully!');

        } catch (error) {
            console.error('Error deleting guest:', error);
            alert('Error deleting guest: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditClick = (guest) => {
        // Ensure bookingStatus has a default value if undefined
        const guestWithDefaultStatus = {
            ...guest,
            bookingStatus: guest.bookingStatus || 'Confirm'
        };
        console.log('Editing guest with status:', guestWithDefaultStatus.bookingStatus);
        setEditGuest(guestWithDefaultStatus);
        setOpenEditModal(true);
    };

    // Handle saving edited guest details
    const handleSaveEdit = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`/api/NewBooking/${editGuest._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editGuest),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Guest details updated successfully!');
                setOpenEditModal(false);

                // Refresh the guest list with filtered data
                const updatedResponse = await fetch('/api/NewBooking');
                const updatedData = await updatedResponse.json();

                if (updatedData.success) {
                    const guestMap = new Map();
                    const sortedGuests = [...updatedData.data].sort((a, b) => {
                        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                    });

                    sortedGuests.forEach(guest => {
                        if (!guestMap.has(guest.mobileNo)) {
                            guestMap.set(guest.mobileNo, guest);
                        }
                    });

                    setGuests(Array.from(guestMap.values()));
                }
            } else {
                console.error('Failed to update guest');
            }
        } catch (error) {
            console.error('Error saving edit:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditChange = async (field, value) => {
        if (field === 'checkOut') {
            try {
                const token = document.cookie.split('; ').find(row => row.startsWith('authToken=')).split('=')[1];
                const headers = { 'Authorization': `Bearer ${token}` };

                // Get all billing records
                const billingResponse = await fetch('/api/Billing');
                const billingData = await billingResponse.json();

                if (billingData.success && billingData.data) {
                    const matchedBillings = billingData.data.filter(bill => {
                        const billRoomSet = new Set(bill.roomNo);
                        const hasMatchingRoom = editGuest.roomNumbers.some(roomNum =>
                            billRoomSet.has(roomNum.toString())
                        );
                        return hasMatchingRoom && bill.Bill_Paid === 'no';
                    });

                    console.log('Matched billings:', matchedBillings);

                    for (const billing of matchedBillings) {
                        // Calculate new room price for each room in the billing
                        const roomPrices = await Promise.all(
                            billing.roomNo.map(async (roomNumber) =>
                                await calculateRoomPrice(
                                    [parseInt(roomNumber)],
                                    editGuest.checkIn,
                                    value
                                )
                            )
                        );
                        console.log('Room prices:', roomPrices);

                        // Calculate total for totalAmount and dueAmount
                        const totalNewRoomPrice = roomPrices.reduce((sum, price) => sum + price, 0);
                        console.log('Total new room price:', totalNewRoomPrice);

                        // Update billing with individual room prices in priceList
                        const updatedBilling = {
                            ...billing,
                            priceList: roomPrices, // Store individual room prices instead of the sum
                            totalAmount: totalNewRoomPrice,
                            dueAmount: totalNewRoomPrice
                        };

                        console.log('Updated billing:', updatedBilling);

                        // Update billing record
                        await fetch(`/api/Billing/${billing._id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updatedBilling)
                        });
                    }

                    // Fetch room details
                    const roomsResponse = await axios.get("/api/rooms", { headers });
                    console.log('Rooms:', roomsResponse.data.data);
                    console.log('Matched Rooms:', matchedBillings[0].roomNo);

                    // Find all matched rooms for the first billing's room numbers
                    const matchedRooms = roomsResponse.data.data.filter(
                        (room) => matchedBillings[0].roomNo.includes(room.number)
                    );

                    if (matchedRooms.length === 0) {
                        throw new Error("No matching rooms found");
                    }

                    console.log('Matched rooms:', matchedRooms.map(room => room._id));

                    // Update checkOutDateList for each room
                    for (const roomNumber of editGuest.roomNumbers) {
                        console.log('Updating checkOutDateList for room:', roomNumber);

                        // Find the matching room for this room number
                        const matchedRoom = matchedRooms.find(room => room.number === roomNumber);
                        if (!matchedRoom) continue;

                        // Fetch the current room data
                        const roomResponse = await fetch(`/api/rooms/${matchedRoom._id}`);
                        const roomData = await roomResponse.json();
                        console.log('Room data:', roomData.success);

                        if (roomData.success) {
                            const room = roomData.data;
                            console.log('Room:', room);

                            // Find the index of the previous checkout date in the checkOutDateList
                            const oldCheckoutDate = new Date(editGuest.checkOut).toISOString();
                            console.log('Old checkout date:', oldCheckoutDate);
                            console.log('CheckOutDateList:', room.checkOutDateList);
                            const dateIndex = room.checkOutDateList.indexOf(oldCheckoutDate);
                            console.log('Date index:', dateIndex);
                            if (dateIndex !== -1) {
                                // Create new checkOutDateList with updated date
                                const updatedCheckOutDateList = [...room.checkOutDateList];
                                updatedCheckOutDateList[dateIndex] = value;

                                // Update the room with new checkOutDateList
                                const updatedRoom = {
                                    ...room,
                                    checkOutDateList: updatedCheckOutDateList
                                };

                                // Send update to rooms API
                                await fetch(`/api/rooms/${room._id}`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ checkOutDateList: updatedCheckOutDateList })
                                });
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error updating checkOutDateList:', error);
                alert('Failed to update room checkout dates. Please try again.');
                return;
            }
        }

        setEditGuest((prev) => ({ ...prev, [field]: value }));
    };

    if (error) return <p>{error}</p>;

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-amber-50">

                {isLoading && (
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
                            <span className="mt-4 text-gray-700">Loading Guest Lists...</span>
                        </div>
                    </div>
                )}
                <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="bg-amber-50  rounded-lg p-6">
                            <h1 className="text-3xl font-semibold text-cyan-900 mb-4">
                                Guest List
                            </h1>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="guest list">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: "bold", color: "#28bfdb" }}>Name</TableCell>
                                            <TableCell sx={{ fontWeight: "bold", color: "#28bfdb" }}>Mobile</TableCell>
                                            <TableCell sx={{ fontWeight: "bold", color: "#28bfdb" }}>Email</TableCell>
                                            <TableCell sx={{ fontWeight: "bold", color: "#28bfdb" }}>Address</TableCell>
                                            <TableCell sx={{ fontWeight: "bold", color: "#28bfdb" }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {guests.map((guest) => (
                                            <TableRow key={guest._id}>
                                                <TableCell component="th">{guest.guestName}</TableCell>
                                                <TableCell>{guest.mobileNo}</TableCell>
                                                <TableCell>{guest.guestEmail || 'N/A'}</TableCell>
                                                <TableCell>{guest.address}</TableCell>
                                                <TableCell>
                                                    <Tooltip title={guest.disableActions ? "Actions disabled for checked-out or cancelled bookings" : "Edit guest"}>
                                                        <span>
                                                            <IconButton
                                                                color="primary"
                                                                onClick={() => handleEditClick(guest)}

                                                            >
                                                                <Edit />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                    <Tooltip title={guest.disableActions ? "Actions disabled for checked-out or cancelled bookings" : "Delete guest"}>
                                                        <span>
                                                            <IconButton
                                                                color="secondary"
                                                                onClick={() => handleDeleteClick(guest._id)}

                                                            >
                                                                <Delete />
                                                            </IconButton>
                                                        </span>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </main>

                {/* Delete Confirmation Dialog */}
                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                    <DialogTitle>Delete Guest</DialogTitle>
                    <DialogContent>
                        Are you sure you want to delete this guest? This action cannot be undone.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                        <Button onClick={handleConfirmDelete} color="error">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Edit Guest Modal */}
                {editGuest && (
                    <Dialog
                        open={openEditModal}
                        onClose={() => setOpenEditModal(false)}
                        maxWidth="md"
                        fullWidth
                    >
                        <DialogTitle>Edit Guest Details</DialogTitle>
                        <DialogContent>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                                {/* Booking Type */}
                                <TextField select label="Booking Type" fullWidth value={editGuest.bookingType} onChange={(e) => handleEditChange('bookingType', e.target.value)} >
                                    {['FIT', 'Group', 'Corporate', 'Corporate Group', 'Office', 'Social Events'].map((type) => (
                                        <MenuItem key={type} value={type}>{type}</MenuItem>
                                    ))}
                                </TextField>

                                {/* Mobile Number */}
                                <TextField label="Mobile Number" fullWidth value={editGuest.mobileNo} onChange={(e) => handleEditChange('mobileNo', e.target.value)} />

                                {/* Guest Name */}
                                <TextField label="Guest Name" fullWidth value={editGuest.guestName} onChange={(e) => handleEditChange('guestName', e.target.value)} />

                                {/* CheckIn Date (Read-Only and Disabled) */}
                                <TextField
                                    label="CheckIn Date"
                                    value={editGuest.checkIn ? new Date(editGuest.checkIn).toLocaleDateString('en-GB') : ''}
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                    fullWidth
                                    margin="normal"
                                    disabled
                                />

                                {/* CheckOut Date (Editable with Validation) */}
                                <TextField
                                    label="CheckOut Date"
                                    type="date"
                                    value={editGuest.checkOut ? new Date(editGuest.checkOut).toISOString().split('T')[0] : ''}
                                    onChange={(e) => {
                                        const newCheckoutDate = e.target.value;
                                        const checkInDate = new Date(editGuest.checkIn);
                                        const currentCheckoutDate = new Date(editGuest.checkOut);
                                        const newCheckoutDateObj = new Date(newCheckoutDate);
                                        // Validation: CheckOut Date must not be earlier than CheckIn Date
                                        if (newCheckoutDateObj < checkInDate) {
                                            alert("CheckOut Date cannot be earlier than CheckIn Date.");
                                            return;
                                        }

                                        // Validation: CheckOut Date must not be later than the current CheckOut Date
                                        if (newCheckoutDateObj > currentCheckoutDate) {
                                            alert("CheckOut Date cannot be later than the current CheckOut Date.");
                                            return;
                                        }

                                        handleEditChange('checkOut', newCheckoutDate);
                                    }}
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />

                                {/* Company Name */}
                                <TextField label="Company Name" fullWidth value={editGuest.companyName} onChange={(e) => handleEditChange('companyName', e.target.value)} />

                                {/* GSTIN */}
                                <TextField label="GSTIN" fullWidth value={editGuest.gstin} onChange={(e) => handleEditChange('gstin', e.target.value)} />

                                {/* Guest Email */}
                                <TextField label="Guest Email" fullWidth value={editGuest.guestEmail} onChange={(e) => handleEditChange('guestEmail', e.target.value)} />

                                {/* Adults */}
                                <TextField label="Adults" type="number" fullWidth value={editGuest.adults} onChange={(e) => handleEditChange('adults', e.target.value)} />

                                {/* Children */}
                                <TextField label="Children" type="number" fullWidth value={editGuest.children} onChange={(e) => handleEditChange('children', e.target.value)} />

                                {/* Booking Status */}
                                <TextField select label="Booking Status" fullWidth value={editGuest.bookingStatus || 'Confirm'} onChange={(e) => handleEditChange('bookingStatus', e.target.value)} >
                                    {['Confirm', 'Block'].map((status) => (
                                        <MenuItem key={status} value={status}>{status}</MenuItem>
                                    ))}
                                </TextField>
                                {/* Checked In */}
                                <FormControl component="fieldset">
                                    <Typography variant="subtitle1">Checked In:</Typography>
                                    <RadioGroup
                                        row
                                        name="checkedIn"
                                        value={editGuest.CheckedIn}
                                        onChange={(e) => handleEditChange('CheckedIn', e.target.value === 'true')}
                                    >
                                        <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                        <FormControlLabel value={false} control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl>

                                {/* Checked Out */}
                                <FormControl component="fieldset">
                                    <Typography variant="subtitle1">Checked Out:</Typography>
                                    <RadioGroup
                                        row
                                        name="checkedOut"
                                        value={editGuest.CheckedOut}
                                        onChange={(e) => handleEditChange('CheckedOut', e.target.value === 'true')}
                                    >
                                        <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                        <FormControlLabel value={false} control={<Radio />} label="No" />
                                    </RadioGroup>
                                </FormControl>
                                {/* Address */}
                                <TextField label="Address" fullWidth value={editGuest.address} onChange={(e) => handleEditChange('address', e.target.value)} />

                                {/* State */}
                                <TextField label="State" fullWidth value={editGuest.state} onChange={(e) => handleEditChange('state', e.target.value)} />

                                {/* Meal Plan */}
                                <TextField select label="Meal Plan" fullWidth value={editGuest.mealPlan} onChange={(e) => handleEditChange('mealPlan', e.target.value)} >
                                    {['EP', 'AP', 'CP', 'MAP'].map((plan) => (
                                        <MenuItem key={plan} value={plan}>{plan}</MenuItem>
                                    ))}
                                </TextField>

                                {/* Booking Reference */}
                                <TextField label="Booking Reference" fullWidth value={editGuest.bookingReference} onChange={(e) => handleEditChange('bookingReference', e.target.value)} />

                                {/* Remarks */}
                                <TextField label="Remarks" fullWidth multiline rows={3} value={editGuest.remarks} onChange={(e) => handleEditChange('remarks', e.target.value)} />
                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
                            <Button onClick={handleSaveEdit} variant="contained" color="primary">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                )}
            </div>
            <Footer />
        </div>
    );
}
