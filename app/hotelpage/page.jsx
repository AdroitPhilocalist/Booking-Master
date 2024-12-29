"use client"
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function HotelPage() {
    const router = useRouter();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cyan-700 to-cyan-600">
            {/* Logo */}
            <div className="mb-8">
                <Image src="/Hotel-Logo.png" alt="BookingMaster Logo" width={300} height={60} />
            </div>

            {/* Hotel Card */}
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-4xl w-full md:max-h-[500px]">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Main Image */}
                    <div className="md:w-2/3">
                        <Image
                            src="/Raj International.png"
                            alt="Hotel Exterior"
                            width={500}
                            height={300}
                            className="rounded-lg object-cover w-full h-[400px]"
                        />
                    </div>

                    {/* Hotel Details */}
                    <div className="md:w-1/3 space-y-4">
                        <h2 className="text-2xl font-bold">Hotel Raj International</h2>
                        <p className="text-gray-600">Near Bandra Post Office</p>
                        <p className="font-semibold">Hotel Type: Premium Hotel</p>
                        <p className="text-xl font-bold">Price: ₹ 4500/- <span className="text-sm font-normal">per night</span></p>

                        {/* Amenities */}
                        <ul className="space-y-1 text-sm max-h-40 overflow-y-auto">
                            <li>2 min from Sea Beach</li>
                            <li>AC Rooms with attached Bath & Balcony</li>
                            <li>24X7 Cable Connection</li>
                            <li>Power Supply</li>
                            <li>24X7 Front Desk Service & Security</li>
                            <li>24X7 Hot & Cold Water</li>
                            <li>Car Parking</li>
                            <li>Doctor on Call</li>
                            <li>Laundry Service</li>
                            <li>Multi Cuisine Restaurant</li>
                            <li>Free WiFi</li>
                            <li>Driver&apos;s Room</li>

                        </ul>
                        <button  onClick={() => router.push("/property/roomdashboard")} className="bg-cyan-900 text-white p-2 border border-transparent shadow-sm text-sm font-medium rounded-full hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500">Go to Dashboard</button>

                        {/* Small Images */}
                        <div className="grid grid-cols-2 gap-2">
                            {/* {[...Array(4)].map((_, index) => (
                // <Image
                //   key={index}
                //   src={/placeholder.svg?height=80&width=120}
                //   alt={Hotel Image ${index + 1}}
                //   width={120}
                //   height={80}
                //   className="rounded-md object-cover"
                // />
              ))} */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-white text-sm">
            © {new Date().getFullYear()}, Hotel Booking. All Rights Reserved.
            </div>
        </div>
    )
}