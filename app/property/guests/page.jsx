'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
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
            const updatedGuest = {
                ...editGuest,
            };

            await fetch(`/api/NewBooking/${editGuest._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedGuest),
            });

            setGuests(
                guests.map((guest) =>
                    guest._id === editGuest._id ? updatedGuest : guest
                )
            );
            setOpenEditModal(false);
        } catch (error) {
            console.error('Error updating guest:', error);
        }
    };

    // Handle modal input changes
    const handleEditChange = (field, value) => {
        setEditGuest({ ...editGuest, [field]: value });
    };

    if (loading) return <p>Loading...</p>;
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
                <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
                    <DialogTitle>Edit Guest Details</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Guest Name"
                            fullWidth
                            value={editGuest.guestName}
                            onChange={(e) => handleEditChange('guestName', e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Mobile"
                            fullWidth
                            value={editGuest.mobileNo}
                            onChange={(e) => handleEditChange('mobileNo', e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Email"
                            fullWidth
                            value={editGuest.guestEmail}
                            onChange={(e) => handleEditChange('guestEmail', e.target.value)}
                        />
                        <TextField
                            margin="dense"
                            label="Address"
                            fullWidth
                            value={editGuest.address}
                            onChange={(e) => handleEditChange('address', e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
                        <Button onClick={handleSaveEdit} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
            <Footer />
        </div>
    );
}
