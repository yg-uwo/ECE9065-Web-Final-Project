import React, { useState } from 'react';

const Filters = ({ onFilterChange }) => {
  // Define the state for each filter
  const [filters, setFilters] = useState({
    category: '',
    price: '',
    manufacturer: '',
    title: '',
  });

  // Handle changes in the filter fields
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));

    // Call the onFilterChange callback to update parent component
    onFilterChange({ ...filters, [name]: value });
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
      </div>
    </div>
  );
};

export default Filters;
