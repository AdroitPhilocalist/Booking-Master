"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Users, 
  UserCircle, 
  Building2, 
  BedDouble, 
  ListChecks,
  Bed,
  Users2,
  BookOpen,
  ClipboardList,
  UtensilsCrossed,
  LayoutDashboard,
  TableProperties,
  Menu,
  Receipt,
  FileText,
  Package,
  FolderTree, // Replaced Categories with FolderTree
  PackageSearch,
  ShoppingCart,
  BarChart3,
  LogOut
} from 'lucide-react';

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleMouseEnter = (index) => {
    setOpenDropdown(index);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    // Add your logout logic here
    setTimeout(() => {
      // Simulate logout delay
      setIsLoggingOut(false);
      // Redirect to login page or handle logout
    }, 800);
  };

  return (
    <nav className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/property/roomdashboard">
          <div className="transform hover:scale-105 transition-transform duration-300">
            <Image
              src="/Hotel-Logo.png"
              alt="BookingMaster.in"
              width={190}
              height={60}
              priority
              className="pr-4"
            />
          </div>
        </Link>
        
        {/* Navbar Links */}
        <ul className="flex pspace-x-6 text-white">
          {/* Master Dropdown */}
          <li
            className="relative group"
            onMouseEnter={() => handleMouseEnter(1)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-cyan-800 transition-colors duration-300">
              <Users className="w-5 h-5" />
              <span>Master</span>
            </button>
            {openDropdown === 1 && (
              <ul className="absolute top-full left-0 mt-1 w-48 bg-white text-gray-800 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out z-10">
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <Users2 className="w-4 h-4 text-cyan-600" />
                  <Link href="/master/users">Users</Link>
                </li>
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <UserCircle className="w-4 h-4 text-cyan-600" />
                  <Link href="/master/profile">Profile</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Property Dropdown */}
          <li
            className="relative group"
            onMouseEnter={() => handleMouseEnter(2)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-cyan-800 transition-colors duration-300">
              <Building2 className="w-5 h-5" />
              <span>Property & Frontdesk</span>
            </button>
            {openDropdown === 2 && (
              <ul className="absolute top-full left-0 mt-1 w-56 bg-white text-gray-800 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out z-10">
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <LayoutDashboard className="w-4 h-4 text-cyan-600" />
                  <Link href="/property/roomdashboard">Room Dashboard</Link>
                </li>
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <ListChecks className="w-4 h-4 text-cyan-600" />
                  <Link href="/property/roomcategories">Room Categories</Link>
                </li>
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <BedDouble className="w-4 h-4 text-cyan-600" />
                  <Link href="/property/roomlist">Room List</Link>
                </li>
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <Users2 className="w-4 h-4 text-cyan-600" />
                  <Link href="/property/guests">Guests</Link>
                </li>
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <BookOpen className="w-4 h-4 text-cyan-600" />
                  <Link href="/property/billing">Booking</Link>
                </li>
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <ClipboardList className="w-4 h-4 text-cyan-600" />
                  <Link href="/property/roomreport">Room Report</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Restaurant Dropdown */}
          <li
            className="relative group"
            onMouseEnter={() => handleMouseEnter(7)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-cyan-800 transition-colors duration-300">
              <UtensilsCrossed className="w-5 h-5" />
              <span>Restaurant</span>
            </button>
            {openDropdown === 7 && (
              <ul className="absolute top-full left-0 mt-1 w-48 bg-white text-gray-800 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out z-10">
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <LayoutDashboard className="w-4 h-4 text-cyan-600" />
                  <Link href="/Restaurant/dashboard">Dashboard</Link>
                </li>
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <TableProperties className="w-4 h-4 text-cyan-600" />
                  <Link href="/Restaurant/Tables">Tables</Link>
                </li>
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <Menu className="w-4 h-4 text-cyan-600" />
                  <Link href="/Restaurant/restaurantmenu">Restaurant Menu</Link>
                </li>
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <BookOpen className="w-4 h-4 text-cyan-600" />
                  <Link href="/Restaurant/restaurantbooking">Booking</Link>
                </li>
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <Receipt className="w-4 h-4 text-cyan-600" />
                  <Link href="/Restaurant/invoice">Invoice</Link>
                </li>
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <FileText className="w-4 h-4 text-cyan-600" />
                  <Link href="/Restaurant/restaurantreport">Restaurant Report</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Inventory Dropdown */}
          <li
            className="relative group"
            onMouseEnter={() => handleMouseEnter(8)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="px-3 py-2 rounded-lg flex items-center space-x-2 hover:bg-cyan-800 transition-colors duration-300">
              <Package className="w-5 h-5" />
              <span>Inventory</span>
            </button>
            {openDropdown === 8 && (
              <ul className="absolute top-full left-0 mt-1 w-48 bg-white text-gray-800 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out z-10">
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <FolderTree className="w-4 h-4 text-cyan-600" />
                  <Link href="/Inventory/Category">Category</Link>
                </li>
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <PackageSearch className="w-4 h-4 text-cyan-600" />
                  <Link href="/Inventory/InventoryList">Inventory List</Link>
                </li>
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <ShoppingCart className="w-4 h-4 text-cyan-600" />
                  <Link href="/Inventory/PurchaseReport">Purchase Item</Link>
                </li>
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <Receipt className="w-4 h-4 text-cyan-600" />
                  <Link href="/Inventory/SalesReport">Sales Item</Link>
                </li>
                <li className="px-4 py-2 hover:bg-cyan-50 flex items-center space-x-2 transition-colors duration-200">
                  <BarChart3 className="w-4 h-4 text-cyan-600" />
                  <Link href="/Inventory/StockReport">Stock Report</Link>
                </li>
              </ul>
            )}
          </li>
          {/* Logout Button */}
          <li className="ml-6">
              <button 
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`
                  flex items-center space-x-2 px-4 py-2 
                  bg-red-500 hover:bg-red-600 
                  text-white rounded-lg
                  transform transition-all duration-300
                  ${isLoggingOut ? 'scale-95 opacity-80' : 'hover:scale-105'}
                  focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50
                  shadow-md hover:shadow-lg
                `}
              >
                <LogOut className={`w-5 h-5 transform transition-transform duration-500 ${isLoggingOut ? 'rotate-90' : ''}`} />
                <span className={`transition-opacity duration-300 ${isLoggingOut ? 'opacity-0' : 'opacity-100'}`}>
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </span>
              </button>
            </li>
        </ul>
      </div>
    </nav>
  );
}