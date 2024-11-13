"use client"
import { useEffect, useState } from 'react'
import { Footer } from '@/app/_components/Footer'
import Navbar from '@/app/_components/Navbar'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('All Tables')
  const [tables, setTables] = useState([]) // Initialize tables as an empty array

  const tabs = ['All Tables', 'In Room Dining', 'Foods of Heaven', 'POOLSIDE CAFE', 'Restaurant', 'House keeping', 'pvt']

  // Fetch table data from the backend
  useEffect(() => {
    async function fetchTables() {
      try {
        const response = await fetch('https://booking-master-psi.vercel.app/api/tables'); // Update the endpoint as needed
        const data = await response.json();
        setTables(data.data); // Set the fetched table data
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    }

    fetchTables();
  }, []);

  return (
    <div className="min-h-screen bg-amber-50">
      <Navbar />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Bubun Dashboard</h1>
          <div className="space-x-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              $ Debtor Payments
            </button>
            <button className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">
              Debtor Statement
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex space-x-4 mb-6">
          <div className="w-1/2 bg-blue-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Table</h2>
            <div className="space-y-2">
              <div className="flex justify-between bg-green-100 p-2 rounded">
                <span>Running Tables</span>
                <span>3</span>
              </div>
              <div className="flex justify-between bg-green-100 p-2 rounded">
                <span>Blank Tables</span>
                <span>34</span>
              </div>
            </div>
          </div>
          <div className="w-1/2 bg-yellow-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Room</h2>
            <div className="bg-red-100 p-2 rounded flex justify-between">
              <span>Invoice Pending</span>
              <span>0</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <nav className="flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  activeTab === tab
                    ? 'bg-gray-200 text-gray-800'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {tables.length > 0 ? (
            tables.map((table) => (
              <div
                key={table.id}
                className={`p-4 rounded-lg ${
                  table.due ? 'bg-red-100' : 'bg-white'
                } shadow`}
              >
                <h3 className="text-lg font-semibold mb-2">Table-{table.tableNo}</h3>
                {table.due && (
                  <p className="mb-2">Due - ₹{table.due.toFixed(2)}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  <button className="px-2 py-1 bg-teal-500 text-white rounded text-sm">
                    + Token
                  </button>
                  <button className="px-2 py-1 bg-purple-500 text-white rounded text-sm">
                    + NC Token
                  </button>
                  {table.due && (
                    <>
                      <button className="px-2 py-1 bg-yellow-500 text-white rounded text-sm">
                        Print
                      </button>
                      <button className="px-2 py-1 bg-blue-500 text-white rounded text-sm">
                        $ Payment
                      </button>
                      <button className="px-2 py-1 bg-green-500 text-white rounded text-sm">
                        Transfer to Room
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>No tables available.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
