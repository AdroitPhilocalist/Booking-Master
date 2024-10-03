"use client"
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <main>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-amber-700 to-orange-600">
        <div className="mb-8">
          <Image
            src="/Booking Master logo.png"
            alt="BookingMaster.in"
            width={300}
            height={60}
            priority
          />
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-3xl font-semibold text-center mb-6 text-amber-800">Login</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-amber-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-md text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-amber-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-md text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter your password"
              />
            </div>
            <div>
              <button
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-950 hover:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                onClick={()=> router.push("/hotelpage")}
              >
                SUBMIT
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <Link href="/forgot-password" className="text-sm text-amber-600 hover:text-amber-500">
              Forgot Password?
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-white text-sm">
          © {new Date().getFullYear()}, Booking Master. All Rights Reserved.
        </div>
      </div>
    </main>
  );
}
