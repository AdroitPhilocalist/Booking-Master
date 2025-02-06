"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { getCookie } from 'cookies-next'; // Import getCookie from cookies-next
import { jwtVerify } from 'jose'; // Import jwtVerify for decoding JWT
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function InventoryList() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAction, setStockAction] = useState({ type: '', itemId: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [currentItem, setCurrentItem] = useState(null);
  const router = useRouter();
  const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

  // Fetch items and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const token = getCookie('authToken'); // Get the token from cookies
        if (!token) {
          router.push('/'); // Redirect to login if no token is found
          return;
        }
        // Verify the token
        const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
        const userId = decoded.payload.id;
        // Fetch the profile by userId to get the username
        const profileResponse = await fetch(`/api/Profile/${userId}`);
        const profileData = await profileResponse.json();
        console.log(profileData);
        if (!profileData.success || !profileData.data) {
          router.push('/'); // Redirect to login if profile not found
          return;
        }
        const username = profileData.data.username;
        const [itemsResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/InventoryList?username=${username}`),
          fetch(`/api/InventoryCategory?username=${username}`)
        ]);

        const itemsData = await itemsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setItems(itemsData.items || []);
        setCategories(categoriesData.products || []);
      } catch (error) {
        console.error("Failed to fetch data", error);
        router.push('/'); // Redirect to login if any error occurs
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const updateCategoryStatus = async (segmentId) => {
    try {
      const token = getCookie('authToken'); // Get the token from cookies
      if (!token) {
        router.push('/'); // Redirect to login if no token is found
        return;
      }
      // Verify the token
      const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
      const userId = decoded.payload.id;
      // Fetch the profile by userId to get the username
      const profileResponse = await fetch(`/api/Profile/${userId}`);
      const profileData = await profileResponse.json();
      if (!profileData.success || !profileData.data) {
        router.push('/'); // Redirect to login if profile not found
        return;
      }
      const username = profileData.data.username;

      const response = await fetch(`/api/InventoryCategory/${segmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: true, username: username }), // Include username in the request body
      });

      if (!response.ok) {
        throw new Error('Failed to update category status');
      }

      // Update local categories state
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category._id === segmentId
            ? { ...category, isActive: true }
            : category
        )
      );
      //toast.success("Item updated successfully");
    } catch (error) {
      console.error('Error updating category status:', error);
      toast.error("Error updating category status:");
    }
  };

  const handleSubmit = async (formData) => {
    try {
      const method = currentItem ? "PUT" : "POST";
      const url = currentItem ? `/api/InventoryList/${currentItem._id}` : "/api/InventoryList";
      const token = getCookie('authToken'); // Get the token from cookies
      if (!token) {
        router.push('/'); // Redirect to login if no token is found
        return;
      }
      // Verify the token
      const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
      const userId = decoded.payload.id;
      // Fetch the profile by userId to get the username
      const profileResponse = await fetch(`/api/Profile/${userId}`);
      const profileData = await profileResponse.json();
      if (!profileData.success || !profileData.data) {
        router.push('/'); // Redirect to login if profile not found
        return;
      }
      const username = profileData.data.username;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...formData, username: username }), // Include username in the request body
      });

      const data = await response.json();
      if (method === "POST") {
        setItems((prev) => [...prev, data.item]);
        // Update category status when new item is added
        await updateCategoryStatus(formData.segment);
        toast.success("Item added successfully");
      } else {
        setItems((prev) =>
          prev.map((item) =>
            item._id === data.item._id ? data.item : item
          )
        );
      }
      setShowModal(false);
      setCurrentItem(null);
    } catch (error) {
      console.error("Error saving item:", error);
      toast.error("Error saving item:");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const token = getCookie('authToken'); // Get the token from cookies
      if (!token) {
        router.push('/'); // Redirect to login if no token is found
        return;
      }
      // Verify the token
      const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
      const userId = decoded.payload.id;
      // Fetch the profile by userId to get the username
      const profileResponse = await fetch(`/api/Profile/${userId}`);
      const profileData = await profileResponse.json();
      if (!profileData.success || !profileData.data) {
        router.push('/'); // Redirect to login if profile not found
        return;
      }
      const username = profileData.data.username;

      const response = await fetch(`/api/InventoryList/${id}?username=${username}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data.message);
      
      // Remove the deleted product from the state
      setItems((prev) => prev.filter((item) => item._id !== id));
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product:");
    }
  };

  const handleEditProduct = (item) => {
    setCurrentItem(item);
    setShowModal(true);
  };

  return (
    <div>
      <Navbar />
      <div className="bg-amber-50 min-h-screen">
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />

        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
              <svg aria-hidden="true" className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span className="mt-4 text-gray-700">Loading Inventory List...</span>
            </div>
          </div>
        )}
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4 text-cyan-900" style={{ maxWidth: '80%', margin: '0 auto' }}>Inventory List</h1>
          <div className="flex justify-end" style={{ maxWidth: '80%', margin: '0 auto' }}>
            <button onClick={() => { setShowModal(true); setCurrentItem(null); }} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
              Add Items +
            </button>
          </div>
          <TableContainer component={Paper} style={{ maxWidth: '80%', margin: '0 auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Item Code</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Group</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Segment</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Auditable</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>SGST</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>CGST</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#28bfdb", textAlign: "center" }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item._id} sx={{ backgroundColor: "white" }}>
                    <TableCell sx={{ textAlign: "center" }}>{item.itemCode}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{item.name}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{item.group}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{item.segment?.itemName}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{item.auditable}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{(item.tax) / 2}%</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>{(item.tax) / 2}%</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <IconButton color="primary" onClick={() => handleEditProduct(item)} disabled={item.isActive} sx={{ opacity: item.isActive ? 0.5 : 1 }}>
                        <Edit />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => handleDeleteProduct(item._id)} disabled={item.isActive} sx={{ opacity: item.isActive ? 0.5 : 1 }}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {showModal && (
          <ItemModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} initialData={currentItem} categories={categories} />
        )}
      </div>
      <Footer />
    </div>
  );
}

const ItemModal = ({ onClose, onSubmit, initialData, categories }) => {
  const [formData, setFormData] = useState(initialData || {
    itemCode: '',
    name: '',
    group: '',
    segment: '',
    auditable: 'no',
    tax: '',
    stock: 0,
    quantityUnit: 'pieces'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = () => {
    return (
      formData.itemCode.trim() !== '' &&
      formData.name.trim() !== '' &&
      formData.group.trim() !== '' &&
      formData.segment !== '' &&
      formData.tax !== ''
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit' : 'Add'} Item</h2>
        <div className="mb-4">
          <TextField id="itemCode" label="Item Code" variant="outlined" type="text" value={formData.itemCode} onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })} className="w-full" fullWidth />
        </div>
        <div className="mb-4">
          <TextField id="name" label="Name" variant="outlined" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full" fullWidth />
        </div>
        <div className="mb-4">
          <TextField id="group" label="Group" variant="outlined" type="text" value={formData.group} onChange={(e) => setFormData({ ...formData, group: e.target.value })} className="w-full" fullWidth />
        </div>
        <div className="mb-4">
          <TextField id="segment" label="Segment" variant="outlined" select value={formData.segment} onChange={(e) => setFormData({ ...formData, segment: e.target.value })} className="w-full" fullWidth>
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.itemName}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="mb-4">
          <TextField id="auditable" label="Auditable" variant="outlined" select value={formData.auditable} onChange={(e) => setFormData({ ...formData, auditable: e.target.value })} className="w-full" fullWidth>
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </TextField>
        </div>
        <div className="mb-4">
          <TextField id="tax" label="Tax (%)" variant="outlined" type="number" value={formData.tax} onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) })} className="w-full" fullWidth />
        </div>
        <div className="mb-4">
          <TextField id="stock" label="Initial Stock" variant="outlined" type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })} className="w-full" fullWidth />
        </div>
        <div className="mb-4">
          <TextField id="quantityUnit" label="Quantity Unit" variant="outlined" select value={formData.quantityUnit} onChange={(e) => setFormData({ ...formData, quantityUnit: e.target.value })} className="w-full" fullWidth>
            <MenuItem value="pieces">Pieces</MenuItem>
            <MenuItem value="kgs">Kgs</MenuItem>
            <MenuItem value="grams">Grams</MenuItem>
            <MenuItem value="litres">Litres</MenuItem>
          </TextField>
        </div>
        <div className="flex justify-end space-x-2 mt-6">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={!isFormValid() || isSubmitting} className={`bg-blue-500 text-white px-4 py-2 rounded ${(!isFormValid() || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {initialData ? 'Update' : 'Add'} Item
          </button>
        </div>
      </div>
    </div>
  );
};