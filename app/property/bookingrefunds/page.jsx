'use client'

import { Footer } from '@/app/_components/Footer'
import Navbar from '@/app/_components/Navbar'
import { useState } from 'react'

export default function BookingRefundsPage() {
    const [startDate, setStartDate] = useState('2024-09-01')
    const [endDate, setEndDate] = useState('2024-09-30')
    const [searchTerm, setSearchTerm] = useState('')

    return (
        <div className="min-h-screen bg-amber-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-amber-950 p-4 flex items-center">
                        <svg className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-white">Booking Refunds</h2>
                    </div>

                    <div className="p-4 bg-gradient-to-b from-amber-50 to-amber-100">
                        <div className="flex flex-wrap items-end gap-4">
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                            </div>
                            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50">
                                Submit
                            </button>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center">
                                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Excel Export
                            </button>
                            <div className="relative">
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    className="w-64 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <svg className="h-5 w-5 text-gray-400 absolute right-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-amber-100">
                                    <tr>
                                        {['#', 'Date', 'Booking Code', 'Guest Name', 'Guest Phone', 'Rooms', 'Pay Mode', 'Amount', 'Action'].map((header) => (
                                            <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-amber-50 divide-y divide-gray-200">
                                    <tr>
                                        <td colSpan={9} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                                            No data available in table
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-sm text-gray-700">
                                Showing 0 to 0 of 0 entries
                            </span>
                            <div className="flex space-x-2">
                                <button className="px-3 py-1 border rounded hover:bg-gray-100 transition-colors duration-200 text-gray-600" disabled>{'<'}</button>
                                <button className="px-3 py-1 border rounded hover:bg-gray-100 transition-colors duration-200 text-gray-600" disabled>{'>'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}