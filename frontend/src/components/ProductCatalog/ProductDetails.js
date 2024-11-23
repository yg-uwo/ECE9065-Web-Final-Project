import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from '../ui/use-toast';

// Updated product details data
const productDetailsData = [
  {
    id: '1',
    productName: 'MacBook Pro 2021',
    type: 'Laptop',
    quantity: 10,
    description: 'The MacBook Pro 2021 is a powerful laptop with M1 Pro chip, 16GB RAM, and 512GB SSD.',
    price: '$1,999',
    features: ['M1 Pro Chip', '16GB RAM', '512GB SSD', 'Retina Display'],
  },
  {
    id: '2',
    productName: 'iPhone 13',
    type: 'Smartphone',
    quantity: 20,
    description: 'The iPhone 13 offers a powerful A15 Bionic chip, 5G capability, and an excellent camera system.',
    price: '$999',
    features: ['A15 Bionic Chip', '5G Support', 'Dual 12MP Cameras', 'Super Retina XDR Display'],
  },
  {
    id: '3',
    productName: 'Samsung Galaxy Tab',
    type: 'Tablet',
    quantity: 15,
    description: 'The Samsung Galaxy Tab offers a great balance of performance and portability.',
    price: '$349',
    features: ['10.4" Display', 'Snapdragon 662', '4GB RAM', '64GB Storage'],
  },
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Find the product by id
  const product = productDetailsData.find((p) => p.id === id);

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include auth token if you're using one
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: id,
          quantity: 1
        }),
        credentials: 'include' // This includes cookies in the request
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
      }

      const data = await response.json();
      
      toast({
        title: "Success",
        description: "Item added to cart successfully",
        duration: 3000,
      });

    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-blue-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to Catalog
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={`/api/placeholder/500/400`}
            alt={product.productName}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.productName}</h1>
          <p className="text-xl font-bold text-blue-600 mb-4">{product.price}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {product.features && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Key Features</h2>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className={`flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Adding...' : 'Add to Cart'}
            </button>
            <button
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;