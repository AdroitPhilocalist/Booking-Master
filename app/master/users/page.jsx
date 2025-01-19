'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../../_components/Navbar';
import { Footer } from '../../_components/Footer';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  MenuItem,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputLabel,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Page() {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/User');
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          toast.error('Failed to fetch users.');
        }
      } catch (error) {
        toast.error('Error fetching users.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleOpenDialog = (userId) => {
    setSelectedUser(userId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleDeleteUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete(`/api/User/${selectedUser}`);
      if (response.data.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== selectedUser));
        setOpenDialog(false);
        toast.success('User deleted successfully!',
          {  //success toaster
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",

          });

      } else {
        toast.error('Failed to delete user.'
          , {   //error toaster
            position: "top-right", 
            autoClose: 5000, 
            hideProgressBar: false, 
            closeOnClick: true, 
            pauseOnHover: true, 
            draggable: true, 
            progress: undefined, 
            theme: "dark", 
          });

      }
    } catch (error) {
      toast.error('Error deleting user.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    router.push('users/addUser');
   // toast.success('Redirecting to add new user page!');
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    setSelectedUser({
      ...selectedUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch(`/api/User/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedUser),
      });
      const data = await response.json();

      if (data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id ? selectedUser : user
          )
        );
        handleClose();
        toast.success('User updated successfully!');
      } else {
        toast.error('Failed to update user.');
      }
    } catch (error) {
      toast.error('Error updating user.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      <Navbar />
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
            <span className="mt-4 text-gray-700">Loading Users...</span>
          </div>
        </div>
      )}
      <main className="flex-grow p-8">
        <h1 className="text-3xl font-semibold mb-4 text-cyan-900 ml-4">Booking Master Control Panel</h1>
        <div className="rounded-lg">
          <div className="p-4 rounded-t-lg text-2xl">
            <h2 className="text-2xl font-semibold text-cyan-900">Users</h2>
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <Button variant="contained" color="success" onClick={handleAddNew}>
                Add New +
              </Button>
              <div className="flex items-center space-x-4">
                <span>Display</span>
                <Select defaultValue="All" size="small" variant="outlined">
                  <MenuItem value="All">All</MenuItem>
                </Select>
                <span>records</span>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", color: "#28bfdb" }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#28bfdb" }}>Property</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#28bfdb" }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#28bfdb" }}>Phone</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#28bfdb" }}>User Type</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#28bfdb" }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.property}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.userType}</TableCell>
                      <TableCell>
                        {/* <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ marginRight: 1 }}
                        >
                          Active
                        </Button> */}
                        {/* <Button
  variant="contained"
  color="primary"
  size="small"
  onClick={() => handleOpenEdit(user)}
  sx={{ marginRight: 2 }} // Adds right margin to space it from the next button
>
  Edit
</Button> */}
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenEdit(user)}
                        >
                          <Edit />
                        </IconButton>
                        {/* <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleOpenDialog(user._id)}
                          sx={{ marginLeft: 1 }} // Adds left margin to space it from the previous button
                        >
                          Delete
                        </Button> */}
                        <IconButton
                          color="secondary"
                          onClick={() => handleOpenDialog(user._id)}
                        >
                          <Delete />
                        </IconButton>


                        {/* Confirmation Dialog */}
                        <Dialog open={openDialog} onClose={handleCloseDialog}>
                          <DialogTitle>Confirm Deletion</DialogTitle>
                          <DialogContent>
                            <p>Are you sure you want to delete this user?</p>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleCloseDialog} color="primary">
                              Cancel
                            </Button>
                            <Button onClick={handleDeleteUser} color="secondary">
                              Confirm
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </main>

      {/* Edit User Modal */}
      {/* Edit User Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" // Increased width to 'md' for a wider layout
        fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <TextField
                label="Name"
                name="name"
                value={selectedUser?.name || ''}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
                variant="outlined"
              />
            </div>
            <div className="mb-4">
              <TextField
                label="Property"
                name="property"
                value={selectedUser?.property || ''}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
                variant="outlined"
              />
            </div>
            <div className="mb-4">
              <TextField
                label="Email"
                name="email"
                value={selectedUser?.email || ''}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
                variant="outlined"
              />
            </div>
            <div className="mb-4">
              <TextField
                label="Phone"
                name="phone"
                value={selectedUser?.phone || ''}
                onChange={handleChange}
                fullWidth
                required
                margin="dense"
                variant="outlined"
              />
            </div>
            <div className="mb-4">
              <InputLabel id="UserTypeLabel" className="mb-2">
                User Type
              </InputLabel>
              <Select
                label="User Type"
                name="userType"
                id="UserType"
                value={selectedUser?.userType || ''}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
              >
                <MenuItem value="Online">Online</MenuItem>
                <MenuItem value="Offline">Offline</MenuItem>
              </Select>
            </div>
            <DialogActions className="mt-4">
              <Button
                onClick={handleClose}
                color="error"
                variant="contained"
                size="large"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                color="success"
                variant="contained"
                size="large"
              >
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>


      <Footer />
    </div>
  );
}
