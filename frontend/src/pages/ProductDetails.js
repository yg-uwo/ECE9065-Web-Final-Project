import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Image, Button, ListGroup, Carousel, Card, Dropdown } from 'react-bootstrap';
import homepage_image from '../assets/images/homepage.jpg';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from "react-toastify";

const ProductReviewsPage = () => {
  const { productId } = useParams(); // Get the product ID from the URL
  const baseUrl = process.env.REACT_APP_API_URL; // API Base URL from .env file
  const [product, setProduct] = useState(null); // State to store product details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  // const [userId, setUserId] = useState(''); // Assuming you have a user ID
  const [sortOption, setSortOption] = useState('newest'); // Default sorting option
  const userId = useSelector((state) => state.auth.userId);
  const email = useSelector((state) => state.auth.email);
  const formatKey = (key) => {
    return key
      .split('_') // Split the key by underscores
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' '); // Join the words back with spaces
  };

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
    console.log("User ID:", userId);  // Add this to see if userId is set correctly
    console.log("Product:", product);

    if (!userId || !product) {
      setError('Invalid user or product details.');
      return;
    }

    const currentCart = await fetch(`${baseUrl}/cart/${userId}`, {  // Assuming '/cart/update' for the updateCart route
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    
    if (currentCart.ok) {
      const dataCart = await currentCart.json();
      const isProductInItems = dataCart.items.some(item => item.productId === product.productId);

      if(isProductInItems) {
        toast.success("Item Already Present in Cart");
        return;
      }
    }

  
    const cartItem = {
      userId: userId,
      items: [
        {
          productId: product.productId,  
          quantity: 1,    
          email:email,        
          imageUrl: product.images && product.images.length > 0 ? product.images[0] : '', 
          productName: product.title,  
          price: product.price || 0,
        },
      ],
    };

    console.log("ProductId:", cartItem);
  
    try {
      const response = await fetch(`${baseUrl}/cart`, {  // Assuming '/cart/update' for the updateCart route
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
      toast.success("Added to cart")
      // Optionally, you could update the cart state or show a success message
    } catch (err) {
      setError('Failed to update cart.');
      console.error('Error adding to cart:', err);
    }
  };
  const sortReviews = (reviews) => {
    if (sortOption === 'high-to-low') {
      return [...reviews].sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'low-to-high') {
      return [...reviews].sort((a, b) => a.rating - b.rating);
    } else {
      return [...reviews].sort(
        (a, b) => new Date(b.review_submission_time) - new Date(a.review_submission_time)
      );
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
          {/* Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <>
              <h4 className="mt-3">Customer Reviews</h4>
              <Dropdown className="mb-3">
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  Sort by: {sortOption.replace(/-/g, ' ')}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setSortOption('newest')}>Newest First</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortOption('high-to-low')}>Rating: High to Low</Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortOption('low-to-high')}>Rating: Low to High</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              <div
                style={{
                  maxHeight: '400px', // Increased height for scrollable reviews
                  overflowY: 'scroll',
                  border: '1px solid #ddd',
                  padding: '10px',
                }}
              >
                {sortReviews(product.reviews).map((review, index) => (
                  <Card key={index} className="mb-3">
                    <Card.Body>
                      <Card.Title>{review.title}</Card.Title>
                      <Card.Text>
                        <strong>Review By:</strong> {review.user_nickname}
                      </Card.Text>
                      <Card.Text>
                        <strong>Date:</strong> {new Date(review.review_submission_time).toLocaleDateString()}
                      </Card.Text>
                      <Card.Text>
                        <strong>Comments:</strong> {review.text}
                      </Card.Text>
                      <Card.Text>
                        <strong>User Rating:</strong> {review.rating}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </>
          )}
        </Col>
      </Row>

      <h2>{product?.title || 'No title available'}</h2>   
      <h4 className="mt-3">{product?.price ? `$${product.price}` : 'Price not available'}</h4>
      {/* Specifications Section */}
      {product.specification && Object.keys(product.specification).length > 0 && (
        <Row className="mt-5">
          <Col md={12}>
            <h4>Specifications</h4>
            <div
              style={{
                maxHeight: '300px', // Adjust the height as needed
                overflowY: 'scroll', // Enable vertical scrolling
                border: '1px solid #ddd', // Optional: adds a border around the specifications
                padding: '10px', // Optional: add padding for better visual spacing
              }}
            >
              <ListGroup variant="flush">
                {Object.entries(product.specification).map(([key, value], index) => (
                  <ListGroup.Item key={index}>
                     <strong>{formatKey(key)}:</strong> {value}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Col>
        </Row>
      )}

      {/* Center the Add to Cart button */}
      <Row className="mt-4 d-flex justify-content-center">
        <Col xs="auto">
          <Button variant="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductReviewsPage;
