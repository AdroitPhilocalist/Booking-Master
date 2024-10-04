'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/app/_components/Navbar";
import { Footer } from "@/app/_components/Footer";

const NewGuest = () => {
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
        <>
            <Navbar />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">New Guest Booking</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label>Booking Type:</label>
                        <select name="bookingType" value={formData.bookingType} onChange={handleChange} className="border rounded p-2">
                            {['FIT', 'Group', 'Corporate', 'Corporate Group', 'Office', 'Social Events'].map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Booking ID:</label>
                        <input type="text" name="bookingId" value={formData.bookingId} readOnly className="border rounded p-2" />
                    </div>

                    <div>
                        <label>Booking Source:</label>
                        <select name="bookingSource" value={formData.bookingSource} onChange={handleChange} className="border rounded p-2">
                            {['Walk In', 'Front Office', 'Agent', 'Office', 'Goibibo', 'Make My Trip', 'Agoda.com', 'Booking.com', 'Cleartrip', 'Yatra', 'Expedia', 'Trivago', 'Ease My Trip', 'Hotels.com', 'Happy Easy Go', 'TBO', 'Booking Engine', 'GO-MMT', 'Booking Master', 'Hoichoi', 'Others'].map((source) => (
                                <option key={source} value={source}>{source}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Booking Point:</label>
                        <input type="text" name="bookingPoint" value={formData.bookingPoint} onChange={handleChange} required className="border rounded p-2" />
                    </div>

                    <div>
                        <label>Pin Code:</label>
                        <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="border rounded p-2" />
                    </div>

                    <div>
                        <label>Mobile No:</label>
                        <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} className="border rounded p-2" />
                    </div>

                    <div>
                        <label>Guest Name:</label>
                        <input type="text" name="guestName" value={formData.guestName} onChange={handleChange} required className="border rounded p-2" />
                    </div>

                    <div>
                        <label>Company Name:</label>
                        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="border rounded p-2" />
                    </div>

                    <div>
                        <label>GSTIN:</label>
                        <input type="text" name="gstin" value={formData.gstin} onChange={handleChange} className="border rounded p-2" />
                    </div>

                    <div>
                        <label>Guest Email:</label>
                        <input type="email" name="guestEmail" value={formData.guestEmail} onChange={handleChange} className="border rounded p-2" />
                    </div>

                    <div>
                        <label>Adults:</label>
                        <input type="number" name="adults" value={formData.adults} onChange={handleChange} min="1" className="border rounded p-2" />
                    </div>

                    <div>
                        <label>Children:</label>
                        <input type="number" name="children" value={formData.children} onChange={handleChange} min="0" className="border rounded p-2" />
                    </div>

                    <div>
                        <label>Check In:</label>
                        <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} required className="border rounded p-2" />
                    </div>

                    <div>
                        <label>Check Out:</label>
                        <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} required className="border rounded p-2" />
                    </div>

                    <div>
                        <label>Expected Arrival:</label>
                        <input type="text" name="expectedArrival" value={formData.expectedArrival} onChange={handleChange} required className="border rounded p-2" />
                    </div>

                    <div>
                        <label>Expected Departure:</label>
                        <input type="text" name="expectedDeparture" value={formData.expectedDeparture} onChange={handleChange} required className="border rounded p-2" />
                    </div>

                    <div>
                        <label>Booking Status:</label>
                        <select name="bookingStatus" value={formData.bookingStatus} onChange={handleChange} required className="border rounded p-2">
                            {['Confirmed', 'Blocked'].map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Address:</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="border rounded p-2" />
                    </div>

                    <div>
                        <label>Remarks:</label>
                        <input type="text" name="remarks" value={formData.remarks} onChange={handleChange} className="border rounded p-2" />
                    </div>

                    <div>
                        <label>State:</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} required className="border rounded p-2" />
                    </div>

                    <div>
                        <label>Meal Plan:</label>
                        <select name="mealPlan" value={formData.mealPlan} onChange={handleChange} className="border rounded p-2">
                            {['EP', 'AP', 'CP', 'MAP'].map((meal) => (
                                <option key={meal} value={meal}>{meal}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Booking Reference:</label>
                        <input type="text" name="bookingReference" value={formData.bookingReference} onChange={handleChange} className="border rounded p-2" />
                    </div>

                    <div>
                        <label>Stop Posting:</label>
                        <input type="checkbox" name="stopPosting" checked={formData.stopPosting} onChange={(e) => setFormData((prev) => ({ ...prev, stopPosting: e.target.checked }))} />
                    </div>

                    <div>
                        <label>Guest Type:</label>
                        <select name="guestType" value={formData.guestType} onChange={handleChange} className="border rounded p-2">
                            {['General', 'VIP Guest', 'VVIP Guest', 'Scanty baggage'].map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>


                    <div>
                        <label>Guest Notes:</label>
                        <input type="text" name="guestNotes" value={formData.guestNotes} onChange={handleChange} className="border rounded p-2" />
                    </div>

                    <div>
                        <label>Internal Notes:</label>
                        <input type="text" name="internalNotes" value={formData.internalNotes} onChange={handleChange} className="border rounded p-2" />
                    </div>

                    <button type="submit" className="bg-blue-500 text-white rounded p-2">Submit</button>
                </form>
            </div>
            <Footer />
        </>
    );
};

export default NewGuest;
