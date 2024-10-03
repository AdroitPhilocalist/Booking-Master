import React from 'react'
import { Calendar, Printer } from 'lucide-react'
import Navbar from '@/app/_components/Navbar'
import { Footer } from '@/app/_components/Footer'

const TableHeader = ({ children }) => (
    <th className="border px-2 py-1 bg-amber-200 text-amber-800">{children}</th>
)

const TableCell = ({ children }) => (
    <td className="border px-2 py-1">{children}</td>
)

const ReportTable = ({ title, headers, data }) => (
    <div className="mb-8">
        <h3 className="text-lg font-semibold bg-amber-300 p-2 rounded-t">{title}</h3>
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        {headers.map((header, index) => (
                            <TableHeader key={index}>{header}</TableHeader>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={headers.length} className="border px-2 py-1 bg-red-100 text-red-800">No records available.</td>
                        </tr>
                    ) : (
                        data.map((row, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-amber-50' : 'bg-white'}>
                                {Object.values(row).map((cell, cellIndex) => (
                                    <TableCell key={cellIndex}>{cell}</TableCell>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
)

export default function DailyReport() {
    const advanceBookingHeaders = ['Booking Code', 'Guest', 'Booking Point', 'Booking Type', 'Booked On/By', 'Room No.', 'Check In/ Check Out', 'Status', 'Room Tariff', 'Total Amount', 'Advance Paid', 'Due Amount']
    const advanceBookingData = []

    const todaysCheckInHeaders = ['Booking Code', 'Guest', 'Booking Point', 'Booking Type', 'Booked On/By', 'Room No.', 'Check In/ Check Out', 'Status', 'Room Tariff', 'Total Amount', 'Food', 'Others', 'Grand Total', 'Previous Payment', "Today's Payment", 'Due Amount']
    const todaysCheckInData = [
        { bookingCode: 'BX561033BD4AA', guest: 'A BIDAWAT', bookingPoint: 'Super Admin Booking Engine', bookingType: 'FIT', bookedOn: '08-Sep-24', roomNo: '205', checkInOut: '09-Sep-24 11-Sep-24', status: 'Confirmed', roomTariff: 'AC Deluxe Room (2) @ 1,120.00', totalAmount: '2,240.00', food: '0.00', others: '0.00', grandTotal: '2,240.00', previousPayment: 'Online : 1,120.00', todaysPayment: '', dueAmount: '1,120.00' },
        { bookingCode: 'BX51705F0BFBF', guest: 'Soumen Sengupta', bookingPoint: 'Sujoy Roy Chakraborty', bookingType: 'FIT Walk-In', bookedOn: '08-Sep-24', roomNo: '303', checkInOut: '09-Sep-24 11-Sep-24', status: 'Confirmed', roomTariff: 'AC Deluxe Room (2) @ 2,240.00', totalAmount: '4,480.00', food: '0.00', others: '0.00', grandTotal: '4,480.00', previousPayment: 'Online : 1,000.00', todaysPayment: '', dueAmount: '3,480.00' },
    ]

    const stayingGuestsHeaders = ['Booking Code', 'Guest', 'Booking Point', 'Booking Type', 'Booked On/By', 'Room No.', 'Check In/ Check Out', 'Status', 'Room Tariff', 'Total Amount', 'Food', 'Others', 'Grand Total', 'Previous Payment', "Today's Payment", 'Due Amount']
    const stayingGuestsData = [
        { bookingCode: 'BX5A17B6613F', guest: 'AYUB', bookingPoint: 'Sujoy Roy Chakraborty', bookingType: 'FIT Walk-In', bookedOn: '29-Aug-24', roomNo: '502', checkInOut: '29-Aug-24 15-Sep-24', status: 'Checked Out', roomTariff: 'Suite Room (20) @ 1,400.00 Suite Room (7) @ 2,240.00', totalAmount: '38,080.00', food: '0.00', others: '500.00', grandTotal: '38,580.00', previousPayment: 'Cash : 15,000.00', todaysPayment: '', dueAmount: '23,580.00' },
        { bookingCode: 'BX5333AA26EA0', guest: 'M AKHIL MITRA', bookingPoint: 'Animesh Walk-In', bookingType: 'Corporate Animesh Mitra', bookedOn: '01-Sep-24', roomNo: '404', checkInOut: '01-Sep-24 15-Sep-24', status: 'Checked Out', roomTariff: 'AC Deluxe Room (14) @ 1,568.00', totalAmount: '21,952.00', food: '0.00', others: '0.00', grandTotal: '21,952.00', previousPayment: '', todaysPayment: '', dueAmount: '21,952.00' },
        // Add more staying guests data here
    ]

    const todaysCheckOutHeaders = ['Booking Code', 'Guest', 'Booking Point', 'Booking Type', 'Booked On/By', 'Room No.', 'Check In/ Check Out', 'Status', 'Room Tariff', 'Total Amount', 'Food', 'Others', 'Grand Total', 'Previous Payment', "Today's Payment", 'Due Amount']
    const todaysCheckOutData = [
        { bookingCode: 'BX5249CD11E92', guest: 'Ram Sen', bookingPoint: 'Palash Saha Booking Master', bookingType: 'FIT', bookedOn: '07-Sep-24', roomNo: '304, 305', checkInOut: '07-Sep-24 09-Sep-24', status: 'Confirmed', roomTariff: 'AC Deluxe Room (4) @ 3,125.00', totalAmount: '12,499.98', food: '0.00', others: '0.00', grandTotal: '12,500.00', previousPayment: 'Online : 4,500.00', todaysPayment: '', dueAmount: '8,000.00' },
        { bookingCode: 'BX5D5A0DBD4E3', guest: 'Narendra Singh', bookingPoint: 'Sujoy Roy Chakraborty', bookingType: 'FIT Walk-In', bookedOn: '08-Sep-24', roomNo: '205, 303', checkInOut: '08-Sep-24 09-Sep-24', status: 'Confirmed', roomTariff: 'AC Deluxe Room (2) @ 2,000.00', totalAmount: '3,999.99', food: '0.00', others: '0.00', grandTotal: '4,000.00', previousPayment: 'Online : 2,000.00', todaysPayment: '', dueAmount: '2,000.00' },
    ]

    return (
        <div className="min-h-screen bg-amber-50">
            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-6">Booking Master Control Panel</h1>

                <div className="bg-amber-100 p-4 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                        <Calendar className="mr-2" /> Daily Report
                    </h2>
                    <div className="flex items-center space-x-2">
                        <span>Start Date</span>
                        <input type="date" className="border rounded px-2 py-1" defaultValue="2024-09-09" />
                        <button className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
                        <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
                            <Printer className="mr-2" /> Print
                        </button>
                    </div>
                </div>

                <ReportTable title="ADVANCE BOOKING" headers={advanceBookingHeaders} data={advanceBookingData} />
                <ReportTable title="TODAY'S CHECK-IN" headers={todaysCheckInHeaders} data={todaysCheckInData} />
                <ReportTable title="STAYING GUESTS" headers={stayingGuestsHeaders} data={stayingGuestsData} />
                <ReportTable title="TODAY'S CHECK-OUT" headers={todaysCheckOutHeaders} data={todaysCheckOutData} />

                {/* Additional sections */}
                {['TOTAL COLLECTION FROM FRONT OFFICE', 'TOTAL COLLECTION FROM RESTAURANT & OTHERS', 'TOTAL EXPENSES INCURRED', 'EXPENSE SUMMARY REPORT'].map((section) => (
                    <div key={section} className="mb-8">
                        <h3 className="text-lg font-semibold bg-amber-300 p-2 rounded-t">{section}</h3>
                        <div className="bg-red-100 text-red-800 p-2 rounded-b">No records available.</div>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <Footer />
        </div>
    )
}