// frontend/src/components/ProductCatalog/ProductCatalog.js

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// New Dummy Data
export const DUMMY_PRODUCTS = [
  {
    _id: '1',
    productId: 'P001',
    productName: 'MacBook Pro 2021',
    type: 'Laptop',
    quantity: 10,
  },
  {
    _id: '2',
    productId: 'P002',
    productName: 'iPhone 13',
    type: 'Smartphone',
    quantity: 20,
  },
  {
    _id: '3',
    productId: 'P003',
    productName: 'Samsung Galaxy Tab',
    type: 'Tablet',
    quantity: 15,
  },
];

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{product.productName}</h2>
        <img
          src={`/api/placeholder/300/200`}
          alt={product.productName}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <p className="text-gray-600 mb-2">Type: {product.type}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold">Quantity: {product.quantity}</span>
          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {product.productId}
          </span>
        </div>
        <button
          onClick={() => navigate(`/product/${product._id}`)}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
        >
          More Details
        </button>
      </div>
    </div>
  );
};

const ProductCatalog = () => {
  const [products] = useState(DUMMY_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(products.map(product => product.type))];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Product Catalog</h1>

      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pl-10 border rounded-lg"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-lg"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductCatalog;
