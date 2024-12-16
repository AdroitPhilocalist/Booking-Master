'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    Paper,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { Footer } from '@/app/_components/Footer'
import Navbar from '@/app/_components/Navbar'

export default function RestaurantList() {
    const router = useRouter();

    const [restaurantItems, setRestaurantItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch('/api/menuItem');
                const result = await response.json();

                if (result.success) {
                    setRestaurantItems(result.data);
                } else {
                    setError(result.error || 'Failed to fetch data');
                }
            } catch (err) {
                console.error('Error fetching menu items:', err);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    const handleEditClick = (item) => {
        setSelectedItem(item);
        setOpenEditModal(true);
    };

    const handleDeleteClick = (item) => {
        setSelectedItem(item);
        setOpenDeleteDialog(true);
    };

    const handleEditSave = async () => {
        try {
            const response = await fetch(`/api/menuItem/${selectedItem._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(selectedItem),
            });

            const result = await response.json();

            if (result.success) {
                setRestaurantItems((prev) =>
                    prev.map((item) => (item._id === selectedItem._id ? result.data : item))
                );
                setOpenEditModal(false);
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error('Error updating item:', err);
        }
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`/api/menuItem/${selectedItem._id}`, {
                method: 'DELETE',
            });

            const result = await response.json();

            if (result.success) {
                setRestaurantItems((prev) =>
                    prev.filter((item) => item._id !== selectedItem._id)
                );
                setOpenDeleteDialog(false);
            } else {
                alert(result.error);
            }
        } catch (err) {
            console.error('Error deleting item:', err);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>Error: {error}</Typography>;

    return (
        <Box>
            <Navbar />
            <Box sx={{ padding: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Restaurant Menu
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => router.push('/Restaurant/restaurantmenu/add')}
                >
                    Add New Item
                </Button>
                <TableContainer component={Paper} sx={{ marginTop: 4 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item Code</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Segment</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Price (INR)</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {restaurantItems.map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>{item.itemCode}</TableCell>
                                    <TableCell>{item.itemCategory}</TableCell>
                                    <TableCell>{item.itemSegment}</TableCell>
                                    <TableCell>{item.itemName}</TableCell>
                                    <TableCell>{item.price}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleEditClick(item)}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => handleDeleteClick(item)}>
                                                <Delete color="error" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Footer />

            {/* Edit Modal */}
            <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)}>
                <DialogTitle>Edit Menu Item</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        label="Item Name"
                        fullWidth
                        value={selectedItem?.itemName || ''}
                        onChange={(e) =>
                            setSelectedItem((prev) => ({ ...prev, itemName: e.target.value }))
                        }
                    />
                    <TextField
                        margin="dense"
                        label="Price"
                        fullWidth
                        value={selectedItem?.price || ''}
                        onChange={(e) =>
                            setSelectedItem((prev) => ({ ...prev, price: e.target.value }))
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
                    <Button onClick={handleEditSave} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this menu item?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
