'use client';

import React, { useState } from 'react';
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
import { useRouter } from 'next/navigation';
const users = [
  { name: "Booking.Com", property: "Hotel Raj International", email: "abcdefg@gmail.com", phone: "2222222222", userType: "Online" },
  { name: "Go-ibibo", property: "Hotel Raj International", email: "abcdefg@gmail.com", phone: "1111111111", userType: "Online" },
  { name: "Make My Trip", property: "Hotel Raj International", email: "abcdefg@gmail.com", phone: "0000000000", userType: "Online" },
  // Add more user data here...
];

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
  const handleAddNew = () => {
    router.push('users/addUser');
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
                  <TableRow >
                    <TableCell>Name</TableCell>
                    <TableCell>Property</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>User Type</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.property}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.userType}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ marginRight: 1 }}
                        >
                          Active
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
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
      <Footer />
    </div>
  );
}
