import React,{useState} from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import UpdateUserModal from "../components/UpdateUserModal";

const NavbarComponent = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const { isAuthenticated, role, token,userId } = useSelector((state) => state.auth);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

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

 
  const handleUpdate = () => {
    let id = userId
    setSelectedUserId(id);
    setShowUpdateModal(true);
  };

  
  const handleUserUpdated = (updatedUser) => {
    setShowUpdateModal(false);
    
  };

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
            {isAuthenticated && role === 'admin' && (
              <Nav.Link as={Link} to="/orders">Order List</Nav.Link>
            )}
            {isAuthenticated && (
              <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
            )}
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/products">Products</Nav.Link>
                <Nav.Link as="span" onClick={handleUpdate}>
                  Profile
                </Nav.Link>
                <Nav.Link href="/logout">Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
        {showUpdateModal && (
          <UpdateUserModal
            userId={selectedUserId}
            onClose={() => setShowUpdateModal(false)}
            onUserUpdated={handleUserUpdated}
            token={token}
          />
        )}
      </Container>
    </Navbar>


  );
};

export default NavbarComponent;
