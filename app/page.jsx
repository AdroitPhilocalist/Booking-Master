"use client";
import Image from "next/image";
import * as React from 'react';
import Link from "next/link";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { setCookie } from 'cookies-next';

export default function Home() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        // Store the token in a cookie
        setCookie('authToken', data.token, { path: '/' });
        router.push("/hotelpage"); // Navigate to /hotelpage
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to log in');
    }
  };

  return (
    <main>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-700 to-cyan-600">
        <div className="mb-8">
          <Image
            src="/Hotel-Logo.png"
            alt="BookingMaster.in"
            width={300}
            height={60}
            priority
          />
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-3xl font-semibold text-center mb-6 text-cyan-900">Login</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <TextField 
                id="username"
                label="Username" 
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth 
              />
            </div>
            <div>
              <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'hide the password' : 'display the password'}
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>
            </div>
            <div>
              <button
                type="submit" // Change button type to "submit" for form submission
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cyan-700 hover:bg-cyan-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                SUBMIT
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-500">
              Forgot Password?
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-white text-sm">
          © {new Date().getFullYear()}, Hotel Booking. All Rights Reserved.
        </div>
      </div>
    </main>
  );
}