'use client'

import { Footer } from '@/app/_components/Footer'
import Navbar from '@/app/_components/Navbar'
import { ChevronLeft, ChevronRight, Zap, Plus, Search } from 'lucide-react'
import { useState } from 'react'

const companies = [
    { added: '24-07-2024 05:15 AM', name: 'ccvbdb fgmm,vdbgfc', gstin: 'tjhfgnfdhgfv122', phone: 'fm7,,,kgbv', address: 'fjgvg' },
    { added: '08-07-2022 17:04 PM', name: '9903460194', gstin: '', phone: '9903460194', address: 'Vill-Sonamui,Po-Dadanpatrabar,Mandermoni Coastal Penguin Beach Resort' },
    { added: '04-04-2023 21:35 PM', name: 'abc', gstin: '', phone: '8536094864', address: '' },
    { added: '20-12-2023 09:48 AM', name: 'abc', gstin: 'NO', phone: '8343801397', address: '' },
    { added: '07-01-2024 12:00 PM', name: 'abc', gstin: '12345', phone: '9874668542', address: 'kolkata' },
    { added: '31-01-2024 04:19 AM', name: 'abc', gstin: '36AMBPG7773M002', phone: '8945006017', address: 'kolkata' },
    { added: '17-06-2024 14:19 PM', name: 'abc', gstin: '', phone: '2546325496', address: 'kol' },
    { added: '08-01-2022 16:14 PM', name: 'ABC Construction', gstin: '19ABYPU3957H1ZK', phone: '', address: '' },
    { added: '24-11-2021 11:41 AM', name: 'Abc ltd', gstin: '', phone: '9874668542', address: '' },
    { added: '07-03-2023 09:23 AM', name: 'ABC Ltd', gstin: 'DEW223U2384V234', phone: '9874668542', address: '' },
    { added: '26-07-2023 05:39 AM', name: 'ABC Ltd', gstin: '12345', phone: '9874668542', address: '' },
    { added: '20-08-2023 05:43 AM', name: 'ABC Ltd', gstin: '12A7890123456', phone: '8337816181', address: '' },
    { added: '22-09-2023 10:25 AM', name: 'Abc ltd', gstin: '21ABFCS5951B1ZP', phone: '9331024481', address: 'Kolkata' },
    { added: '18-10-2023 04:35 AM', name: 'Abc ltd', gstin: '19AAACC4577H1ZH', phone: '7605090379', address: 'adsfgjggfsfxfdfd' },
    { added: '19-06-2024 04:26 AM', name: 'ABC Ltd', gstin: '19Adefr12101 ZU', phone: '9874668542', address: 'Beleghata Main Road' },
]

export default function CompaniesPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [displayCount, setDisplayCount] = useState(15)

    const filteredCompanies = companies.filter(company =>
        Object.values(company).some(value =>
            value.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    return (
        <div className="min-h-screen bg-amber-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6">Booking Master Control Panel</h1>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-amber-950 text-white p-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                        </svg>
                        <h2 className="text-xl font-semibold">Companies List</h2>
                    </div>

                    <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                            <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
                                Add New +
                            </button>
                            <div className="flex items-center space-x-2">
                                <span>Display</span>
                                <select
                                    value={displayCount}
                                    onChange={(e) => setDisplayCount(Number(e.target.value))}
                                    className="border rounded p-1"
                                >
                                    <option value={15}>15</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
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
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {['Added', 'Name', 'GSTIN', 'Phone', 'Address', 'Action'].map((header) => (
                                            <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredCompanies.slice(0, displayCount).map((company, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.added}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{company.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.gstin}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.phone}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.address}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <button className="text-green-600 hover:text-green-900 mr-2">Edit</button>
                                                <button className="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-sm text-gray-700">
                                Showing 1 to {Math.min(displayCount, filteredCompanies.length)} of {filteredCompanies.length} entries
                            </span>
                            <div className="flex space-x-2">
                                <button className="border rounded px-3 py-1"><ChevronLeft size={18} /></button>
                                <button className="border rounded px-3 py-1 bg-amber-950 text-white">1</button>
                                <button className="border rounded px-3 py-1"><ChevronRight size={18} /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}