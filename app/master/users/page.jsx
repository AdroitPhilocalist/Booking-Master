'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/app/_components/Navbar';
import { Footer } from '@/app/_components/Footer';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from 'next/navigation';
import axios from 'axios';
export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Store selected user data
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/User');
        const data = await response.json();
        if (data.success) {
          setUsers(data.data);
        } else {
          console.error('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Handle Add New button
  const handleAddNew = () => {
    router.push('users/addUser');
  };

  // Open the edit modal
  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  // Close the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  // Handle form input changes
  const handleChange = (e) => {
    setSelectedUser({
      ...selectedUser,
      [e.target.name]: e.target.value,
    });
  };

  // Handle PUT request to update user details
  const handleSubmit = async (e) => {
    e.preventDefault();
// console.log(selectedUser._id)
    try {
      const response = await fetch(`/api/User/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedUser),
      });
      const data = await response.json();

      if (data.success) {
        // Update the users state after successful update
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id ? selectedUser : user
          )
        );
        handleClose(); // Close the modal after submission
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-amber-50">
      <Navbar />
      <main className="flex-grow p-8">
        <h1 className="text-2xl font-semibold mb-4">Booking Master Control Panel</h1>
        <div className="bg-white shadow rounded-lg">
          <div className="bg-cyan-900 p-4 rounded-t-lg">
            <h2 className="text-lg font-semibold text-white">Users</h2>
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
                    <TableCell>Name</TableCell>
                    <TableCell>Property</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>User Type</TableCell>
                    <TableCell>Action</TableCell>
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
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleOpenEdit(user)}
                        >
                          Edit
                        </Button>
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              value={selectedUser?.name || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Property"
              name="property"
              value={selectedUser?.property || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Email"
              name="email"
              value={selectedUser?.email || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              label="Phone"
              name="phone"
              value={selectedUser?.phone || ''}
              onChange={handleChange}
              fullWidth
              required
            />
            <Select
              label="User Type"
              name="userType"
              value={selectedUser?.userType || ''}
              onChange={handleChange}
              fullWidth
              required
            >
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Offline">Offline</MenuItem>
            </Select>
            <DialogActions>
              <Button onClick={handleClose} color="secondary">Cancel</Button>
              <Button type="submit" color="primary">Save</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
