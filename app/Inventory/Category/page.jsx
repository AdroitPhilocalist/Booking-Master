"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../../_components/Navbar";
import { Footer } from "../../_components/Footer";

export default function InventoryCategory() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); // For editing

  useEffect(() => {
    const fetchProducts = async () => {
      // Set loading to true before fetch
      try {
        const response = await fetch("/api/InventoryCategory");
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
      // Set loading to false after data is fetched
    };
    fetchProducts();
  }, [products]);

  // Handle Add/Edit Product
  const handleAddProduct = async (productName) => {
    if (currentProduct) {
      // Edit mode
      const updatedProduct = { ...currentProduct, itemName: productName };
      const response = await fetch(`/api/InventoryCategory/${currentProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProduct),
      });
      const data = await response.json();

      if (data.product) {
        setProducts((prev) =>
          prev.map((product) =>
            product.id === currentProduct.id ? data.product : product
          )
        );
      }
      setCurrentProduct(null);
    } else {
      // Add new product
      const response = await fetch("/api/InventoryCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: productName }),
      });
      const data = await response.json();

      if (data.product) {
        setProducts((prev) => [...prev, data.product]);
      }
    }
    setShowModal(false);
  };

  // Toggle Active/Inactive Status
  const toggleActiveStatus = async (id) => {
    const product = products.find((product) => product.id === id);
    if (!product) return;

    const updatedProduct = { ...product, isActive: !product.isActive };

    const response = await fetch(`/api/InventoryCategory/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });
    const data = await response.json();

    if (data.product) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? data.product : product
        )
      );
    }
  };

  // Handle Edit Product
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setShowModal(true);
  };

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      <div className="container mx-auto p-4">
        <h1 className="text-xl font-bold mb-4">Segments List</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Add New +
        </button>

        

        {/* Table */}
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td className="border border-gray-300 px-4 py-2">{product.itemName}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      onClick={() => toggleActiveStatus(product._id)}
                      className={`px-4 py-2 rounded ${product.isActive ? "bg-green-500" : "bg-red-500"} text-white`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="border border-gray-300 px-4 py-2 text-center">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {showModal && (
          <AddProductModal
            onClose={() => {
              setShowModal(false);
              setCurrentProduct(null);
            }}
            onSubmit={handleAddProduct}
            initialValue={currentProduct ? currentProduct.itemName : ""}
          />
        )}
      </div>

      <Footer />
    </div>
  );
}

// Modal component for adding/editing a product
const AddProductModal = ({ onClose, onSubmit, initialValue }) => {
  const [productName, setProductName] = useState(initialValue);

  const handleSubmit = () => {
    onSubmit(productName);
    setProductName(""); // Reset field
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Add/Edit Product</h2>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          className="border p-2 mb-4 w-full"
        />
        <div className="flex justify-between">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};