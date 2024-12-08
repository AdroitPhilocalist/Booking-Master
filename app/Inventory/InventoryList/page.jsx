"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export default function InventoryList() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAction, setStockAction] = useState({ type: '', itemId: '' });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch items and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
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

  const handleStock = async (itemId, stockDetails) => {
    try {
      const currentItem = items.find(item => item._id === itemId);
      if (!currentItem) {
        throw new Error("Item not found");
      }
  
      const completeStockDetails = {
        purchaseorderno: stockDetails.purchaseorderno,
        name: currentItem._id,
        purchasedate: new Date(stockDetails.purchasedate),
        Invoiceno: stockDetails.Invoiceno,
        quantity: currentItem._id,
        quantityAmount: stockDetails.quantityAmount,
        unit: currentItem._id,
        rate: stockDetails.rate,
        taxpercent: currentItem._id,
        total: stockDetails.total,
        purorsell: stockDetails.purorsell
      };
  
      const stockReportResponse = await fetch("/api/stockreport", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeStockDetails),
      });
  
      if (!stockReportResponse.ok) {
        const errorData = await stockReportResponse.json().catch(() => ({
          error: `Server returned ${stockReportResponse.status}`
        }));
        throw new Error(errorData.error || 'Failed to create stock report');
      }
  
      const stockReportData = await stockReportResponse.json();
  
      const quantityChange = completeStockDetails.purorsell === 'purchase' 
        ? completeStockDetails.quantityAmount 
        : -completeStockDetails.quantityAmount;
  
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
    <div className="bg-amber-50 min-h-screen">
      <Navbar />
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
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
            <span className="mt-4 text-gray-700">Loading Inventory List...</span>
          </div>
        </div>
      )}
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Inventory List</h1>
        <button
          onClick={() => {
            setShowModal(true);
            setCurrentItem(null);
          }}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4">
        
          Add Items +
        </button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#164E63" }}>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Item Code</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Group</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Segment</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Auditable</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Tax</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Unit</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item._id} sx={{ backgroundColor: "white" }}>
                  <TableCell sx={{ textAlign: "center" }}>{item.itemCode}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{item.name}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{item.group}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{item.segment?.itemName}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{item.auditable}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{item.tax}%</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{item.stock}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>{item.quantityUnit}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => {
                        setShowModal(true);
                        setCurrentItem(item);
                      }}
                    >
                      Edit Item
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
    alert("Not enough stocks available");
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

