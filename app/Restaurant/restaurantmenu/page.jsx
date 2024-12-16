'use client';
import { useRouter } from 'next/navigation';
import { Footer } from '@/app/_components/Footer';
import Navbar from '@/app/_components/Navbar';
import { useState, useEffect } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Select, MenuItem, TextField } from '@mui/material';
import { Box } from '@mui/system';

export default function RestaurantList() {
    const router = useRouter();
    
    // State to store menu items
    const [restaurantItems, setRestaurantItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from the API on component mount
    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await fetch('/api/menuItem'); // Adjust the endpoint if necessary
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

    if (loading) return <Typography>Loading...</Typography>;
    if (error) return <Typography>Error: {error}</Typography>;

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#fff8e1' }}>
            <Navbar />
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" color="#4a5568" mb={3}>
                    Booking Master Control Panel
                </Typography>

                {/* Buttons Section */}
                <Box mb={3} display="flex" gap={2}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => router.push('/Restaurant/restaurantmenu/add')}
                    >
                        Add New +
                    </Button>
                    <Button variant="contained" color="warning">
                        Import Data ☁
                    </Button>
                    <Button variant="contained" color="info">
                        Export Data ⬇
                    </Button>
                </Box>

                {/* Search and Select Section */}
                <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography>Display</Typography>
                        <Select defaultValue={15} size="small">
                            <MenuItem value={15}>15</MenuItem>
                        </Select>
                        <Typography>records</Typography>
                    </Box>
                    <TextField
                        placeholder="Search:"
                        variant="outlined"
                        size="small"
                    />
                </Box>

                {/* Table Section */}
                <TableContainer component={Paper} style={{ maxWidth: '85%', margin: '0 auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {['Item Code', 'Category', 'Segment', 'Item Name', 'Price (INR)', 'GST (%)', 'Total (incl. GST)', 'In Profile?', 'Is Special?', 'Disc. Allowed?', 'Action'].map((column) => (
                                    <TableCell key={column} sx={{ color: '#28bfdb', fontWeight: 'bold' }}>
                                        {column}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {restaurantItems.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>{item.itemCode}</TableCell>
                                    <TableCell>{item.itemCategory}</TableCell>
                                    <TableCell>{item.itemSegment}</TableCell>
                                    <TableCell>{item.itemName}</TableCell>
                                    <TableCell>{item.price}</TableCell>
                                    <TableCell>{item.gst}</TableCell>
                                    <TableCell>{item.total}</TableCell>
                                    <TableCell>{item.showInProfile}</TableCell>
                                    <TableCell>{item.isSpecialItem}</TableCell>
                                    <TableCell>{item.discountAllowed}</TableCell>
                                    <TableCell>
                                        
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="info"
                                            sx={{ mr: 1 }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="error"
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Footer />
        </Box>
    );
}
