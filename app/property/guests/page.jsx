'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from "@/app/_components/Navbar";
import { Footer } from "@/app/_components/Footer";

export default function GuestList() {

    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the guest data
    useEffect(() => {
        const fetchGuests = async () => {
            try {
                const response = await fetch('/api/NewBooking');
                const data = await response.json();

                if (data.success) {
                    setGuests(data.data); // Assuming the data array contains guest bookings
                } else {
                    setError('Failed to load guest data');
                }
            } catch (err) {
                setError('Error fetching guests');
            } finally {
                setLoading(false);
            }
        };

        fetchGuests();
    }, []);

    // Handle delete guest
    const handleDelete = async (id) => {
        // You would implement the delete API call here, e.g., using fetch:
        // await fetch(`/api/NewBooking/${id}`, { method: 'DELETE' });
        console.log(`Delete guest with ID: ${id}`);
    };

    // Handle edit guest
    const handleEdit = (id) => {
        // Navigate to an edit page or open a modal for editing
        console.log(`Edit guest with ID: ${id}`);
    };

    // Handle activating a guest (e.g., marking as active)
    const handleActivate = (id) => {
        console.log(`Activate guest with ID: ${id}`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="min-h-screen bg-amber-50">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h1 className="text-2xl font-semibold text-cyan-800 mb-4">Booking Master Control Panel</h1>
                        <div className="mb-4">
                            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                                View Police Report
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-amber-200">
                                <thead className="bg-cyan-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Mobile</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Address</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-amber-200">
                                    {guests.map((guest) => (
                                        <tr key={guest._id} className='bg-gray-50'>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-cyan-900">{guest.guestName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-900">{guest.mobileNo}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-900">{guest.guestEmail}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-900">{guest.address}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded mr-2">
                                                    Active
                                                </button>
                                                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded mr-2">
                                                    Edit
                                                </button>
                                                <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <button className="relative inline-flex items-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-cyan-700 bg-white hover:bg-amber-50">
                                    Previous
                                </button>
                                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-md text-cyan-700 bg-white hover:bg-amber-50">
                                    Next
                                </button>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-cyan-700">
                                        Showing <span className="font-medium">1</span> to <span className="font-medium">15</span> of{' '}
                                        <span className="font-medium">2,159</span> results
                                    </p>
                                </div>
                                <div>
                                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                        <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-amber-300 bg-white text-sm font-medium text-amber-500 hover:bg-amber-50">
                                            <span className="sr-only">Previous</span>
                                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                        <button className="relative inline-flex items-center px-4 py-2 border border-amber-300 bg-white text-sm font-medium text-cyan-700 hover:bg-amber-50">
                                            1
                                        </button>
                                        <button className="relative inline-flex items-center px-4 py-2 border border-amber-300 bg-white text-sm font-medium text-cyan-700 hover:bg-amber-50">
                                            2
                                        </button>
                                        <button className="relative inline-flex items-center px-4 py-2 border border-amber-300 bg-white text-sm font-medium text-cyan-700 hover:bg-amber-50">
                                            3
                                        </button>
                                        <span className="relative inline-flex items-center px-4 py-2 border border-amber-300 bg-white text-sm font-medium text-cyan-700">
                                            ...
                                        </span>
                                        <button className="relative inline-flex items-center px-4 py-2 border border-amber-300 bg-white text-sm font-medium text-cyan-700 hover:bg-amber-50">
                                            144
                                        </button>
                                        <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-amber-300 bg-white text-sm font-medium text-amber-500 hover:bg-amber-50">
                                            <span className="sr-only">Next</span>
                                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                        </button>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}