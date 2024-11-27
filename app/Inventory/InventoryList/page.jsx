"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import TextField from '@mui/material/TextField';

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

  const handleSubmit = () => {
    if (!purchaseorderno || !purchasedate || !Invoiceno || !selectedQuantity || !rate) {
      alert("Please fill all required fields");
      return;
    }
  
    if (action.type === 'sell' && selectedQuantity > selectedItem.stock) {
      alert("Not enough stock available");
      return;
    }
  
    const formData = {
      purchaseorderno,
      purchasedate,
      Invoiceno,
      quantityAmount: parseFloat(selectedQuantity),
      rate: parseFloat(rate),
      total: parseFloat(total),
      purorsell: action.type === 'buy' ? 'purchase' : 'sell'
    };
  
    onSubmit(formData);
  };

  // In your main page component, update the handleStock function:
  const handleStock = async (itemId, stockDetails) => {
    try {
      // Find the current item
      const currentItem = items.find(item => item._id === itemId);
      if (!currentItem) {
        throw new Error("Item not found");
      }
  
      // Prepare complete stock details
      const completeStockDetails = {
        purchaseorderno: stockDetails.purchaseorderno,
        name: currentItem._id, // Use item _id as reference
        purchasedate: new Date(stockDetails.purchasedate),
        Invoiceno: stockDetails.Invoiceno,
        quantity: currentItem._id, // Use item _id as reference
        quantityAmount: stockDetails.quantityAmount,
        unit: currentItem._id, // Use item _id as reference
        rate: stockDetails.rate,
        taxpercent: currentItem._id, // Use item _id as reference
        total: stockDetails.total,
        purorsell: stockDetails.purorsell
      };
  
      // Create stock report
      const stockReportResponse = await fetch("/api/stockreport", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeStockDetails),
      });
  
      // Check if response is ok and parse JSON
      if (!stockReportResponse.ok) {
        const errorData = await stockReportResponse.json().catch(() => ({
          error: `Server returned ${stockReportResponse.status}`
        }));
        throw new Error(errorData.error || 'Failed to create stock report');
      }
  
      const stockReportData = await stockReportResponse.json();
  
      // Calculate new stock value
      const quantityChange = completeStockDetails.purorsell === 'purchase' 
        ? completeStockDetails.quantityAmount 
        : -completeStockDetails.quantityAmount;
  
      // Update inventory
      const inventoryResponse = await fetch(`/api/InventoryList/${itemId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...currentItem,
          stock: currentItem.stock + quantityChange
        }),
      });
  
      if (!inventoryResponse.ok) {
        throw new Error("Failed to update inventory");
      }
  
      const inventoryData = await inventoryResponse.json();
      
      // Update local state
      setItems(prev =>
        prev.map(item => (item._id === itemId ? inventoryData.item : item))
      );
      
      setShowStockModal(false);
      setStockAction({ type: '', itemId: '' });
      
      alert(completeStockDetails.purorsell === 'purchase' ? 'Purchase completed successfully' : 'Sale completed successfully');
      
    } catch (error) {
      console.error("Error managing stock:", error);
      alert(error.message || "Error managing stock. Please try again.");
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
                    Edit Item
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
          onSubmit={(formData) => handleStock(stockAction.itemId, formData)}
          action={stockAction}
          inventoryList={items} // Pass the items state as inventoryList prop
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
          <TextField id="Item Code" label="Item Code" variant="outlined"
            type="text"
          
            value={formData.itemCode}
            onChange={(e) => setFormData({...formData, itemCode: e.target.value})}
            className="w-full border p-2 rounded"
          />
          
          <TextField id="Name" label="Name" variant="outlined"
            type="text"
          
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border p-2 rounded mt-2"
          />
          
          <TextField id="Group" label="Group" variant="outlined"
            type="text"
          
            value={formData.group}
            onChange={(e) => setFormData({...formData, group: e.target.value})}
            className="w-full border p-2 rounded mt-2"
          />
          
          
          <select
            value={formData.segment}
            onChange={(e) => setFormData({...formData, segment: e.target.value})}
            className="w-full border p-3 rounded mt-2"
          >
            <option value="">Select Segment</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.itemName}
              </option>
            ))}
          </select>
          
          <label className="p-2 mt-3">Auditable</label>
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


const StockModal = ({ onClose, onSubmit, action, inventoryList }) => {
  const [purchaseorderno, setPurchaseorderno] = useState('');

  const [purchasedate, setPurchasedate] = useState('');
  const [Invoiceno, setInvoiceno] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState('');
  const [rate, setRate] = useState('');
  const [total, setTotal] = useState('');
  
  const selectedItem = inventoryList.find(item => item._id === action.itemId);

  const calculateTotal = () => {
    if (rate && selectedQuantity && selectedItem) {
      const baseTotal = parseFloat(rate) * parseFloat(selectedQuantity);
      const taxAmount = baseTotal * (parseFloat(selectedItem.tax || 0) / 100);
      setTotal((baseTotal + taxAmount).toFixed(2));
    }
  };

  useEffect(() => {
    calculateTotal();
  }, [rate, selectedQuantity, selectedItem]);

  const handleSubmit = () => {
  if (!purchaseorderno || !purchasedate || !Invoiceno || !selectedQuantity || !rate) {
    alert("Please fill all required fields");
    return;
  }

  if (action.type === 'sell' && selectedQuantity > selectedItem.stock) {
    alert("Not enough stock available");
    return;
  }

  const formData = {
    purchaseorderno,
    purchasedate,
    Invoiceno,
    name: selectedItem.name, // Add name
    itemCode: selectedItem.itemCode, // Add item code
    group: selectedItem.group, // Add group
    segment: selectedItem.segment, // Add segment
    quantity: selectedItem._id,
    quantityAmount: parseFloat(selectedQuantity),
    unit: selectedItem.quantityUnit,
    rate: parseFloat(rate),
    taxpercent: selectedItem.tax,
    total: parseFloat(total),
    purorsell: action.type === 'buy' ? 'purchase' : 'sell'
  };

  onSubmit(formData);
};
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">
          {action.type === "buy" ? "Purchase Stock" : "Sell Stock"}
        </h2>

        <div className="space-y-4 overflow-y-auto max-h-[70vh]">
          <TextField
            required
            id="purchaseorderno"
            label="Purchase Order No"
            variant="outlined"
            value={purchaseorderno}
            onChange={(e) => setPurchaseorderno(e.target.value)}
            className="w-full"
          />

          <TextField
            required
            id="purchasedate"
            label="Purchase Date"
            type="date"
            variant="outlined"
            value={purchasedate}
            onChange={(e) => setPurchasedate(e.target.value)}
            className="w-full"
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            required
            id="Invoiceno"
            label="Invoice No"
            variant="outlined"
            value={Invoiceno}
            onChange={(e) => setInvoiceno(e.target.value)}
            className="w-full"
          />

          <div className="space-y-2">
            <label className="block">Selected Item</label>
            <div className="p-2 border rounded">
              {selectedItem.name} (Tax: {selectedItem.tax}%)
            </div>
          </div>

          <div className="space-y-2">
            <label className="block">Unit</label>
            <div className="p-2 border rounded">
              {selectedItem.quantityUnit}
            </div>
          </div>

          <TextField
            required
            id="quantity"
            label="Quantity"
            type="number"
            variant="outlined"
            value={selectedQuantity}
            onChange={(e) => setSelectedQuantity(e.target.value)}
            className="w-full"
            error={action.type === 'sell' && selectedQuantity > selectedItem.stock}
            helperText={action.type === 'sell' && selectedQuantity > selectedItem.stock 
              ? `Available stock: ${selectedItem.stock}` 
              : ''}
          />

          <TextField
            required
            id="rate"
            label="Rate per Unit"
            type="number"
            variant="outlined"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="w-full"
          />

          <div className="space-y-2">
            <label className="block">Tax Percentage</label>
            <div className="p-2 border rounded">
              {selectedItem.tax}%
            </div>
          </div>

          <TextField
            id="total"
            label="Total Amount"
            variant="outlined"
            value={total}
            className="w-full"
            InputProps={{ readOnly: true }}
          />

          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Confirm {action.type === 'buy' ? 'Purchase' : 'Sale'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

