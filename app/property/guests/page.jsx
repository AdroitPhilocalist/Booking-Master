'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions,MenuItem, Button, TextField } from '@mui/material';
import { IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import Navbar from "@/app/_components/Navbar";
import { Footer } from "@/app/_components/Footer";

export default function GuestList() {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [deleteGuestId, setDeleteGuestId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [openEditModal, setOpenEditModal] = useState(false);
    const [editGuest, setEditGuest] = useState(null);

    // Fetch guest data
    useEffect(() => {
        const fetchGuests = async () => {
            try {
                const response = await fetch('/api/NewBooking');
                const data = await response.json();

                if (data.success) {
                    setGuests(data.data);
                } else {
                    setError('Failed to load guest data');
                }
            } catch (err) {
                setError('Error fetching guests');
            } finally {
                setLoading(false);
            }
        };

        fetchGuests();
    }, []);

    // Handle delete button click
    const handleDeleteClick = (id) => {
        setDeleteGuestId(id);
        setOpenDeleteDialog(true);
    };

    // Confirm delete
    const handleConfirmDelete = async () => {
        try {
            await fetch(`/api/NewBooking/${deleteGuestId}`, { method: 'DELETE' });
            setGuests(guests.filter((guest) => guest._id !== deleteGuestId));
            setOpenDeleteDialog(false);
        } catch (error) {
            console.error('Error deleting guest:', error);
        }
    };

    // Handle edit button click
    const handleEditClick = (guest) => {
        setEditGuest(guest);
        setOpenEditModal(true);
    };

    // Handle saving edited guest details
    const handleSaveEdit = async () => {
        try {
            const response = await fetch(`/api/NewBooking/${editGuest._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editGuest),
            });
    
            if (response.ok) {
                const data = await response.json();
                alert('Guest details updated successfully!');
                setOpenEditModal(false);
                window.location.reload();
                // Refresh the guest list here
            } else {
                console.error('Failed to update guest');
            }
        } catch (error) {
            console.error('Error saving edit:', error);
        }
    };
    

    // Handle modal input changes
    const handleEditChange = (field, value) => {
        setEditGuest((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    
    if (loading) {
        return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
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
          <span className="mt-4 text-gray-700">Loading Guest Data...</span>
        </div>
      </div>;
      }
    if (error) return <p>{error}</p>;

    return (
        <div className="min-h-screen bg-amber-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h1 className="text-2xl font-semibold text-cyan-800 mb-4">
                            Booking Master Control Panel
                        </h1>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-amber-200">
                                <thead className="bg-cyan-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Mobile
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Address
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-amber-200">
                                    {guests.map((guest) => (
                                        <tr key={guest._id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cyan-900">
                                                {guest.guestName}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-900">
                                                {guest.mobileNo}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-900">
                                                {guest.guestEmail}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-900">
                                                {guest.address}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => handleEditClick(guest)}
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    color="secondary"
                                                    onClick={() => handleDeleteClick(guest._id)}
                                                >
                                                    <Delete />
                                                </IconButton>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
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
            <div className="grid grid-cols-2 gap-4">
                {/* Booking Type */}
                <TextField
                    select
                    label="Booking Type"
                    fullWidth
                    value={editGuest.bookingType}
                    onChange={(e) => handleEditChange('bookingType', e.target.value)}
                >
                    {['FIT', 'Group', 'Corporate', 'Corporate Group', 'Office', 'Social Events'].map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Booking Source */}
                <TextField
                    select
                    label="Booking Source"
                    fullWidth
                    value={editGuest.bookingSource}
                    onChange={(e) => handleEditChange('bookingSource', e.target.value)}
                >
                    {['Walk In', 'Front Office', 'Agent', 'Office', 'Goibibo', 'Make My Trip', 'Agoda.com', 'Booking.com', 'Cleartrip', 'Yatra', 'Expedia', 'Trivago', 'Ease My Trip', 'Hotels.com', 'Happy Easy Go', 'TBO', 'Booking Engine', 'GO-MMT', 'Booking Master', 'Hoichoi', 'Others'].map((source) => (
                        <MenuItem key={source} value={source}>
                            {source}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Booking Point */}
                <TextField
                    label="Booking Point"
                    fullWidth
                    value={editGuest.bookingPoint}
                    onChange={(e) => handleEditChange('bookingPoint', e.target.value)}
                />

                {/* Pin Code */}
                <TextField
                    label="Pin Code"
                    fullWidth
                    value={editGuest.pinCode}
                    onChange={(e) => handleEditChange('pinCode', e.target.value)}
                />

                {/* Mobile Number */}
                <TextField
                    label="Mobile Number"
                    fullWidth
                    value={editGuest.mobileNo}
                    onChange={(e) => handleEditChange('mobileNo', e.target.value)}
                />

                {/* Guest Name */}
                <TextField
                    label="Guest Name"
                    fullWidth
                    value={editGuest.guestName}
                    onChange={(e) => handleEditChange('guestName', e.target.value)}
                />

                {/* Company Name */}
                <TextField
                    label="Company Name"
                    fullWidth
                    value={editGuest.companyName}
                    onChange={(e) => handleEditChange('companyName', e.target.value)}
                />

                {/* GSTIN */}
                <TextField
                    label="GSTIN"
                    fullWidth
                    value={editGuest.gstin}
                    onChange={(e) => handleEditChange('gstin', e.target.value)}
                />

                {/* Guest Email */}
                <TextField
                    label="Guest Email"
                    fullWidth
                    value={editGuest.guestEmail}
                    onChange={(e) => handleEditChange('guestEmail', e.target.value)}
                />

                {/* Adults */}
                <TextField
                    label="Adults"
                    type="number"
                    fullWidth
                    value={editGuest.adults}
                    onChange={(e) => handleEditChange('adults', e.target.value)}
                />

                {/* Children */}
                <TextField
                    label="Children"
                    type="number"
                    fullWidth
                    value={editGuest.children}
                    onChange={(e) => handleEditChange('children', e.target.value)}
                />

                {/* Booking Status */}
                <TextField
                    select
                    label="Booking Status"
                    fullWidth
                    value={editGuest.bookingStatus}
                    onChange={(e) => handleEditChange('bookingStatus', e.target.value)}
                >
                    {['Confirmed', 'Blocked'].map((status) => (
                        <MenuItem key={status} value={status}>
                            {status}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Address */}
                <TextField
                    label="Address"
                    fullWidth
                    value={editGuest.address}
                    onChange={(e) => handleEditChange('address', e.target.value)}
                />

                {/* Remarks */}
                <TextField
                    label="Remarks"
                    fullWidth
                    multiline
                    rows={3}
                    value={editGuest.remarks}
                    onChange={(e) => handleEditChange('remarks', e.target.value)}
                />

                {/* State */}
                <TextField
                    label="State"
                    fullWidth
                    value={editGuest.state}
                    onChange={(e) => handleEditChange('state', e.target.value)}
                />

                {/* Meal Plan */}
                <TextField
                    select
                    label="Meal Plan"
                    fullWidth
                    value={editGuest.mealPlan}
                    onChange={(e) => handleEditChange('mealPlan', e.target.value)}
                >
                    {['EP', 'AP', 'CP', 'MAP'].map((plan) => (
                        <MenuItem key={plan} value={plan}>
                            {plan}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Booking Reference */}
                <TextField
                    label="Booking Reference"
                    fullWidth
                    value={editGuest.bookingReference}
                    onChange={(e) => handleEditChange('bookingReference', e.target.value)}
                />

                {/* Guest Type */}
                <TextField
                    select
                    label="Guest Type"
                    fullWidth
                    value={editGuest.guestType}
                    onChange={(e) => handleEditChange('guestType', e.target.value)}
                >
                    {['General', 'VIP Guest', 'VVIP Guest', 'Scanty baggage'].map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Guest Notes */}
                <TextField
                    label="Guest Notes"
                    fullWidth
                    multiline
                    rows={3}
                    value={editGuest.guestNotes}
                    onChange={(e) => handleEditChange('guestNotes', e.target.value)}
                />

                {/* Internal Notes */}
                <TextField
                    label="Internal Notes"
                    fullWidth
                    multiline
                    rows={3}
                    value={editGuest.internalNotes}
                    onChange={(e) => handleEditChange('internalNotes', e.target.value)}
                />
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

            <Footer />
        </div>
    );
}
