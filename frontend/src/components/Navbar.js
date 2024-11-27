import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const NavbarComponent = () => {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">E-Commerce</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/">Home</Nav.Link>
            {isAuthenticated && role === 'admin' && (
              <Nav.Link href="/users">User List</Nav.Link>
            )}
            {isAuthenticated ? (
              <Nav.Link href="/logout">Logout</Nav.Link>
            ) : (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
