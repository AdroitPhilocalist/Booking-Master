import React from 'react'
import { ChevronLeft, ChevronRight, User } from 'lucide-react'
import Navbar from '@/app/_components/Navbar'
import { Footer } from '@/app/_components/Footer'

const AvailabilityRow = ({ room, availabilities }) => (
    <tr>
        <td className="border px-4 py-2 bg-amber-200">{room}</td>
        {availabilities.map((availability, index) => (
            <td key={index} className={`border px-4 py-2 ${index % 2 === 0 ? 'bg-amber-50' : 'bg-amber-100'}`}>
                {availability}
            </td>
        ))}
    </tr>
)


export default function StayOverview() {

    const dates = ['8th Sep (Sun)', '9th Sep (Mon)', '10th Sep (Tue)', '11th Sep (Wed)', '12th Sep (Thu)', '13th Sep (Fri)', '14th Sep (Sat)']

    const roomData = [
        { name: 'Total', availabilities: ['15 Available', '20 Available', '21 Available', '24 Available', '24 Available', '24 Available', '25 Available'] },
        { name: 'SR', availabilities: ['6 Available', '7 Available', '7 Available', '7 Available', '7 Available', '7 Available', '7 Available'] },
        { name: '202', availabilities: ['', '', '', '', '', '', ''] },
        { name: '301', availabilities: ['', '', '', '', '', '', ''] },
        { name: '302', availabilities: ['', '', '', '', '', '', ''] },
        { name: '401', availabilities: ['', '', '', '', '', '', ''] },
        { name: '402', availabilities: ['', '', '', '', '', '', ''] },
        { name: '501', availabilities: ['', '', '', '', '', '', ''] },
        { name: '502', availabilities: ['', '', '', '', '', '', ''] },
        { name: 'ADR', availabilities: ['3 Available', '7 Available', '8 Available', '11 Available', '11 Available', '11 Available', '12 Available'] },
    ]

    return (
        <div className="min-h-screen bg-amber-50">
            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">STAY OVERVIEW</h1>

                {/* Date Selector and Buttons */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                        <button className="p-2 bg-amber-200 rounded"><ChevronLeft /></button>
                        <input type="date" className="border rounded px-2 py-1" defaultValue="2024-09-09" />
                        <button className="p-2 bg-amber-200 rounded"><ChevronRight /></button>
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 bg-amber-300 text-amber-800 rounded">ROOM DASHBOARD</button>
                        <button className="px-4 py-2 bg-amber-400 text-amber-900 rounded">CHANNEL MANAGER</button>
                        <button className="px-4 py-2 bg-amber-500 text-white rounded">+ NEW BOOKING</button>
                        <button className="px-4 py-2 bg-amber-600 text-white rounded">MAIN DASHBOARD</button>
                    </div>
                </div>

                {/* Availability Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2 bg-amber-300">SEP 2024</th>
                                {dates.map((date, index) => (
                                    <th
                                        key={index}
                                        className={`border px-4 py-2 ${index === 2 ? 'bg-green-200' : index === 5 ? 'bg-orange-200' : 'bg-amber-200'}`}
                                    >
                                        {date}
                                    </th>
                                ))}
                            </tr>

                        </thead>
                        <tbody>
                            {roomData.map((room, index) => (
                                <AvailabilityRow key={index} room={room.name} availabilities={room.availabilities} />
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Guest Information */}
                <div className="mt-4">
                    <div className="flex items-center space-x-2 bg-amber-100 p-2 rounded">
                        <User className="text-amber-600" />
                        <span className="font-bold">AYUB</span>
                        <span className="text-sm text-gray-600">9861434811 | CP</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-red-100 p-2 rounded mt-2">
                        <User className="text-red-600" />
                        <span className="font-bold">RIMI GOSWAMI</span>
                        <span className="text-sm text-gray-600">9073492913 | CP</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    )
}