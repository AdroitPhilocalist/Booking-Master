import React from 'react'
import { ChevronLeft, ChevronRight, Zap, Plus, Search } from 'lucide-react'
import Navbar from '@/app/_components/Navbar'

export default function ScheduledMessages() {
  const messages = [
    { type: 'On Booking (Immediate)', time: '12:00 AM', title: 'Guest Feedback', text: 'Hello', lastRun: 'N/A', status: 'Inactive' },
    { type: 'On Check-Out (Immediate)', time: '12:00 AM', title: 'c/out immediate', text: 'thanks for coming', lastRun: 'N/A', status: 'Inactive' },
    { type: 'On Check-In (Immediate)', time: '11:15 AM', title: 'Welcome to Raj International', text: 'Raj International is a Prestigious hotel in Manadarmoni.', lastRun: 'N/A', status: 'Inactive' },
    { type: 'On Booking (Immediate)', time: '08:00 PM', title: 'On Booking Guest Note', text: 'We look forward to welcoming you to the Hotel Raj International . Feel free to text or call us at (1234567890) this number if there is anything we can do before, during or after your stay. As a friendly reminder, check-in time starts at 12 pm. If you plan to arrive after 10 am, please let us know so we can prepare as well as possible for you.', lastRun: 'N/A', status: 'Active' },
    { type: 'Day 1 (Same Day as Check-In)', time: '04:30 PM', title: 'Evening Snacks', text: 'Todays Special Menu. Try our Special Dishes now.', lastRun: '08-09-2024 04:30 PM', status: 'Active' },
    { type: 'On Check-In (Immediate)', time: '12:00 AM', title: 'Chk in Messages', text: 'Test Check in Messages.', lastRun: 'N/A', status: 'Inactive' },
    { type: 'On Booking (Immediate)', time: '11:00 AM', title: 'On Booking Welcome Message', text: 'Welcome to Hotel Raj International. This is a Test On Booking Message.', lastRun: 'N/A', status: 'Inactive' },
  ]

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto p-4">
        {/* Breadcrumb */}
        <h1 className="text-3xl font-bold mb-6">Booking Master Control Panel</h1>

        {/* Scheduled Message Section */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="bg-amber-950 text-white p-4 rounded-t-lg flex items-center">
            <Zap className="mr-2" />
            <h2 className="text-xl font-semibold">Scheduled Message</h2>
          </div>

          <div className="p-4">
            {/* Add New Button and WhatsApp Balance */}
            <div className="flex justify-between mb-4">
              <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center">
                <Plus className="mr-2" /> Add New
              </button>
              <div className="text-amber-600">WhatsApp Balance - 3336</div>
            </div>

            {/* Display and Search */}
            <div className="flex justify-between mb-4">
              <div className="flex items-center">
                <span className="mr-2">Display</span>
                <select className="border rounded px-2 py-1">
                  <option>15</option>
                </select>
                <span className="ml-2">records</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">Search:</span>
                <input type="text" className="border rounded px-2 py-1" />
              </div>
            </div>

            {/* Table */}
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-amber-100">
                  <th className="border p-2 text-left">Message Type</th>
                  <th className="border p-2 text-left">Scheduled Time</th>
                  <th className="border p-2 text-left">Message Title / Text</th>
                  <th className="border p-2 text-left">Last Run</th>
                  <th className="border p-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-amber-50' : 'bg-white'}>
                    <td className="border p-2">{message.type}</td>
                    <td className="border p-2">{message.time}</td>
                    <td className="border p-2">
                      <div className="font-semibold">{message.title}</div>
                      <div className="text-sm text-gray-600">{message.text}</div>
                    </td>
                    <td className="border p-2">{message.lastRun}</td>
                    <td className="border p-2">
                      <div className={`inline-block px-2 py-1 rounded ${message.status === 'Active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                        {message.status}
                      </div>
                      <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                      <button className="ml-2 bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <div>Showing 1 to 7 of 7 entries</div>
              <div className="flex space-x-2">
                <button className="border rounded px-3 py-1"><ChevronLeft size={18} /></button>
                <button className="border rounded px-3 py-1 bg-amber-950 text-white">1</button>
                <button className="border rounded px-3 py-1"><ChevronRight size={18} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-amber-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          © 2023, Booking Master. All Rights Reserved.
        </div>
      </footer>
    </div>
  )
}