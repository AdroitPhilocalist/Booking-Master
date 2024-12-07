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

export default function InventoryCategory() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/InventoryCategory");
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };
    fetchProducts();
  }, []);

  // Add or edit a product
  const handleAddProduct = async (productName) => {
    try {
      const method = currentProduct ? "PUT" : "POST";
      const url = currentProduct
        ? `/api/InventoryCategory/${currentProduct._id}`
        : "/api/InventoryCategory";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemName: productName,
          isActive: currentProduct ? currentProduct.isActive : true,
        }),
      });

      const data = await response.json();
      if (method === "POST") setProducts((prev) => [...prev, data.product]);
      else
        setProducts((prev) =>
          prev.map((product) =>
            product._id === data.product._id ? data.product : product
          )
        );

      setShowModal(false);
      setCurrentProduct(null);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Toggle product status
  const toggleActiveStatus = async (id) => {
    try {
      const product = products.find((p) => p._id === id);
      if (!product) return;
  
      const response = await fetch(`/api/InventoryCategory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (!data.product || !data.product.itemName) {
        throw new Error("Invalid product data returned from the API");
      }
  
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? data.product : p))
      );
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  return (
    <div className="bg-amber-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Inventory Category</h1>
        <button
          onClick={() => {
            setShowModal(true);
            setCurrentProduct(null); // Add new product
          }}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add New +
        </button>
        
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#164E63" }}>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Name</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Status</TableCell>
                <TableCell sx={{ color: "white", textAlign: "center" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id} sx={{ backgroundColor: "white" }}>
                  <TableCell sx={{ textAlign: "center" }}>{product.itemName}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color={product.isActive ? "success" : "error"}
                      size="small"
                      onClick={() => toggleActiveStatus(product._id)}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Button>
                  </TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => {
                        setShowModal(true);
                        setCurrentProduct(product);
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAddProduct}
          initialValue={currentProduct?.itemName || ""}
        />
      )}
      <Footer />
    </div>
  );
}

// Modal Component
const AddProductModal = ({ onClose, onSubmit, initialValue }) => {
  const [productName, setProductName] = useState(initialValue);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add/Edit Product</h2>
        <TextField 
          id="Product name" 
          label="Product Name" 
          variant="outlined"
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="w-full mb-4"
          fullWidth
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(productName)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {initialValue ? 'Update' : 'Add'} Product
          </button>
        </div>
      </div>
    </div>
  );
};