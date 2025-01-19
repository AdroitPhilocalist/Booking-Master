"use client"
import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import TextField from '@mui/material/TextField';
import Navbar from '../../../components/Navbar';
import { Footer } from '../../../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function AddRestaurant() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    itemCategory: '',
    itemSegment: '',
    itemCode: '',
    itemName: '',
    price: '',
    sgst: '',
    cgst: '',
    total: '',
    showInProfile: 'Yes (Visible)',
    isSpecialItem: 'No (Not Editable)',
    discountAllowed: 'Yes (Allowed)',
    storeItemCode: '',
    ingredientCode: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };

      const gst = (parseFloat(updatedData.sgst || 0)+parseFloat(updatedData.cgst || 0));

      if (name === "cgst" || name === "sgst"||name === "price") {
        // Calculate total when gst or tariff changes
        const price = parseFloat(updatedData.price).toFixed(2) || 0;
        updatedData.total = (((100 + gst) / 100) * price).toFixed(2);
      }

      if (name === "total") {
        // Calculate tariff when total is changed
        const total = parseFloat(updatedData.total).toFixed(2) || 0;
        updatedData.price = (total / ((100 + gst) / 100)).toFixed(2);
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await fetch("/api/menuItem", {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('Menu item added successfully:', result);
        toast.success("Menu item added successfully");
        //router.back();
      } else {
        console.error('Error:', result.error);
        toast.error("Error adding menu item");
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };


  return (
    <div className='bg-amber-50 min-h-screen'>
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '50px' }}>
        <div style={{ backgroundColor: 'white', color: 'black', padding: '10px', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '2 rem', fontWeight: 'bold' }}>Add Restaurant Menu Item</h1>
        </div>
        <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '4px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' }}>
          <h2 style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>Restaurant Details</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', alignItems: 'center' }}>
            <label htmlFor="itemCategory">Item Category*</label>
            <select
              id="itemCategory"
              name="itemCategory"
              value={formData.itemCategory}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
            >
              <option value="">Type or Select</option>
              <option value="Beverages">Beverages</option>
              <option value="Bread">Bread</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Chicken">Chicken</option>
              <option value="Chinese">Chinese</option>
              <option value="Chicken">Chicken</option>
              <option value="Dessert">Dessert</option>
              <option value="Drinks">Drinks</option>
              <option value="Egg">Egg</option>
              <option value="Ice-cream">Ice-cream</option>
              <option value="Mutton">Mutton</option>
              <option value="Paneer">Paneer</option>
              <option value="Raita">Raita</option>
              <option value="Rice">Rice</option>
              <option value="Sea Fish">Sea Fish</option>
              <option value="Salad">Salad</option>
              <option value="Soup">Soup</option>
              <option value="Special Item">Special Item</option>
              <option value="Starter">Starter</option>
              <option value="Tandoori">Tandoori</option>
              <option value="Tandoori Bread">Tandoori Bread</option>
              <option value="Veg Thali">Veg Thali</option>
              <option value="Veg Special">Veg Special</option>
              <option value="Others">Others</option>

            </select>

            <label htmlFor="itemSegment">Item Segment*</label>
            <select
              id="itemSegment"
              name="itemSegment"
              value={formData.itemSegment}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
            >
              <option value="">Type or Select</option>
              <option value="Beverages">Beverages</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Chicken">Chicken</option>
              <option value="Drinks">Drinks</option>
              <option value="Egg">Egg</option>
              <option value="Ice-cream">Ice-cream</option>
              <option value="Sea Fish">Sea Fish</option>
              <option value="Mutton">Mutton</option>
              <option value="Paneer">Paneer</option>
              <option value="Raita">Raita</option>
              <option value="Thali">Thali</option>
              <option value="Others">Others</option>
            </select>

            <TextField id="Item Code" label="Item Code" variant="outlined"
              type="text"

              name="itemCode"
              value={formData.itemCode}
              onChange={handleInputChange}
              required
              className="border rounded w-full "
            />

            <TextField id="Item Name" label="Item Name" variant="outlined"
              type="text"

              name="itemName"
              value={formData.itemName}
              onChange={handleInputChange}
              required
              className="border rounded w-full "
            />

            <label htmlFor="price">Price (INR)*</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
            />

            <label htmlFor="gst">IGST (%)</label>
            <input
              type="number"
              id="gst"
              name="gst"
              value={parseFloat(formData.sgst||0)+parseFloat(formData.cgst||0)}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
            readOnly/>
            <label htmlFor="gst">SGST (%)</label>
            <input
              type="number"
              id="sgst"
              name="sgst"
              value={formData.sgst}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
              
            />
            <label htmlFor="gst">CGST (%)</label>
            <input
              type="number"
              id="cgst"
              name="cgst"
              value={formData.cgst}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
              
            />


            <label htmlFor="total">Total (incl. GST)</label>
            <input
              type="number"
              id="total"
              name="total"
              value={formData.total}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
            />

            <label htmlFor="showInProfile">Show in Profile?</label>
            <select
              id="showInProfile"
              name="showInProfile"
              value={formData.showInProfile}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
            >
              <option value="Yes (Visible)">Yes (Visible)</option>
              <option value="No (Hidden)">No (Hidden)</option>
            </select>

            <label htmlFor="isSpecialItem">Is Special Item?</label>
            <select
              id="isSpecialItem"
              name="isSpecialItem"
              value={formData.isSpecialItem}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
            >
              <option value="No (Not Editable)">No (Not Editable)</option>
              <option value="Yes (Editable)">Yes (Editable)</option>
            </select>

            <label htmlFor="discountAllowed">Discount Allowed?</label>
            <select
              id="discountAllowed"
              name="discountAllowed"
              value={formData.discountAllowed}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e0', borderRadius: '4px' }}
            >
              <option value="Yes (Allowed)">Yes (Allowed)</option>
              <option value="No (Not Allowed)">No (Not Allowed)</option>
            </select>

            <TextField id="Store Item Code" label="Store Item Code" variant="outlined"
              type="text"

              name="storeItemCode"
              value={formData.storeItemCode}
              onChange={handleInputChange}
              className="border rounded w-full "
            />

            <TextField id="Ingredient Code" label="Ingredient Code" variant="outlined"
              type="text"

              name="ingredientCode"
              value={formData.ingredientCode}
              onChange={handleInputChange}
              className="border rounded w-full "
            />
          </div>
          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#4299e1',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'

              }}
              onClick={()=>{router.push('/Restaurant/restaurantmenu')}}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
