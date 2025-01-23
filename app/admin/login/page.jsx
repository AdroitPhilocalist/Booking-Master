// app/admin/login/page.jsx
"use client";
import Image from "next/image";
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
import { useEffect, useState } from 'react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    setTimestamp(new Date().getFullYear());
  }, []);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Important: This ensures cookies are sent with the request
      });
      const data = await response.json();
      console.log('Login response:', data);
      if (data.success) {
        router.push("/admin/dashboard");
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

      <div className="flex items-center flex-col justify-center min-h-screen bg-gradient-to-br from-cyan-700 to-cyan-600">
        <div className="mb-8">
          <Image
            src="/Hotel-Logo.png"
            alt="BookingMaster.in"
            width={300}
            height={60}
            priority
          />
        </div>
        {/* <Image
            src="/Hotel-Logo.png"
            alt="BookingMaster.in"
            width={300}
            height={60}
            priority
          /> */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">

          <h2 className="text-3xl font-bold mb-6 text-center text-cyan-900">Admin Login</h2>
          <FormControl fullWidth variant="outlined" className="mb-4">
            <InputLabel>Username</InputLabel>
            <OutlinedInput
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" className="mb-4">
            <InputLabel>Password</InputLabel>
            <OutlinedInput
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end" >
                  <IconButton
                    aria-label="toggle password visibility"
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
          <button type="submit" className="bg-cyan-700 text-white px-4 py-2 shadow-sm rounded mb-4 mt-3 w-full">
            SUBMIT
          </button>
          <Link href="/admin/login" className="text-blue-500 hover:text-blue-700">
            Forgot Password?
          </Link>
          {/* <p className="text-center mt-4 text-gray-500">
            © {timestamp}, Hotel Booking. All Rights Reserved.
          </p> */}
        </form>


        <div className="mt-8 text-center text-white text-sm">
          © {timestamp}, Hotel Booking. All Rights Reserved.
        </div>
      </div>

      {/* <p className="text-center mt-4 text-gray-500">
            © {timestamp}, Hotel Booking. All Rights Reserved.
          </p> */}
    </main >



  );
}