"use client"
import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, Save } from 'lucide-react'

export default function PropertySettings() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-700 to-orange-600">
      <header className="bg-amber-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Image
            src="/Booking Master logo.png"
            alt="BookingMaster.in"
            width={200}
            height={40}
            priority
          />
          <nav>
            <button className="text-white hover:text-amber-200">Logout</button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-semibold text-amber-800 mb-6">Property Settings</h1>

          <form className="space-y-6">
            <div>
              <label htmlFor="propertyName" className="block text-sm font-medium text-amber-700">
                Property Name
              </label>
              <input
                type="text"
                id="propertyName"
                name="propertyName"
                className="mt-1 block w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-md text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter property name"
              />
            </div>

            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-amber-700">
                Property Type
              </label>
              <div className="relative mt-1">
                <button
                  type="button"
                  className="relative w-full bg-amber-50 border border-amber-300 rounded-md py-2 pl-3 pr-10 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className="block truncate">Select property type</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </button>
                {isOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {['Hotel', 'Resort', 'Apartment', 'Villa'].map((type) => (
                      <div
                        key={type}
                        className="cursor-default select-none relative py-2 pl-3 pr-9 hover:bg-amber-100"
                      >
                        {type}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-amber-700">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                className="mt-1 block w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-md text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter property address"
              ></textarea>
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-amber-700">
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                className="mt-1 block w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-md text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter contact number"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="mt-1 block w-full px-3 py-2 bg-amber-50 border border-amber-300 rounded-md text-amber-900 placeholder-amber-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
              >
                <Save className="mr-2 h-5 w-5" />
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-amber-800 text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()}, Booking Master. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  )
}