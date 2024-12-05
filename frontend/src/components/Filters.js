import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Modal, Button, Form } from "react-bootstrap";
import AddProductForm from "./AddProductForm";
import { toast } from "react-toastify";

const Filters = ({ onFilterChange }) => {
  const { isAuthenticated, role, token } = useSelector((state) => state.auth);
  const [showModal, setShowModal] = useState(false);
  
  const [filters, setFilters] = useState({
    category: '',
    price: '',
    manufacturer: '',
    title: '',
  });

 
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));

    
    onFilterChange({ ...filters, [name]: value });
  };

  const handleAddProduct = async (productData) => {
    
    console.log(productData);
    const response = await fetch(`${process.env.REACT_APP_API_URL}/product/add_product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error("Failed to add user.");
    }

    const newProduct = await response.json();
    console.log(newProduct);
    toast.success("Product added successfully!");
    // onAddUser(newProduct);
    // onClose();
    
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Category filter */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="category" style={{ marginBottom: '0.5rem' }}>Category:</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            <option value="laptop">Laptop</option>
            <option value="keyboard">Keyboard</option>
            <option value="mouse">Mouse</option>
          </select>
        </div>

        {/* Price filter */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="price" style={{ marginBottom: '0.5rem' }}>Price:</label>
          <select
            id="price"
            name="price"
            value={filters.price}
            onChange={handleFilterChange}
          >
            <option value="">All Prices</option>
            <option value="0-500">$0 - $500</option>
            <option value="500-1000">$500 - $1000</option>
            <option value="1000-1500">$1000 - $1500</option>
            <option value="1500+">$1500+</option>
          </select>
        </div>

        {/* Manufacturer filter */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="manufacturer" style={{ marginBottom: '0.5rem' }}>Manufacturer:</label>
          <select
            id="manufacturer"
            name="manufacturer"
            value={filters.manufacturer}
            onChange={handleFilterChange}
          >
            <option value="">All Manufacturers</option>
            <option value="Dell">Dell</option>
            <option value="Acer">Acer</option>
            <option value="Lenovo">Lenovo</option>
            <option value="Logitech">Logitech</option>
          </select>
        </div>

        {/* Title filter */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label htmlFor="title" style={{ marginBottom: '0.5rem' }}>Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={filters.title}
            onChange={handleFilterChange}
            placeholder="Search by title"
          />
        </div>
        {isAuthenticated && role === 'admin' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Button onClick={() => setShowModal(true)}>Add Product</Button>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Add New Product</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <AddProductForm
                  onAddProduct={handleAddProduct}
                  onClose={() => setShowModal(false)}
                  token={token}
                />
              </Modal.Body>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
};

export default Filters;
