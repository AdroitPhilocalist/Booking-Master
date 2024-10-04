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
    <nav className="bg-amber-800 p-4">
      <div className="max-w-7xl flex justify-between items-center">
        {/* Logo */}
        <Image
          src="/Booking Master logo.png"
          alt="BookingMaster.in"
          width={190}
          height={60}
          priority
          className="pr-4"
        />
        {/* Navbar Links */}
        <ul className="flex space-x-6 text-white">
          {/* Master Dropdown */}
          <li
            className="relative"
            onMouseEnter={() => handleMouseEnter(1)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-1 py-1 focus:outline-none hover:bg-amber-700 rounded hover:text-yellow-200">Master</button>
            {openDropdown === 1 && (
              <ul className="absolute top-full left-0 mt-0 w-48 bg-white text-black rounded shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/master/users">Users</Link>
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
            <button className="px-1 py-1 focus:outline-none hover:bg-amber-700 rounded hover:text-yellow-200">Property</button>
            {openDropdown === 2 && (
              <ul className="absolute top-full left-0 mt-0 w-48 bg-white text-black rounded shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/property/settings">Settings</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/property/companies">Companies</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/property/stayoverview">Stay Overview</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/property/scheduledmessages">Scheduled Message</Link>
                </li>
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
                  <Link href="/property/dailyreport">Daily Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/property/checkoutstatement">Checkout Statement</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/property/guests">Guests</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/property/reservations">Reservations</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/property/bookingpayments">Booking Payments</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/property/bookingrefunds">Booking Refunds</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/property/bookingrequests">Booking Requests</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Rate Manager</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Room Posting</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">CM Update Log</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">System Access Log</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Sent SMS Log</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Profile Dropdown */}
          <li
            className="relative"
            onMouseEnter={() => handleMouseEnter(3)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-1 py-1 focus:outline-none hover:bg-amber-700 rounded hover:text-yellow-200">Profile</button>
            {openDropdown === 3 && (
              <ul className="absolute top-full left-0 mt-0 w-48 bg-white text-black rounded shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Banners</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">TV Channels</Link>
                </li>
                
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Menu Pricing</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Tour Packs</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Top Deals</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Extra Facilities</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Imp. Phone Numbers</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Reviews</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Rating Options</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Business Dropdown */}
          <li
            className="relative"
            onMouseEnter={() => handleMouseEnter(4)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-1 py-1 focus:outline-none hover:bg-amber-700 rounded hover:text-yellow-200">Business</button>
            {openDropdown === 4 && (
              <ul className="absolute top-full left-0 mt-0 w-48 bg-white text-black rounded shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Business Analysis</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Performance Analysis</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Booking Compare</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Review Compare</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">PIN Code Density</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Promotional SMS</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Booking Dropdown */}
          <li
            className="relative"
            onMouseEnter={() => handleMouseEnter(5)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-1 py-1 focus:outline-none hover:bg-amber-700 rounded hover:text-yellow-200">Booking</button>
            {openDropdown === 5 && (
              <ul className="absolute top-full left-0 mt-0 w-48 bg-white text-black rounded shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Advance Filter</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Room Availability</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Room Status</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Tokens</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Invoices</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Export Invoices</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Front Office Collection Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Daily Room Sale Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">ARR Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Plan Sale Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Occupancy Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Channel Manager Log</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Invoice Edit Log</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Payment Edit Log</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Accounts Dropdown */}
          <li
            className="relative"
            onMouseEnter={() => handleMouseEnter(6)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-1 py-1 focus:outline-none hover:bg-amber-700 rounded hover:text-yellow-200">Accounts</button>
            {openDropdown === 6 && (
              <ul className="absolute top-full left-0 mt-0 w-48 bg-white text-black rounded shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Segments</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Expense Groups</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Expenses</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Payment Methods</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Coupon Codes</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Funds Transfer</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Debtor Payments</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Debtor Statement</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Pending Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Income Expenditure</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Account Books</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Sales Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">GSTR-1</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Audit Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Collection Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Daywise Collection Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Daywise Total Sale Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Expense Summary Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Profit & Loss Statement</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Daywise Discount Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">User Discount Report</Link>
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
            <button className="px-1 py-1 focus:outline-none hover:bg-amber-700 rounded hover:text-yellow-200">Restaurant</button>
            {openDropdown === 7 && (
              <ul className="absolute top-full left-0 mt-0 w-48 bg-white text-black rounded shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="restaurantdashboard">Dashboard</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/Restaurant/Tables">Tables</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="/Restaurant/restaurantmenu">Restaurant Menu</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Tokens</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Deleted Token Items</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Transfer Token</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Invoices</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">NC Statements</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Settlement Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Item Consumption Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Daily Roomwise Food Sale Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Dailywise Food Report</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Services Dropdown */}
          <li
            className="relative"
            onMouseEnter={() => handleMouseEnter(8)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-1 py-1 focus:outline-none hover:bg-amber-700 rounded hover:text-yellow-200">Services</button>
            {openDropdown === 8 && (
              <ul className="absolute top-full left-0 mt-0 w-48 bg-white text-black rounded shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Dashboard</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Counters</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Tokens</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Deleted Token Items</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Transfer Token</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Invoices</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">NC Statements</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Settlement Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Consumption Report</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Inventory Dropdown */}
          <li
            className="relative"
            onMouseEnter={() => handleMouseEnter(9)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-1 py-1 focus:outline-none hover:bg-amber-700 rounded hover:text-yellow-200">Inventory</button>
            {openDropdown === 9 && (
              <ul className="absolute top-full left-0 mt-0 w-48 bg-white text-black rounded shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Segments</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Vendors</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Units</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Unit Conversion</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Store / Kitchen</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Item Groups</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Items</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Gravies</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Ingredients</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Purchase Items</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Purchase Services</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Stock Transfer</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Vendor Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Stock Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Closing Stock Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Item Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Item Consumption Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Total Consumption Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Item Audit</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Housekeeping Dropdown */}
          <li
            className="relative"
            onMouseEnter={() => handleMouseEnter(10)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-1 py-1 focus:outline-none hover:bg-amber-700 rounded hover:text-yellow-200">Housekeeping</button>
            {openDropdown === 10 && (
              <ul className="absolute top-full left-0 mt-0 w-48 bg-white text-black rounded shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Parameters</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Cleaning Log</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Room Costing</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Room Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Amenities Consumption Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Housekeeping Audit</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Staff Dropdown */}
          <li
            className="relative"
            onMouseEnter={() => handleMouseEnter(11)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-1 py-1 focus:outline-none hover:bg-amber-700 rounded hover:text-yellow-200">Staff</button>
            {openDropdown === 11 && (
              <ul className="absolute top-full left-0 mt-0 w-48 bg-white text-black rounded shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Staff Members</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Attendance</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Salary Sheet</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Daywise Attendance Report</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Staff Account Books</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Banquet Dropdown */}
          <li
            className="relative"
            onMouseEnter={() => handleMouseEnter(12)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-1 py-1 focus:outline-none hover:bg-amber-700 rounded hover:text-yellow-200">Banquet</button>
            {openDropdown === 12 && (
              <ul className="absolute top-full left-0 mt-0 w-48 bg-white text-black rounded shadow-lg z-10">
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Banquet Halls</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Banquet Addons</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Meal Menus</Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100">
                  <Link href="#">Reservations</Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}