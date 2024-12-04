import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Container, Navbar } from 'react-bootstrap';
import homepage_image from '../assets/images/homepage.jpg';
import { useSelector } from 'react-redux';
import Pagination from "../components/Pagination";
import Filters from "../components/Filters";
import { useNavigate } from 'react-router-dom';
import '../assets/css/product-list-styles.css'; // Import the CSS styles

const ProductList = () => {
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL;
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    price: '',
    manufacturer: '',
    title: '',
  });

  const { isAuthenticated, role, token } = useSelector((state) => state.auth);

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
        setProducts(data.data);
        setTotalPages(Math.ceil(data.total / 10));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, token, filters]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <>
      <Navbar bg="light" expand="lg" className="d-flex justify-content-center align-items-center">
          {/* <Navbar.Brand href="#" className="d-flex justify-content-center">Product Filters</Navbar.Brand> */}
          <Navbar.Toggle aria-controls="navbar-filters" />
          <Navbar.Collapse id="navbar-filters" className="d-flex justify-content-center">
          <Filters onFilterChange={handleFilterChange} />
          </Navbar.Collapse>
      </Navbar>

    <Container>
      {loading && <div>Loading...</div>}
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {products.map((product) => (
          <Col key={product._id}>
            <Card className="card h-100">
              <Card.Img
                className="imageFormat"
                variant="top"
                src={product.images[0] || homepage_image}
              />
              <Card.Body className="card-body">
                <Card.Title className="card-title">{product.title}</Card.Title>
                <Card.Text className="card-text">{product.specification?.cpu_model}</Card.Text>
                <div className="card-footer d-flex flex-column flex-sm-row justify-content-between">
                  <Button variant="primary" className="mb-2 mb-sm-0 me-sm-2" onClick={() => navigate(`/product/details/${product._id}`)}>View Details</Button>
                  {isAuthenticated && role === 'admin' && (
                    <>
                      <Button variant="warning" className="mb-2 mb-sm-0 me-sm-2">Add Product</Button>
                      <Button variant="danger">Remove Product</Button>
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Container>
    </>
  );
};

export default ProductList;