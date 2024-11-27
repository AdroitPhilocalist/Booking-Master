'use client'

import { useState } from 'react'
import Navbar from '@/app/_components/Navbar'
import { Footer } from '@/app/_components/Footer'

const users = [
    { name: "Booking.Com", property: "Hotel Raj International", email: "abcdefg@gmail.com", phone: "2222222222", userType: "Online" },
    { name: "Go-ibibo", property: "Hotel Raj International", email: "abcdefg@gmail.com", phone: "1111111111", userType: "Online" },
    { name: "Make My Trip", property: "Hotel Raj International", email: "abcdefg@gmail.com", phone: "0000000000", userType: "Online" },
    // Add more user data here...
]

export default function Page() {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredUsers = users.filter(user =>
        Object.values(user).some(value =>
            value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    return (
        <div className="flex flex-col min-h-screen bg-amber-50">
            <Navbar />
            <main className="flex-grow p-8">
                <h1 className="text-2xl font-semibold mb-4">Booking Master Control Panel</h1>
                <div className="bg-white shadow rounded-lg">
                    <div className="bg-cyan-900 p-4 rounded-t-lg">
                        <h2 className="text-lg font-semibold text-white">Users</h2>
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">Add New +</button>
                            <div className="flex items-center space-x-2">
                                <span>Display</span>
                                <select className="border rounded p-1">
                                    <option>All</option>
                                </select>
                                <span>records</span>
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    className="ml-4 border rounded p-1"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="px-4 py-2 text-left">Name</th>
                                        <th className="px-4 py-2 text-left">Property</th>
                                        <th className="px-4 py-2 text-left">Email</th>
                                        <th className="px-4 py-2 text-left">Phone</th>
                                        <th className="px-4 py-2 text-left">User Type</th>
                                        <th className="px-4 py-2 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="px-4 py-2">{user.name}</td>
                                            <td className="px-4 py-2">{user.property}</td>
                                            <td className="px-4 py-2">{user.email}</td>
                                            <td className="px-4 py-2">{user.phone}</td>
                                            <td className="px-4 py-2">{user.userType}</td>
                                            <td className="px-4 py-2">
                                                <button className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded mr-1">Active</button>
                                                <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded">Edit</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}