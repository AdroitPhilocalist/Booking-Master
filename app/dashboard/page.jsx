"use client"
import React from 'react'
import { ChevronLeft, ChevronRight, Calendar, Zap, Grid, BarChart3 } from 'lucide-react'
import { useRouter } from 'next/navigation';
import Navbar from '../_components/Navbar';
import { Footer } from '../_components/Footer';

export default function Dashboard() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto p-4">
        {/* Date Selector */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button className="bg-blue-500 text-white p-2 rounded"><ChevronLeft size={20} /></button>
            <input type="date" className="border p-2 rounded" />
            <button className="bg-blue-500 text-white p-2 rounded"><ChevronRight size={20} /></button>
          </div>
          <div className="flex space-x-2">
            <button className="bg-gray-200 p-2 rounded flex items-center"><Zap size={20} /> Action Required</button>
            <button className="bg-gray-200 p-2 rounded flex items-center"><Grid size={20} /> Room Dashboard</button>
            <button className="bg-gray-200 p-2 rounded flex items-center"><BarChart3 size={20} /> Channel Manager</button>
            <button className="bg-blue-500 text-white p-2 rounded flex items-center"><Calendar size={20} /> Stay Overview</button>
          </div>
        </div>

        {/* Room Availability */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <h2 className="text-xl font-bold mb-2">Room Availability</h2>
          {/* Add room availability table here */}
        </div>

        {/* Arrivals, Occupied Rooms, Departures */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Expected Arrivals (2)</h3>
            {/* Add expected arrivals content */}
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Occupied Rooms (0)</h3>
            <div className="bg-red-100 p-2 rounded">No Occupancy Today</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Expected Departures (0)</h3>
            <div className="bg-yellow-100 p-2 rounded">No Departures Today</div>
          </div>
        </div>

        {/* Statistics and Graphs */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Average Room Rent (9 Sep)</h3>
            <div className="text-3xl font-bold text-blue-500">3,421.82</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow col-span-2">
            <h3 className="font-bold mb-2">Daywise Monthly Sales</h3>
            {/* Add sales graph here */}
          </div>
        </div>
        <h1>etobar bhalo lagena</h1>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}