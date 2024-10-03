import React from 'react'
import { Search, ChevronLeft, ChevronRight, Eye, X, Check } from 'lucide-react'
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


const requests = [
    { id: 'RC5C74D7970FE', guest: 'amit', checkIn: '12-Jul-24', checkOut: '13-Jul-24', bookingDetails: 'Suite Room\n2 Adult, 0 Child\n1 Room(s) x 1 Night(s)\nRoom Tariff: ₹0/-\nAmount: ₹0/-\nGST: ₹0.00', amount: '0.00', requestedOn: '12-Jul-24 07:54AM', status: 'Not Paid' },
    { id: 'RC568F31C7F80', guest: 'Amitava Chatterjee and dipikha', checkIn: '11-Oct-23', checkOut: '13-Oct-23', bookingDetails: 'AC Deluxe Room\n2 Adult, 0 Child\n1 Room(s) x 2 Night(s)\nRoom Tariff: ₹0/-\nAmount: ₹0/-\nGST: ₹0.00', amount: '0.00', requestedOn: '11-Oct-23 06:13AM', status: 'Not Paid' },
    { id: 'RC5AAB3238932', guest: 'Palash Saha', checkIn: '14-Feb-23', checkOut: '15-Feb-23', bookingDetails: 'AC Deluxe Room\n2 Adult, 1 Child\n1 Room(s) x 1 Night(s)\nRoom Tariff: ₹3,000/-\nAmount: ₹3,000/-\nGST: ₹360.00', amount: '3360.00', requestedOn: '14-Feb-23 09:21AM', status: 'Cancelled' },
    // Add more request data here...
]

export default function RequestsList() {
    const navItems = ['Master', 'Property', 'Profile', 'Business', 'Booking', 'Accounts', 'Restaurant', 'Services', 'Inventory', 'Housekeeping', 'Staff']

    return (
        <div className="min-h-screen bg-amber-50">
            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Booking Master Control Panel</h1>

                <div className="bg-amber-100 p-4 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold mb-4">Requests List</h2>
                    <div className="flex justify-between items-center mb-4">
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
                </div>

                {/* Requests Table */}
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <TableHeader>Provisional ID</TableHeader>
                                <TableHeader>Guest</TableHeader>
                                <TableHeader>Check In/Out</TableHeader>
                                <TableHeader>Booking Details</TableHeader>
                                <TableHeader>Amount</TableHeader>
                                <TableHeader>Requested On</TableHeader>
                                <TableHeader>Status</TableHeader>
                                <TableHeader>Action</TableHeader>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request, index) => (
                                <tr key={request.id} className={index % 2 === 0 ? 'bg-amber-50' : 'bg-white'}>
                                    <TableCell>{request.id}</TableCell>
                                    <TableCell>{request.guest}</TableCell>
                                    <TableCell>{`${request.checkIn}\n${request.checkOut}`}</TableCell>
                                    <TableCell><pre className="whitespace-pre-wrap">{request.bookingDetails}</pre></TableCell>
                                    <TableCell>{request.amount}</TableCell>
                                    <TableCell>{request.requestedOn}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded ${request.status === 'Not Paid' ? 'bg-red-200 text-red-800' : request.status === 'Cancelled' ? 'bg-gray-200 text-gray-800' : 'bg-green-200 text-green-800'}`}>
                                            {request.status}
                                        </span>

                                    </TableCell>
                                    <TableCell>
                                        <ActionButton icon={Eye} color="bg-amber-500" />
                                        <ActionButton icon={X} color="bg-red-500" />
                                        <ActionButton icon={Check} color="bg-green-500" />
                                    </TableCell>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center mt-4">
                    <div>Showing 1 to 15 of 15 entries</div>
                    <div className="flex space-x-2">
                        <button className="border rounded px-3 py-1 bg-amber-200 text-amber-800">
                            <ChevronLeft size={18} />
                        </button>
                        <button className="border rounded px-3 py-1 bg-amber-200 text-amber-800">1</button>
                        <button className="border rounded px-3 py-1 bg-amber-200 text-amber-800">2</button>
                        <button className="border rounded px-3 py-1 bg-amber-200 text-amber-800">
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