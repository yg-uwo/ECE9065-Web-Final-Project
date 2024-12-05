import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

const NavbarComponent = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const { isAuthenticated, role,token } = useSelector((state) => state.auth);


  const handleSyncReviews = async () => {
    try {
      const response = await fetch(`${baseUrl}/product/sync_reviews`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
 
      });
  
      toast.success("Reviews Synced Successfully")
    } catch (error) {
      console.error('Error syncing reviews:', error);
      alert('Failed to sync reviews. Please try again later.');
    }
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>Computer Corner</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isAuthenticated && role === 'admin' && (
              <button
                className="btn btn-primary d-flex align-items-center"
                onClick={handleSyncReviews}
              >
                <i className="fa fa-sync me-2"></i> Sync Reviews
              </button>
            )}
            {isAuthenticated && role === 'admin' && (
              <Nav.Link as={Link} to="/users">User List</Nav.Link>
            )}
            {isAuthenticated && (
              <Nav.Link as={Link} to="/cart">Order</Nav.Link>
            )}
            {isAuthenticated && (
              <Nav.Link href="/logout">Logout</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
