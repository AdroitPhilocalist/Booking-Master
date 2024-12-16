'use client';
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/app/_components/Navbar";
import { Footer } from "@/app/_components/Footer";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Input,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

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
        const response = await fetch("/api/menuItem"); // Adjust the endpoint if necessary
        const result = await response.json();

        if (result.success) {
          setRestaurantItems(result.data);
        } else {
          setError(result.error || "Failed to fetch data");
        }
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) return <CircularProgress style={{ margin: "50px auto", display: "block" }} />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box minHeight="100vh" bgcolor="#FFF5E1">
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom color="text.primary" fontWeight="bold" >
          Booking Master Control Panel
        </Typography>

        <Box display="flex" gap={2} mb={2}>
          <Button
            variant="contained"
            color="success"
            onClick={() => router.push("/Restaurant/restaurantmenu/add")}
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

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Display</InputLabel>
            <Select defaultValue={15} label="Display">
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
          <Input placeholder="Search..." sx={{ width: 300 }} />
        </Box>

        <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
          <Table sx={{ minWidth: 900 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell><strong>Item Code</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Segment</strong></TableCell>
                <TableCell><strong>Item Name</strong></TableCell>
                <TableCell><strong>Price (INR)</strong></TableCell>
                <TableCell><strong>GST (%)</strong></TableCell>
                <TableCell><strong>Total (incl. GST)</strong></TableCell>
                <TableCell><strong>In Profile?</strong></TableCell>
                <TableCell><strong>Is Special?</strong></TableCell>
                <TableCell><strong>Disc. Allowed?</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {restaurantItems.map((item, index) => (
                <TableRow key={index} hover>
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
                      ✏ Edit
                    </Button>
                    <Button size="small" variant="contained" color="error">
                      🗑 Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Footer />
    </Box>
  );
}
