import React from 'react';

export const Footer = () => {
    return (
        <div>
            <footer className="bg-[#1976d2] text-white p-4">
                <div className="container mx-auto text-center">
                    © {new Date().getFullYear()}, Booking Master. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
};

