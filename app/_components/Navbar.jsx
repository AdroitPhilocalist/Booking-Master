"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleMouseEnter = (index) => {
    setOpenDropdown(index);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  return (
    <nav className="bg-cyan-600 p-4">
      <div className="max-w-7xl flex justify-between items-center">
        {/* Logo */}
        <Link href="/property/roomdashboard">
        <Image
          src="/Hotel-Logo.png"
          alt="BookingMaster.in"
          width={190}
          height={60}
          priority
          className="pr-4"
        />
        </Link>
        {/* Navbar Links */}
        <ul className="flex space-x-6 text-white">
          {/* Master Dropdown */}
          <li
            className="relative"
            onMouseEnter={() => handleMouseEnter(1)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-1 py-1 focus:outline-none hover:bg-cyan-800 rounded ">Master</button>
            {openDropdown === 1 && (
              <ul className="absolute top-full left-0 mt-0 w-48 bg-white text-black rounded shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/master/users">Users</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/master/profile">Profile</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Property Dropdown */}
          <li
            className="relative"
            onMouseEnter={() => handleMouseEnter(2)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-1 py-1 focus:outline-none hover:bg-cyan-800 rounded ">Property & Frontdesk</button>
            {openDropdown === 2 && (
              <ul className="absolute top-full left-0 mt-0 w-48 bg-white text-black rounded shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/property/roomdashboard">Room Dashboard</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/property/roomcategories">Room Categories</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/property/roomlist">Room List</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/property/guests">Guests</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/property/billing">Booking</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/property/roomreport">Room Report</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Restaurant Dropdown */}
          <li
            className="relative"
            onMouseEnter={() => handleMouseEnter(7)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-1 py-1 focus:outline-none hover:bg-cyan-800 rounded">Restaurant</button>
            {openDropdown === 7 && (
              <ul className="absolute top-full left-0 mt-0 w-48 bg-white text-black rounded shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/Restaurant/dashboard">Dashboard</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/Restaurant/Tables">Tables</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/Restaurant/restaurantmenu">Restaurant Menu</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/Restaurant/restaurantbooking">Booking</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/Restaurant/invoice">Invoice</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/Restaurant/restaurantreport">Restaurant Report</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Inventory Dropdown */}
          <li
            className="relative"
            onMouseEnter={() => handleMouseEnter(8)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-1 py-1 focus:outline-none hover:bg-cyan-800 rounded ">Inventory</button>
            {openDropdown === 8 && (
              <ul className="absolute top-full left-0 mt-0 w-48 bg-white text-black rounded shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/Inventory/Category">Category</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/Inventory/InventoryList">Inventory List</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/Inventory/PurchaseReport">Purchase Item</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/Inventory/SalesReport">Sales Item</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/Inventory/StockReport">Stock Report</Link>
                </li>
              </ul>
            )}
          </li>

          
          
        </ul>
      </div>
    </nav>
  );
}
