'use client'
import { useRouter } from "next/navigation";
import { Footer } from '../../_components/Footer'
import Navbar from '../../_components/Navbar'
import { useState, useEffect } from 'react'

export default function RestaurantList() {
    const router = useRouter();
    
    // State to store menu items
    const [restaurantItems, setRestaurantItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from the API on component mount
    useEffect(() => {
        const fetchMenuItems = async () => {
            try {

                const response = await fetch("/api/menuItem"); // Adjust the endpoint if necessary

                const result = await response.json();

                if (result.success) {
                    setRestaurantItems(result.data);
                } else {
                    setError(result.error || 'Failed to fetch data');
                }
            } catch (err) {
                console.error('Error fetching menu items:', err);
                setError('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchMenuItems();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="min-h-screen bg-amber-50">
            <Navbar />
            <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
                <h1 style={{ color: '#4a5568', marginBottom: '20px' }}>Restaurant Menu</h1>
                
                
                <div style={{ marginBottom: '20px' }}>
                    <button
                        style={{ backgroundColor: '#48bb78', color: 'white', border: 'none', padding: '10px', marginRight: '10px', cursor: 'pointer' }}
                        onClick={() => router.push("/Restaurant/restaurantmenu/add")}
                    >
                        Add New +
                    </button>
                    {/* <button style={{ backgroundColor: '#ed8936', color: 'white', border: 'none', padding: '10px', marginRight: '10px', cursor: 'pointer' }}>
                        Import Data ☁
                    </button>
                    <button style={{ backgroundColor: '#4299e1', color: 'white', border: 'none', padding: '10px', cursor: 'pointer' }}>
                        Export Data ⬇
                    </button> */}
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label>Display </label>
                    <select style={{ marginRight: '10px' }}>
                        <option>15</option>
                    </select>
                    <span>records</span>
                    <input type="text" placeholder="Search:" style={{ float: 'right', padding: '5px' }} />
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f5f5f5' }}>
                            <th style={{ fontWeight: "bold", textAlign: 'left', borderBottom: '#28bfdb' }}>Item Code</th>
                            <th style={{ fontWeight: "bold", textAlign: 'left', borderBottom: '#28bfdb' }}>Category</th>
                            <th style={{ fontWeight: "bold", textAlign: 'left', borderBottom: '#28bfdb' }}>Segment</th>
                            <th style={{ fontWeight: "bold", textAlign: 'left', borderBottom: '#28bfdb' }}>Item Name</th>
                            <th style={{ fontWeight: "bold", textAlign: 'left', borderBottom: '#28bfdb' }}>Price (INR)</th>
                            <th style={{fontWeight: "bold", textAlign: 'left', borderBottom: '#28bfdb' }}>GST (%)</th>
                            <th style={{ fontWeight: "bold", textAlign: 'left', borderBottom: '#28bfdb' }}>Total (incl. GST)</th>
                            <th style={{ fontWeight: "bold", textAlign: 'left', borderBottom: '#28bfdb' }}>In Profile?</th>
                            <th style={{ fontWeight: "bold", textAlign: 'left', borderBottom: '#28bfdb' }}>Is Special?</th>
                            <th style={{ fontWeight: "bold", textAlign: 'left', borderBottom: '#28bfdb' }}>Disc. Allowed?</th>
                            <th style={{ fontWeight: "bold", textAlign: 'left', borderBottom: ' #28bfdb' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurantItems.map((item, index) => (
                            <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '10px' }}>{item.itemCode}</td>
                                <td style={{ padding: '10px' }}>{item.itemCategory}</td>
                                <td style={{ padding: '10px' }}>{item.itemSegment}</td>
                                <td style={{ padding: '10px' }}>{item.itemName}</td>
                                <td style={{ padding: '10px' }}>{item.price}</td>
                                <td style={{ padding: '10px' }}>{item.gst}</td>
                                <td style={{ padding: '10px' }}>{item.total}</td>
                                <td style={{ padding: '10px' }}>{item.showInProfile}</td>
                                <td style={{ padding: '10px' }}>{item.isSpecialItem}</td>
                                <td style={{ padding: '10px' }}>{item.discountAllowed}</td>
                                <td style={{ padding: '10px' }}>
                                    {/* <span style={{ backgroundColor: item.status === 'Active' ? '#48bb78' : '#e53e3e', color: 'white', padding: '2px 5px', borderRadius: '3px', marginRight: '5px' }}>
                                        {item.status}
                                    </span> */}
                                    <button style={{ backgroundColor: '#4299e1', color: 'white', border: 'none', padding: '2px 5px', cursor: 'pointer', marginRight: '5px' }}>
                                        ✏ Edit
                                    </button>
                                    <button style={{ backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '2px 5px', cursor: 'pointer' }}>
                                        🗑 Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Footer />
        </div>
    );
}