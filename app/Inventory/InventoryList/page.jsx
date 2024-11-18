"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";

export default function InventoryList() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAction, setStockAction] = useState({ type: '', itemId: '' });

  // Fetch items and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/InventoryList"),
          fetch("/api/InventoryCategory")
        ]);
        const itemsData = await itemsResponse.json();
        const categoriesData = await categoriesResponse.json();
        setItems(itemsData.items || []);
        setCategories(categoriesData.products || []);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      const method = currentItem ? "PUT" : "POST";
      const url = currentItem
        ? `/api/InventoryList/${currentItem._id}`
        : "/api/InventoryList";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (method === "POST") setItems((prev) => [...prev, data.item]);
      else
        setItems((prev) =>
          prev.map((item) =>
            item._id === data.item._id ? data.item : item
          )
        );

      setShowModal(false);
      setCurrentItem(null);
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleStock = async (itemId, quantity) => {
    try {
      const response = await fetch(`/api/InventoryList/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: stockAction.type,
          quantity: Number(quantity)
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setItems(prev => prev.map(item => 
          item._id === itemId ? data.item : item
        ));
      }
      setShowStockModal(false);
      setStockAction({ type: '', itemId: '' });
    } catch (error) {
      console.error("Error managing stock:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Inventory List</h1>
        <button
          onClick={() => {
            setShowModal(true);
            setCurrentItem(null);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Items +
        </button>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Item Code</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Group</th>
              <th className="border border-gray-300 px-4 py-2">Segment</th>
              <th className="border border-gray-300 px-4 py-2">Auditable</th>
              <th className="border border-gray-300 px-4 py-2">Tax</th>
              <th className="border border-gray-300 px-4 py-2">Stock</th>
              <th className="border border-gray-300 px-4 py-2">Unit</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className="border border-gray-300 px-4 py-2">{item.itemCode}</td>
                <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                <td className="border border-gray-300 px-4 py-2">{item.group}</td>
                <td className="border border-gray-300 px-4 py-2">{item.segment?.itemName}</td>
                <td className="border border-gray-300 px-4 py-2">{item.auditable}</td>
                <td className="border border-gray-300 px-4 py-2">{item.tax}%</td>
                <td className="border border-gray-300 px-4 py-2">{item.stock}</td>
                <td className="border border-gray-300 px-4 py-2">{item.quantityUnit}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => {
                      setStockAction({ type: 'buy', itemId: item._id });
                      setShowStockModal(true);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-1"
                  >
                    Buy Stock
                  </button>
                  <button
                    onClick={() => {
                      setStockAction({ type: 'sell', itemId: item._id });
                      setShowStockModal(true);
                    }}
                    className="bg-orange-500 text-white px-2 py-1 rounded mr-1"
                  >
                    Sell Stock
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setCurrentItem(item);
                    }}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Show Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ItemModal
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          initialData={currentItem}
          categories={categories}
        />
      )}

      {showStockModal && (
        <StockModal
          onClose={() => setShowStockModal(false)}
          onSubmit={handleStock}
          action={stockAction}
        />
      )}
      
      <Footer />
    </div>
  );
}

const ItemModal = ({ onClose, onSubmit, initialData, categories }) => {
  const [formData, setFormData] = useState(initialData || {
    itemCode: '',
    name: '',
    group: '',
    segment: '',
    auditable: 'no',
    tax: '',
    stock: 0,
    quantityUnit: 'pieces'
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit' : 'Add'} Item</h2>
        
        <div className="space-y-4">
          <label className="mb-2">Item Code</label>
          <input
            type="text"
            placeholder="Item Code"
            value={formData.itemCode}
            onChange={(e) => setFormData({...formData, itemCode: e.target.value})}
            className="w-full border p-2 rounded mt-2"
          />
          
          <label className="mb-2">Name</label>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border p-2 rounded mt-2"
          />
          
          <label className="mb-2">Group</label>
          <input
            type="text"
            placeholder="Group"
            value={formData.group}
            onChange={(e) => setFormData({...formData, group: e.target.value})}
            className="w-full border p-2 rounded mt-2"
          />
          
          <label className="mb-2">Segment</label>
          <select
            value={formData.segment}
            onChange={(e) => setFormData({...formData, segment: e.target.value})}
            className="w-full border p-2 rounded mt-2"
          >
            <option value="">Select Segment</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.itemName}
              </option>
            ))}
          </select>
          
          <label className="mb-2">Auditable</label>
          <select
            value={formData.auditable}
            onChange={(e) => setFormData({...formData, auditable: e.target.value})}
            className="w-full border p-2 rounded mt-2"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
          
          <label className="mb-2">Tax (%)</label>
          <input
            type="number"
            placeholder="Tax (%)"
            value={formData.tax}
            onChange={(e) => setFormData({...formData, tax: e.target.value})}
            className="w-full border p-2 rounded mt-2"
          />
          
          <label className="mb-2">Initial Stock</label>
          <input
            type="number"
            placeholder="Initial Stock"
            value={formData.stock}
            onChange={(e) => setFormData({...formData, stock: e.target.value})}
            className="w-full border p-2 rounded mt-2"
          />
          
          <label className="mb-2">Quantity Unit</label>
          <select
            value={formData.quantityUnit}
            onChange={(e) => setFormData({...formData, quantityUnit: e.target.value})}
            className="w-full border p-2 rounded mt-2"
          >
            <option value="pieces">Pieces</option>
            <option value="kgs">Kgs</option>
            <option value="grams">Grams</option>
            <option value="litres">Litres</option>
          </select>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(formData)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {initialData ? 'Update' : 'Add'} Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StockModal = ({ onClose, onSubmit, action }) => {
  const [quantity, setQuantity] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-80 max-h-[60vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {action.type === 'buy' ? 'Buy' : 'Sell'} Stock
        </h2>
        
        <div className="space-y-4">
          <input
            type="number"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full border p-2 rounded mt-2"
            min="1"
          />

          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={() => onSubmit(action.itemId, quantity)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



