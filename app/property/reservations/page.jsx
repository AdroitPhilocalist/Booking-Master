import React from 'react'
import { Calendar, Download, Plus, Search, Edit, Eye } from 'lucide-react'
import Navbar from '@/app/_components/Navbar'
import { Footer } from '@/app/_components/Footer'

const TableHeader = ({ children }) => (
    <th className="border px-2 py-1 bg-amber-200 text-amber-800">{children}</th>
)

const TableCell = ({ children }) => (
    <td className="border px-2 py-1">{children}</td>
)

const ActionButton = ({ icon: Icon, color }) => (
    <button className={`p-1 rounded ${color} text-white mr-1`}>
        <Icon size={16} />
    </button>
)


const bookings = [
    { id: 1, code: 'BX51705F0BFBF', guest: 'Soumen Sengupta', bookingPoint: 'Sujoy Roy Chakraborty', bookingType: 'FIT Walk-In', roomNo: '303', checkIn: '09-Sep-24', checkOut: '11-Sep-24', bookedOn: '08-Sep-24', pax: 'Adults: 4 Children: 0', mealPlan: 'EP', notes: '', status: 'Confirmed' },
    { id: 2, code: 'BX561033BD4AA', guest: 'A BIDAWAT', bookingPoint: 'Super Admin', bookingType: 'FIT Booking Engine', roomNo: '205', checkIn: '09-Sep-24', checkOut: '11-Sep-24', bookedOn: '08-Sep-24', pax: 'Adults: 2 Children: 0', mealPlan: 'EP', notes: 'Auto Created by Booking Engine', status: 'Confirmed' },
    { id: 3, code: 'BX5D5A0DBD4E3', guest: 'Narendra Singh', bookingPoint: 'Sujoy Roy Chakraborty', bookingType: 'FIT Walk-In', roomNo: '205,303', checkIn: '08-Sep-24', checkOut: '09-Sep-24', bookedOn: '08-Sep-24', pax: 'Adults: 4 Children: 0', mealPlan: 'EP', notes: 'Room Decoration', status: 'Confirmed' },
    { id: 4, code: 'BX5A4B6643421', guest: 'Rimi Goswami', bookingPoint: 'Super Admin', bookingType: 'FIT Booking Engine', roomNo: '203', checkIn: '08-Sep-24', checkOut: '14-Sep-24', bookedOn: '08-Sep-24', pax: 'Adults: 2 Children: 0', mealPlan: 'EP', notes: 'Auto Created by Booking Engine', status: 'Checked In' },
    { id: 5, code: 'BX561F2AED816', guest: 'AMIT', bookingPoint: 'Krishna Saha', bookingType: 'FIT Walk-In', roomNo: '403', checkIn: '07-Sep-24', checkOut: '10-Sep-24', bookedOn: '07-Sep-24', pax: 'Adults: 1 Children: 0', mealPlan: 'EP', notes: '', status: 'Checked In' },
    // Add more booking data here...
]

export default function BookingList() {
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
                        <Calendar className="mr-2" /> Booking List
                    </h2>
                    <div className="flex items-center space-x-2 mb-4">
                        <span>Start Date</span>
                        <input type="date" className="border rounded px-2 py-1" defaultValue="2024-09-01" />
                        <span>End Date</span>
                        <input type="date" className="border rounded px-2 py-1" defaultValue="2024-09-30" />
                        <button className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                            <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center">
                                <Plus className="mr-2" /> Add New
                            </button>
                            <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
                                <Download className="mr-2" /> Excel Export
                            </button>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">Display</span>
                            <select className="border rounded px-2 py-1 mr-2">
                                <option>15</option>
                            </select>
                            <span>records</span>
                        </div>
                        <div className="flex items-center">
                            <span className="mr-2">Search:</span>
                            <input type="text" className="border rounded px-2 py-1" />
                        </div>
                    </div>
                </div>

                {/* Booking Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <TableHeader>#</TableHeader>
                                <TableHeader>Booking Code</TableHeader>
                                <TableHeader>Guest</TableHeader>
                                <TableHeader>Booking Point</TableHeader>
                                <TableHeader>Booking Type</TableHeader>
                                <TableHeader>Room No.</TableHeader>
                                <TableHeader>Check In/Out</TableHeader>
                                <TableHeader>Booked On</TableHeader>
                                <TableHeader>Pax</TableHeader>
                                <TableHeader>Meal Plan</TableHeader>
                                <TableHeader>Notes</TableHeader>
                                <TableHeader>Status</TableHeader>
                                <TableHeader>Action</TableHeader>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking, index) => (
                                <tr key={booking.id} className={index % 2 === 0 ? 'bg-amber-50' : 'bg-white'}>
                                    <TableCell>{booking.id}</TableCell>
                                    <TableCell>{booking.code}</TableCell>
                                    <TableCell>{booking.guest}</TableCell>
                                    <TableCell>{booking.bookingPoint}</TableCell>
                                    <TableCell>{booking.bookingType}</TableCell>
                                    <TableCell>{booking.roomNo}</TableCell>
                                    <TableCell>{`${booking.checkIn} ${booking.checkOut}`}</TableCell>
                                    <TableCell>{booking.bookedOn}</TableCell>
                                    <TableCell>{booking.pax}</TableCell>
                                    <TableCell>{booking.mealPlan}</TableCell>
                                    <TableCell>{booking.notes}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded ${booking.status === 'Confirmed' ? 'bg-green-200 text-green-800' : booking.status === 'Checked In' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>
                                            {booking.status}
                                        </span>

                                    </TableCell>
                                    <TableCell>
                                        <ActionButton icon={Eye} color="bg-amber-500" />
                                        <ActionButton icon={Edit} color="bg-blue-500" />
                                    </TableCell>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                    <div>Showing 1 to 15 of 63 entries</div>
                    <div className="flex space-x-2">
                        <button className="border rounded px-3 py-1">1</button>
                        <button className="border rounded px-3 py-1">2</button>
                        <button className="border rounded px-3 py-1">3</button>
                        <button className="border rounded px-3 py-1">4</button>
                        <button className="border rounded px-3 py-1">5</button>
                        <button className="border rounded px-3 py-1">Next</button>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div >
    )
}