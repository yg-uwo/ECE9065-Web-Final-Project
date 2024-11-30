import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Container } from 'react-bootstrap';
import homepage_image from '../assets/images/homepage.jpg';
import { useSelector } from 'react-redux';
import Pagination from "../components/Pagination"; // Import the Pagination component
import Filters from "../components/Filters"; // Import the Filters component
import { Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL; // API Base URL from .env file
  const [products, setProducts] = useState([]); // State to store products
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [totalPages, setTotalPages] = useState(1); // Total pages based on total items
  const [loading, setLoading] = useState(false); // Loading state
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProductId, setselectedProductId] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    price: '',
    manufacturer: '',
    title: '',
  }); // Filter state

  const { isAuthenticated, role, token } = useSelector((state) => state.auth);
  // const token = useSelector((state) => state.auth.token);

  // Fetch products when the component mounts or when the page or filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          category: filters.category,
          price: filters.price,
          manufacturer: filters.manufacturer,
          title: filters.title,
        }).toString();

        const response = await fetch(`${baseUrl}/product/listing/?${queryParams}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched data:', data);

        // Set the products and total pages based on the API response
        setProducts(data.data); // Set the array of products
        setTotalPages(Math.ceil(data.total / 10)); // Assuming each page has 10 products
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts(); // Fetch products for the current page and filters
  }, [currentPage, token, filters]); // Re-fetch when page, token, or filters change

  // Function to handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle filter changes from Filters component
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters); // Update filters state
    setCurrentPage(1); // Reset to the first page whenever filters change
  };

  return (
    <Container>
      {/* Filters Component */}
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#">Product Filters</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbar-filters" />
          <Navbar.Collapse id="navbar-filters">
            <Filters onFilterChange={handleFilterChange} />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {loading && <div>Loading...</div>} {/* Show loading text */}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {products.map((product) => (
          <Col key={product._id}>
            <Card>
              <Card.Img
                variant="top"
                src={product.images[0] || homepage_image} // Use first image or fallback to homepage image
              />
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>{product.specification?.cpu_model}</Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="primary" className="me-2"  onClick={() => navigate(`/product/details/${product._id}`)}>View Details</Button>
                  {isAuthenticated && role === 'admin' && (
                    <>
                      <Button variant="warning" className="me-2">Add Product</Button>
                      <Button variant="danger">Remove Product</Button>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination component */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default ProductList;
