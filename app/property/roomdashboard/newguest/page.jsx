'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Calendar, Clock } from 'lucide-react'
import Navbar from "@/app/_components/Navbar";
import { Footer } from "@/app/_components/Footer";

export default function BookingForm() {
    const [formData, setFormData] = useState({
        bookingType: 'FIT',
        bookingId: '',
        bookingSource: 'Walk In',
        bookingPoint: '',
        pinCode: '',
        mobileNo: '',
        guestName: '',
        companyName: '',
        gstin: '',
        guestEmail: '',
        adults: 1,
        children: 0,
        checkIn: '',
        checkOut: '',
        expectedArrival: '',
        expectedDeparture: '',
        bookingStatus: 'Confirmed',
        address: '',
        remarks: '',
        state: '',
        mealPlan: 'EP',
        bookingReference: '',
        stopPosting: false,
        guestType: 'General',
        guestNotes: '',
        internalNotes: '',
    });

    const router = useRouter();

    useEffect(() => {
        // Generate unique booking ID
        const generateBookingId = () => {
            return Math.random().toString(36).substring(2, 12).toUpperCase(); // Generates 10 character alphanumeric code
        };

        setFormData((prev) => ({ ...prev, bookingId: generateBookingId() }));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/NewBooking', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert('Booking created successfully!');
            router.push('/property/roomdashboard'); // Redirect to Room Dashboard after successful booking
        } else {
            alert('Failed to create booking');
        }
    };

    return (
        <div className="min-h-screen bg-amber-200">
            <Navbar />
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h1 className="text-2xl font-semibold text-amber-800 mb-4">Booking Master Control Panel</h1>
                        <div className="mb-4 flex items-center text-sm text-amber-600">
                            <a href="#" className="hover:underline">Home</a>
                            <span className="mx-2">&gt;</span>
                            <span>Reservations</span>
                        </div>
                        <div className="bg-amber-800 text-white p-4 rounded-lg mb-6">
                            <h2 className="text-lg font-semibold">Add Booking</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="booking-type">
                                        Booking Type*
                                    </label>
                                    <div className="relative">
                                        <select name="bookingType" value={formData.bookingType} onChange={handleChange} className="block appearance-none w-full bg-amber-50 border border-amber-200 text-amber-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-amber-500">
                                            {['FIT', 'Group', 'Corporate', 'Corporate Group', 'Office', 'Social Events'].map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-700">
                                            <ChevronDown className="fill-current h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="mobile-no">
                                        Booking ID*
                                    </label>
                                    <input type="text" name="bookingId" value={formData.bookingId} readOnly className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="booking-point">
                                        Booking Point*
                                    </label>
                                    <input type="text" name="bookingPoint" value={formData.bookingPoint} onChange={handleChange} required className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" placeholder="Enter Booking Point" />
                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="booking-source">
                                        Booking Source*
                                    </label>
                                    <div className="relative">
                                        <select name="bookingSource" value={formData.bookingSource} onChange={handleChange} className="block appearance-none w-full bg-amber-50 border border-amber-200 text-amber-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-amber-500">
                                            {['Walk In', 'Front Office', 'Agent', 'Office', 'Goibibo', 'Make My Trip', 'Agoda.com', 'Booking.com', 'Cleartrip', 'Yatra', 'Expedia', 'Trivago', 'Ease My Trip', 'Hotels.com', 'Happy Easy Go', 'TBO', 'Booking Engine', 'GO-MMT', 'Booking Master', 'Hoichoi', 'Others'].map((source) => (
                                                <option key={source} value={source}>{source}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-700">
                                            <ChevronDown className="fill-current h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="mobile-no">
                                        Mobile No.
                                    </label>
                                    <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500"  placeholder="Enter mobile number" />
                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="guest-name">
                                        Pin Code
                                    </label>
                                    <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" placeholder="Enter Pin Code" />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="guest-name">
                                        Guest Name
                                    </label>
                                    <input type="text" name="guestName" value={formData.guestName} onChange={handleChange} className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" placeholder="Enter Guest Name" />
                                </div>
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="mobile-no">
                                        Company Name
                                    </label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" placeholder="Enter Company Name" />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="guest-name">
                                        GSTIN
                                    </label>
                                    <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" placeholder="Enter GSTIN" />
                                </div>
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="mobile-no">
                                        Guest Email
                                    </label>
                                    <input type="email" name="guestEmail" value={formData.guestEmail} onChange={handleChange} required className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" placeholder="Enter Guest Email" />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="guest-name">
                                        Adults
                                    </label>
                                    <input type="number" name="adults" value={formData.adults} onChange={handleChange} min="1" className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" />
                                </div>
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="mobile-no">
                                        Children
                                    </label>
                                    <input type="number" name="children" value={formData.children} onChange={handleChange} min="0" className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="check-in">
                                        Check-In*
                                    </label>
                                    <div className="relative">
                                        <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} required className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-700">
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="check-out">
                                        Check-Out*
                                    </label>
                                    <div className="relative">
                                        <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} required className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-700">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="expected-arrival">
                                        Expected Arrival*
                                    </label>
                                    <div className="relative">
                                        <input type="time" name="expectedArrival" value={formData.expectedArrival} onChange={handleChange} required className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-700">
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="expected-departure">
                                        Expected Departure*
                                    </label>
                                    <div className="relative">
                                        <input type="time" name="expectedDeparture" value={formData.expectedDeparture} onChange={handleChange} required className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" id="expected-departure" />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-700">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="booking-point">
                                        Address*
                                    </label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} required className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" placeholder="Enter Guest Address" />
                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="booking-source">
                                        Booking Status*
                                    </label>
                                    <div className="relative">
                                        <select name="bookingStatus" value={formData.bookingStatus} onChange={handleChange} required className="block appearance-none w-full bg-amber-50 border border-amber-200 text-amber-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-amber-500">
                                            {['Confirmed', 'Blocked'].map((status) => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-700">
                                            <ChevronDown className="fill-current h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="booking-point">
                                        State
                                    </label>
                                    <input type="text" name="state" value={formData.state} onChange={handleChange} required className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" placeholder="Enter Guest Address" />
                                </div>
                                <div className="w-full md:w-1/2 px-3">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="booking-source">
                                        Meal Plan
                                    </label>
                                    <div className="relative">
                                        <select name="mealPlan" value={formData.mealPlan} onChange={handleChange} required className="block appearance-none w-full bg-amber-50 border border-amber-200 text-amber-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-amber-500">
                                            {['EP', 'AP', 'CP', 'MAP'].map((meal) => (
                                                <option key={meal} value={meal}>{meal}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-700">
                                            <ChevronDown className="fill-current h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="guest-name">
                                        Booking Reference
                                    </label>
                                    <input type="text" name="bookingReference" value={formData.bookingReference} onChange={handleChange} className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" placeholder="Enter Booking Reference" />
                                </div>
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="mobile-no">
                                        Stop Posting
                                    </label>
                                    <input type="checkbox" name="stopPosting" checked={formData.stopPosting} onChange={(e) => setFormData((prev) => ({ ...prev, stopPosting: e.target.checked }))} />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full md:w-1/2 px-3">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="booking-source">
                                        Guest Type
                                    </label>
                                    <div className="relative">
                                        <select name="guestType" value={formData.guestType} onChange={handleChange} className="block appearance-none w-full bg-amber-50 border border-amber-200 text-amber-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-amber-500">
                                            {['General', 'VIP Guest', 'VVIP Guest', 'Scanty baggage'].map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-amber-700">
                                            <ChevronDown className="fill-current h-4 w-4" />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="booking-point">
                                        Guest Notes
                                    </label>
                                    <input type="text" name="guestNotes" value={formData.guestNotes} onChange={handleChange} className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" placeholder="Enter Guest Notes" />
                                </div>
                            </div>
                            <div className="flex flex-wrap -mx-3">
                                <div className="w-full px-3">
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="remarks">
                                        Internal Notes
                                    </label>
                                    <textarea name="internalNotes" value={formData.internalNotes} onChange={handleChange} className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-amber-500"  placeholder="Enter Internal notes"></textarea>
                                    <label className="block uppercase tracking-wide text-amber-700 text-xs font-bold mb-2" htmlFor="remarks">
                                        Remarks
                                    </label>
                                    <textarea name="remarks" value={formData.remarks} onChange={handleChange} className="appearance-none block w-full bg-amber-50 text-amber-700 border border-amber-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-amber-500" placeholder="Enter Remarks"></textarea>
                                </div>
                            </div>
                            <div className="flex items-center justify-end">
                                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                                    Submit
                                </button>
                                <button onClick={()=>router.push('/property/roomdashboard')} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4" type="button">
                                    Back
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}