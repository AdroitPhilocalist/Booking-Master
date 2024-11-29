import React from 'react'
import { Calendar, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { Footer } from '@/app/_components/Footer'
import Navbar from '@/app/_components/Navbar'

const TableHeader = ({ children }) => (
  <th className="border px-2 py-1 bg-amber-200 text-amber-800">{children}</th>
)

export default function BookingPayments() {
  const navItems = ['Master', 'Property', 'Profile', 'Business', 'Booking', 'Accounts', 'Restaurant', 'Services', 'Inventory', 'Housekeeping', 'Staff']

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Navigation */}
      <Navbar />
      
      {/* Main Content */}
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Booking Master Control Panel</h1>
        
        <div className="bg-amber-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Calendar className="mr-2" /> Booking Payments
          </h2>
          <div className="flex items-center space-x-2 mb-4">
            <span>Start Date</span>
            <input type="date" className="border rounded px-2 py-1" defaultValue="2024-09-09" />
            <button className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
            <Download className="mr-2" /> Excel Export
          </button>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <TableHeader>#</TableHeader>
                <TableHeader>Receipt #</TableHeader>
                <TableHeader>Added On/By</TableHeader>
                <TableHeader>Edited On/By</TableHeader>
                <TableHeader>Booking Code</TableHeader>
                <TableHeader>Guest Name</TableHeader>
                <TableHeader>Guest Phone</TableHeader>
                <TableHeader>Rooms</TableHeader>
                <TableHeader>Pay Mode</TableHeader>
                <TableHeader>Amount</TableHeader>
                <TableHeader>Action</TableHeader>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={11} className="border px-4 py-2 text-center text-gray-500">
                  No data available in table
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div>Showing 0 to 0 of 0 entries</div>
          <div className="flex space-x-2">
            <button className="border rounded px-3 py-1 bg-amber-200 text-cyan-800">
              <ChevronLeft size={18} />
            </button>
            <button className="border rounded px-3 py-1 bg-amber-200 text-cyan-800">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}