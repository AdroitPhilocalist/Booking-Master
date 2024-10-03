import React from 'react'
import { Calendar, Download, Home } from 'lucide-react'
import Navbar from '@/app/_components/Navbar'
import { Footer } from '@/app/_components/Footer'

const SidebarItem = ({ icon: Icon, title }) => (
  <div className="flex items-center space-x-2 p-2 hover:bg-amber-100 rounded">
    <Icon size={18} className="text-amber-600" /> {/* Use the passed icon */}
    <span>{title}</span> {/* Use the passed title */}
  </div>
)
const BookingTable = ({ title, bookings }) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold bg-amber-200 p-2 rounded-t">{title}</h3>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-amber-100">
            <th className="border px-4 py-2">Booking Code</th>
            <th className="border px-4 py-2">Guest</th>
            <th className="border px-4 py-2">Room No.</th>
            <th className="border px-4 py-2">Check In</th>
            <th className="border px-4 py-2">Check Out</th>
            <th className="border px-4 py-2">Pax Adult</th>
            <th className="border px-4 py-2">Pax Child</th>
            <th className="border px-4 py-2">Meal Plan</th>
            <th className="border px-4 py-2">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-amber-50' : 'bg-white'}>
              <td className="border px-4 py-2 text-blue-600">{booking.code}</td>
              <td className="border px-4 py-2">{booking.guest}</td>
              <td className="border px-4 py-2">{booking.room}</td>
              <td className="border px-4 py-2">{booking.checkIn}</td>
              <td className="border px-4 py-2">{booking.checkOut}</td>
              <td className="border px-4 py-2">{booking.paxAdult}</td>
              <td className="border px-4 py-2">{booking.paxChild}</td>
              <td className="border px-4 py-2">{booking.mealPlan}</td>
              <td className="border px-4 py-2">{booking.remarks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="bg-amber-100 p-2 rounded-b">
      <span className="font-semibold">Rooms: {bookings.length}</span>
      <span className="ml-4 font-semibold">Adults: {bookings.reduce((sum, b) => sum + b.paxAdult, 0)}</span>
      <span className="ml-4 font-semibold">Children: {bookings.reduce((sum, b) => sum + b.paxChild, 0)}</span>
    </div>
  </div>
)

export default function BookingManagement() {

  const checkInGuests = [
    { code: 'BX561033BD4AA', guest: 'A.BIDAWAT', room: '205', checkIn: '09-Sep-2024 12:00 PM', checkOut: '11-Sep-2024 10:00 AM', paxAdult: 2, paxChild: 2, mealPlan: 'EP', remarks: 'EP: Adults - 4 Children - 0' },
    { code: 'BX51705F0BFBF', guest: 'Soumen Sengupta', room: '303', checkIn: '09-Sep-2024 12:00 PM', checkOut: '11-Sep-2024 10:00 AM', paxAdult: 2, paxChild: 2, mealPlan: 'EP', remarks: 'EP: Adults - 4 Children - 0' },
  ]

  const stayingGuests = [
    { code: 'BX5AB09D5B811', guest: 'Agent Booking', room: '204', checkIn: '05-Sep-2024 12:00 PM', checkOut: '11-Sep-2024 10:00 AM', paxAdult: 0, paxChild: 0, mealPlan: '', remarks: '' },
    { code: 'BX561F2AED816', guest: 'AMIT', room: '403', checkIn: '07-Sep-2024 10:54 AM', checkOut: '10-Sep-2024 10:00 AM', paxAdult: 1, paxChild: 0, mealPlan: 'EP', remarks: 'EP: Adults - 1 Children - 0' },
    { code: 'BX5A4B6643421', guest: 'Rimi Goswami', room: '203', checkIn: '08-Sep-2024 06:57 AM', checkOut: '14-Sep-2024 10:00 AM', paxAdult: 0, paxChild: 0, mealPlan: '', remarks: '' },
  ]

  const checkOutGuests = [
    { code: 'BX5249CD11E92', guest: 'Ram Sen', room: '304, 305', checkIn: '07-Sep-2024 12:00 PM', checkOut: '09-Sep-2024 10:00 AM', paxAdult: 4, paxChild: 2, mealPlan: 'CP', remarks: 'CP: Adults - 4 Children - 2' },
    { code: 'BX5D5A0DBD4E3', guest: 'Narendra Singh', room: '205, 303', checkIn: '08-Sep-2024 12:00 PM', checkOut: '09-Sep-2024 10:00 AM', paxAdult: 4, paxChild: 0, mealPlan: 'EP', remarks: 'EP: Adults - 4 Children - 0' },
  ]

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto p-4 flex">

        {/* Booking Tables */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6">Booking Master Control Panel</h1>
          
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Room List » Booking Wise [Show Room Wise]</h2>
            <div className="flex items-center space-x-2">
              <span>Start Date</span>
              <input type="date" className="border rounded px-2 py-1" defaultValue="2024-09-09" />
              <button className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
            </div>
          </div>

          <button className="mb-4 bg-blue-500 text-white px-4 py-2 rounded flex items-center">
            <Download className="mr-2" /> Excel Export
          </button>

          <BookingTable title="CHECK-IN GUESTS (2)" bookings={checkInGuests} />

          <button className="mb-4 bg-blue-500 text-white px-4 py-2 rounded flex items-center">
            <Download className="mr-2" /> Excel Export
          </button>

          <BookingTable title="STAYING GUESTS (3)" bookings={stayingGuests} />

          <button className="mb-4 bg-blue-500 text-white px-4 py-2 rounded flex items-center">
            <Download className="mr-2" /> Excel Export
          </button>

          <BookingTable title="CHECK-OUT GUESTS (2)" bookings={checkOutGuests} />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}