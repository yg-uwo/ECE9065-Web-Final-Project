import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const NavbarComponent = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">E-Commerce</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">

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
