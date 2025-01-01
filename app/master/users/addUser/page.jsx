'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, TextField, Grid, Typography, Paper, Box, Container } from '@mui/material';
import { styled } from '@mui/system';
import { useForm } from 'react-hook-form';
import MenuItem from '@mui/material/MenuItem';
import Navbar from '@/app/_components/Navbar';
import { Footer } from '@/app/_components/Footer';
// Custom styling using Material UI's styled API
const FormContainer = styled(Paper)({
  padding: '30px',
  maxWidth: '600px',
  margin: 'auto',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  background: '#f9f9f9',
});
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function AddUser() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch('/api/User', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      
      if (result.success) {
        router.back(); // Navigate back to the user list page
      } else {
        toast.error('Failed to create user');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error occurred while creating user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-amber-50 min-h-screen'>
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
      <Container maxWidth="sm" sx={{ py: 4 }}>
      <FormContainer>
        <Typography variant="h4" gutterBottom align="center">
          Add New User
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                fullWidth
                required
                variant="outlined"
                {...register('name', { required: 'Name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Property"
                fullWidth
                required
                variant="outlined"
                {...register('property', { required: 'Property is required' })}
                error={!!errors.property}
                helperText={errors.property?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                fullWidth
                required
                variant="outlined"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                    message: 'Invalid email address'
                  }
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Phone"
                fullWidth
                required
                variant="outlined"
                {...register('phone', { required: 'Phone number is required' })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="User Type"
                fullWidth
                required
                select
                variant="outlined"
                {...register('userType', { required: 'User type is required' })}
                error={!!errors.userType}
                helperText={errors.userType?.message}
              >
                <MenuItem value="Online">Online</MenuItem>
                <MenuItem value="Offline">Offline</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <Box textAlign="center">
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  type="submit"
                  disabled={loading}
                  size="large"
                >
                  {loading ? 'Submitting...' : 'Add User'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </FormContainer>
    </Container>
    <Footer />
    </div>
  );
}
