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
import { getCookie } from 'cookies-next'; // Import getCookie from cookies-next
import { jwtVerify } from 'jose'; // Import jwtVerify for decoding JWT
import { useEffect, useState } from 'react';

export default function Home() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [timestamp, setTimestamp] = useState(null);
  const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

  useEffect(() => {
    setTimestamp(new Date().getFullYear());
    const checkProfileCompletion = async () => {
      const token = getCookie('authToken');
      if (token) {
        try {
          const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
          const userId = decoded.payload.id;
          const profileResponse = await fetch(`/api/Profile/${userId}`);
          const profileData = await profileResponse.json();
          if (profileData.success && profileData.data) {
            const profileComplete = profileData.data.Profile_Complete;
            if (profileComplete === 'no') {
              router.push("/master/profile");
            } else {
              router.push("/property/roomdashboard");
            }
          }
        } catch (error) {
          console.error("Error verifying token or fetching profile:", error);
          router.push('/');
        }
      }
    };
    checkProfileCompletion();
  }, [router]);

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
      setIsLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Important: This ensures cookies are sent with the request
      });
      const data = await response.json();
      if (data.success) {
        const token = getCookie('authToken');
        if (token) {
          const decoded = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
          const userId = decoded.payload.id;
          const profileResponse = await fetch(`/api/Profile/${userId}`);
          const profileData = await profileResponse.json();
          if (profileData.success && profileData.data) {
            const profileComplete = profileData.data.Profile_Complete;
            if (profileComplete === 'no') {
              router.push("/master/profile");
            } else {
              router.push("/property/roomdashboard");
            }
          }
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Failed to log in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-700 to-cyan-600">
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
              <span className="mt-4 text-gray-700">Signing In...</span>
            </div>
          </div>
        )}
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
          © {timestamp}, Hotel Booking. All Rights Reserved.
        </div>
      </div>
    </main>
  );
}