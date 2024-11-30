import React from 'react';

export const Footer = () => {
    return (
        <div>
            <footer className="bg-cyan-600 text-white p-4">
                <div className="container mx-auto text-center">
                    © {new Date().getFullYear()}, Hotel Booking . All Rights Reserved.
                </div>
            </footer>
        </div>
    );
};

