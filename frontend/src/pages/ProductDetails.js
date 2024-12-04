import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image, Button, ListGroup, Carousel, Card, DropdownButton, Dropdown } from 'react-bootstrap';
import homepage_image from '../assets/images/homepage.jpg';

const ProductDetails = () => {
  const { productId } = useParams(); // Get the product ID from the URL
  const baseUrl = process.env.REACT_APP_API_URL; // API Base URL from .env file
  const [product, setProduct] = useState(null); // State to store product details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [userId, setUserId] = useState(''); // Assuming you have a user ID
  const [sortOption, setSortOption] = useState('Newest First'); // Default sort option

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
        setProduct(data.product); // Update product details
      } catch (err) {
        setError('Failed to fetch product details.');
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!userId || !product) {
      setError('Invalid user or product details.');
      return;
    }

    const cartItem = {
      userId: userId,
      items: 1, // Adding one item to the cart
      product: productId, // Add the productId to the cart
    };

    try {
      const response = await fetch(`${baseUrl}/cart`, {
        method: 'POST',
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

  // Function to handle sorting of reviews
  const sortReviews = (reviews) => {
    switch (sortOption) {
      case 'High to Low Rating':
        return reviews.sort((a, b) => b.rating - a.rating);
      case 'Low to High Rating':
        return reviews.sort((a, b) => a.rating - b.rating);
      case 'Newest First':
        return reviews.sort(
          (a, b) => new Date(b.review_submission_time) - new Date(a.review_submission_time)
        );
      default:
        return reviews;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!product) {
    return <div>No product found.</div>;
  }

  return (
    <Container>
      <Row className="mt-4">
        <Col md={6}>
          {product.images && product.images.length > 0 ? (
            <Carousel>
              {product.images.map((image, index) => (
                <Carousel.Item key={index}>
                  <Image src={image} alt={product.title} fluid />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : (
            <Image src={homepage_image} alt="No images available" fluid />
          )}
        </Col>

        <Col md={6}>
          <h2>{product?.title || 'No title available'}</h2>

          {/* Specifications Section */}
          {product.specification && Object.keys(product.specification).length > 0 && (
            <ListGroup variant="flush" className="mt-3">
              <h4>Specifications</h4>
              {Object.entries(product.specification).map(([key, value], index) => (
                <ListGroup.Item key={index}>
                  <strong>{key}:</strong> {value}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}

          <ListGroup variant="flush">
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

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <Row className="mt-5">
          <Col md={12}>
            <h3>Customer Reviews</h3>

            {/* Review Sorting Options */}
            <DropdownButton
              id="review-sort-dropdown"
              title={`Sort by: ${sortOption}`}
              className="mb-3"
              onSelect={(selectedOption) => setSortOption(selectedOption)}
            >
              <Dropdown.Item eventKey="Newest First">Newest First</Dropdown.Item>
              <Dropdown.Item eventKey="High to Low Rating">High to Low Rating</Dropdown.Item>
              <Dropdown.Item eventKey="Low to High Rating">Low to High Rating</Dropdown.Item>
            </DropdownButton>

            <div
              style={{
                maxHeight: '300px',
                overflowY: 'scroll',
                border: '1px solid #ddd',
                padding: '10px',
              }}
            >
              {/* Display sorted reviews */}
              {sortReviews(product.reviews).map((review, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    <Card.Title>{review.title}</Card.Title>
                    <Card.Text><strong>Review By:</strong> {review.user_nickname}</Card.Text>
                    <Card.Text><strong>Date:</strong> {new Date(review.review_submission_time).toLocaleDateString()}</Card.Text>
                    <Card.Text><strong>Comments:</strong> {review.text}</Card.Text>
                    <Card.Text><strong>User Rating:</strong> {review.rating}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default ProductDetails;
