import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image, Button, ListGroup } from 'react-bootstrap';

const ProductDetails = () => {
  const { productId } = useParams(); // Get the product ID from the URL
  const baseUrl = process.env.REACT_APP_API_URL; // API Base URL from .env file
  const [product, setProduct] = useState(null); // State to store product details
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [userId, setUserId] = useState(''); // Assuming you have a user ID (you may need to set this dynamically)

  useEffect(() => {
    if (!productId) {
      setError('Invalid Product ID');
      return;
    }

    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseUrl}/product/${productId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data); // Update product details
      } catch (err) {
        setError('Failed to fetch product details.');
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]); // Fetch details when the productId changes

  const handleAddToCart = async () => {
    if (!userId || !product) {
      setError('Invalid user or product details.');
      return;
    }

    const cartItem = {
      userId: userId, 
      items: 1, // Assuming you are adding one item to the cart. You can change this if needed.
      product: productId, // Add the productId to the cart.
    };

    try {
      const response = await fetch(`${baseUrl}/cart`, {
        method: 'POST', // Assuming POST request for adding to cart
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Cart updated successfully:', data);
    } catch (err) {
      setError('Failed to update cart.');
      console.error('Error adding to cart:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state
  }

  if (error) {
    return <div>{error}</div>; // Show error message
  }

  if (!product) {
    return <div>No product found.</div>; // Handle missing product
  }

  return (
    <Container>
      <Row className="mt-4">
        {/* Images on the left */}
        <Col md={6}>
          {product.images && product.images.length > 0 ? (
            <div>
              {product.images.map((image, index) => (
                <Image key={index} src={image} alt={product.title} fluid className="mb-2" />
              ))}
            </div>
          ) : (
            <Image src="/path/to/placeholder-image.jpg" alt="No images available" fluid />
          )}
        </Col>

        {/* Details on the right */}
        <Col md={6}>
          <h2>{product.title}</h2>
          <p>{product.description}</p>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>CPU Model:</strong> {product.specification?.cpu_model || 'N/A'}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Price:</strong> ${product.price || 'N/A'}
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Manufacturer:</strong> {product.manufacturer || 'N/A'}
            </ListGroup.Item>
          </ListGroup>
          <Button variant="primary" className="mt-3" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;
