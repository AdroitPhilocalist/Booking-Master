'use client'
import React, { useState, useEffect } from 'react';
import { Hotel, Users, DollarSign, AlertCircle } from 'lucide-react';
import Navbar from '../../../_components/Navbar';
import { Footer } from '../../../_components/Footer';

const RoomDashboard = () => {
    const [rooms, setRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/rooms');
                const data = await response.json();
                if (data.success) {
                    const groupedRooms = data.data.reduce((acc, room) => {
                        const floor = room.floor;
                        if (!acc[floor]) acc[floor] = [];
                        acc[floor].push(room);
                        return acc;
                    }, {});

                    Object.keys(groupedRooms).forEach(floor => {
                        groupedRooms[floor].sort((a, b) => a.number.localeCompare(b.number));
                    });

                    setRooms(groupedRooms);
                }
            } catch (error) {
                console.error('Error fetching rooms:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRooms();
    }, []);

    const RoomBlock = ({ room }) => {
        const getGradient = (status) => {
            switch (status) {
                case 'Vacant':
                    return 'bg-gradient-to-br from-emerald-400 via-green-400 to-teal-500';
                case 'Confirmed':
                    return 'bg-gradient-to-br from-rose-400 via-pink-400 to-red-500';
                default:
                    return 'bg-gradient-to-br from-yellow-400 via-orange-400 to-amber-500';
            }
        };

        return (
            <div className="group animate-fade-in-up">
                <div className={`
                    p-6 m-2 w-48 h-40 rounded-xl
                    ${getGradient(room.occupied)}
                    shadow-lg text-white
                    transform transition-all duration-500
                    hover:scale-105 hover:rotate-1
                    group-hover:shadow-2xl
                    relative overflow-hidden
                    backdrop-blur-sm
                `}>
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold tracking-tight">Room {room.number}</h3>
                            <Hotel className="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-300" />
                        </div>

                        <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium tracking-wide backdrop-blur-sm">
                                {room.category?.category || 'Category N/A'}
                            </p>

                            <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                                {room.occupied === 'Confirmed' ? (
                                    <Users className="w-5 h-5 animate-bounce" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 animate-pulse" />
                                )}
                                <span className="text-sm font-semibold">{room.occupied}</span>
                            </div>

                            <div className="flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300">
                                <DollarSign className="w-5 h-5" />
                                <span className="text-sm font-semibold">{room.billingStarted}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
            <Navbar />
            <div className="p-8">
                {isLoading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                        <div className="bg-white/90 p-8 rounded-2xl shadow-2xl flex flex-col items-center animate-bounce-slow">
                            <svg
                                aria-hidden="true"
                                className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"
                                />
                            </svg>
                            <span className="mt-4 text-gray-700 font-medium animate-pulse">Loading Classic Layout...</span>
                        </div>
                    </div>
                )}
                <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 animate-fade-in">
                    Room Classic Layout
                </h1>

                {Object.keys(rooms).sort().map((floor, index) => (
                    <div key={floor} className="mb-8 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                        <div className="transform transition-all duration-500 hover:translate-x-2">
                            <h2 className="text-2xl font-semibold mb-4 p-4 rounded-lg shadow-md
                                bg-gradient-to-r from-purple-100 via-indigo-100 to-blue-100
                                border-l-4 border-indigo-500
                                hover:shadow-lg hover:from-purple-200 hover:via-indigo-200 hover:to-blue-200
                                transition-all duration-300">
                                Floor No: {floor}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {rooms[floor].map((room, roomIndex) => (
                                <div key={room._id} style={{ animationDelay: `${roomIndex * 100}ms` }}>
                                    <RoomBlock room={room} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default RoomDashboard;