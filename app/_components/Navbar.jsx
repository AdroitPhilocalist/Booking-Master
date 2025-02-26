"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, UserCircle, Building2, BedDouble, ListChecks, Users2, BookOpen, 
  ClipboardList, UtensilsCrossed, LayoutDashboard, TableProperties, Menu, 
  Receipt, FileText, Package, FolderTree, PackageSearch, ShoppingCart, 
  BarChart3, LogOut } from "lucide-react";
import { jwtVerify } from "jose"; // Import jwtVerify for token verification
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Navbar() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [roles, setRoles] = useState([]); // State to store user's roles
  const [userAuthToken, setUserAuthToken] = useState(null); // State to store userAuthToken
  const [authToken, setAuthToken] = useState(null); // State to store authToken
  const router = useRouter();

  // Fetch and verify tokens and roles on mount
  useEffect(() => {
    const fetchTokensAndRoles = async () => {
      // Fetch userAuthToken
      const userToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("userAuthToken="))
        ?.split("=")[1];
      // Fetch authToken
      const legacyToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("authToken="))
        ?.split("=")[1];

      if (!userToken && !legacyToken) {
        setRoles([]); // No tokens, no roles
        setUserAuthToken(null); // Clear userAuthToken state
        setAuthToken(null); // Clear authToken state
        return;
      }

      try {
        const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

        if (userToken) {
          const decoded = await jwtVerify(
            userToken,
            new TextEncoder().encode(SECRET_KEY)
          );
          setRoles(decoded.payload.roles || []); // Extract roles from userAuthToken payload
          setUserAuthToken(userToken); // Store userAuthToken in state
        } else if (legacyToken) {
          const decoded = await jwtVerify(
            legacyToken,
            new TextEncoder().encode(SECRET_KEY)
          );
          setRoles(decoded.payload.roles || []); // Extract roles from authToken payload (if available)
          setAuthToken(legacyToken); // Store authToken in state
        }
      } catch (error) {
        console.error("Error verifying tokens:", error);
        toast.error("Invalid or expired session. Please log in again.", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        });
        setRoles([]); // Clear roles on error
        setUserAuthToken(null); // Clear userAuthToken on error
        setAuthToken(null); // Clear authToken on error
        // Clear both tokens from cookies
        document.cookie = "userAuthToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      }
    };

    fetchTokensAndRoles();
  }, []); // Run once on mount

  const handleMouseEnter = (index) => {
    setOpenDropdown(index);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  const deleteSpecificCookies = () => {
    // Delete userAuthToken if it exists
    if (userAuthToken) {
      document.cookie = "userAuthToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
    // Delete authToken if it exists
    if (authToken) {
      document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    
    // Delete specific cookies based on which tokens exist
    deleteSpecificCookies();
    
    // Determine redirect based on tokens
    let redirectPath = "/";
    if (userAuthToken && !authToken) {
      redirectPath = "/user/login"; // Redirect to user login if only userAuthToken exists
    } else if (!userAuthToken && authToken) {
      redirectPath = "/"; // Redirect to root if only authToken exists
    } // If both exist or neither, redirect to root (handled by default)

    // Add a small delay before redirecting
    setTimeout(() => {
      setIsLoggingOut(false);
      setRoles([]); // Clear roles on logout
      setUserAuthToken(null); // Clear userAuthToken on logout
      setAuthToken(null); // Clear authToken on logout
      router.push(redirectPath);
    }, 800);
  };

  // Determine which dropdowns to show based on roles and token presence
  const showMaster = !userAuthToken && !authToken && (roles.includes("Property & Frontdesk") || roles.includes("Restaurant") || roles.includes("Inventory")); // Only show Master if no tokens
  const showProperty = (userAuthToken || authToken) && roles.includes("Property & Frontdesk"); // Show if logged in and has this role
  const showRestaurant = (userAuthToken || authToken) && roles.includes("Restaurant"); // Show if logged in and has this role
  const showInventory = (userAuthToken || authToken) && roles.includes("Inventory"); // Show if logged in and has this role

  return (
    <nav className="bg-gradient-to-r from-cyan-600 to-cyan-700 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href={(userAuthToken || authToken) ? "/property/roomdashboard" : "/"}>
          <div className="transform hover:scale-105 transition-transform duration-300">
            <Image src="/Hotel-Logo.png" alt="BookingMaster.in" width={190} height={60} priority className="pr-4" />
          </div>
        </Link>

        <ul className="flex space-x-6 text-white">
          {/* Master Dropdown (shown only if no userAuthToken or authToken and any role exists) */}
          {showMaster && (
            <li className="relative group" 
                onMouseEnter={() => handleMouseEnter(1)} 
                onMouseLeave={handleMouseLeave}>
              <button className="px-3 py-2 rounded-t-lg flex items-center space-x-2 hover:bg-cyan-800 transition-colors duration-300">
                <Users className="w-5 h-5" />
                <span>Master</span>
              </button>
              {openDropdown === 1 && (
                <ul className="absolute top-[100%] left-0 w-48 bg-white text-gray-800 rounded-b-lg shadow-xl z-10">
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
          )}

          {/* Property & Frontdesk Dropdown (shown if logged in with either token and has "Property & Frontdesk" role) */}
          {showProperty && (
            <li className="relative group"
                onMouseEnter={() => handleMouseEnter(2)}
                onMouseLeave={handleMouseLeave}>
              <button className="px-3 py-2 rounded-t-lg flex items-center space-x-2 hover:bg-cyan-800 transition-colors duration-300">
                <Building2 className="w-5 h-5" />
                <span>Property & Frontdesk</span>
              </button>
              {openDropdown === 2 && (
                <ul className="absolute top-[100%] left-0 w-56 bg-white text-gray-800 rounded-b-lg shadow-xl z-10">
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
          )}

          {/* Restaurant Dropdown (shown if logged in with either token and has "Restaurant" role) */}
          {showRestaurant && (
            <li className="relative group"
                onMouseEnter={() => handleMouseEnter(7)}
                onMouseLeave={handleMouseLeave}>
              <button className="px-3 py-2 rounded-t-lg flex items-center space-x-2 hover:bg-cyan-800 transition-colors duration-300">
                <UtensilsCrossed className="w-5 h-5" />
                <span>Restaurant</span>
              </button>
              {openDropdown === 7 && (
                <ul className="absolute top-[100%] left-0 w-48 bg-white text-gray-800 rounded-b-lg shadow-xl z-10">
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
          )}

          {/* Inventory Dropdown (shown if logged in with either token and has "Inventory" role) */}
          {showInventory && (
            <li className="relative group"
                onMouseEnter={() => handleMouseEnter(8)}
                onMouseLeave={handleMouseLeave}>
              <button className="px-3 py-2 rounded-t-lg flex items-center space-x-2 hover:bg-cyan-800 transition-colors duration-300">
                <Package className="w-5 h-5" />
                <span>Inventory</span>
              </button>
              {openDropdown === 8 && (
                <ul className="absolute top-[100%] left-0 w-48 bg-white text-gray-800 rounded-b-lg shadow-xl z-10">
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
          )}

          {/* Logout Button (shown if either token exists) */}
          {(userAuthToken || authToken || roles.length > 0) && (
            <li className="ml-6">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`
                  flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 
                  text-white rounded-lg transform transition-all duration-300
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
          )}
        </ul>
      </div>
    </nav>
  );
}