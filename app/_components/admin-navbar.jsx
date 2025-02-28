"use client";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Users, UserCircle, Building2, BedDouble, ListChecks, Users2, BookOpen,
    ClipboardList, UtensilsCrossed, LayoutDashboard, TableProperties, Menu,
    Receipt, FileText, Package, FolderTree, PackageSearch, ShoppingCart,
    BarChart3, LogOut
} from 'lucide-react';

export default function Navbar() {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();

    const handleMouseEnter = (index) => {
        setOpenDropdown(index);
    };

    const handleMouseLeave = () => {
        setOpenDropdown(null);
    };

    const deleteSpecificCookies = () => {
        // Delete authtoken
        document.cookie = "adminauthToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        // Delete clienttoken
        // document.cookie = "adminclientToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    };

    const handleLogout = () => {
        setIsLoggingOut(true);

        // Delete specific cookies
        deleteSpecificCookies();

        // Add a small delay before redirecting
        setTimeout(() => {
            setIsLoggingOut(false);
            router.push('/admin/login');
        }, 800);
    };

    return (
        <nav className="bg-cyan-700 p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">

                <div className="transform hover:scale-105 transition-transform duration-300">
                    <Image src="/Hotel-Logo.png" alt="BookingMaster.in" width={200} height={60} priority className="pr-4" />
                </div>




                {/* Logout Button */}
                <div>
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
                </div>

            </div>
        </nav>
    );
} 