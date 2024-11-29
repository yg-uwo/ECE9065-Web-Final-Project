import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import AddUserForm from "./AddUserForm";
import { useSelector } from "react-redux";


const UserFilter = ({ onFilterChange, onAddUser }) => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showModal, setShowModal] = useState(false);

  const token = useSelector((state) => state.auth.token);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    onFilterChange("email", e.target.value);
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
    onFilterChange("phone", e.target.value);
  };

  const handleAddUser = (userData) => {
    onAddUser(userData);
    setShowModal(false);
  };

  return (
    <>
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Filter by phone number"
            value={phone}
            onChange={handlePhoneChange}
          />
        </div>
        <div className="col-md-4">
          <Button onClick={() => setShowModal(true)}>Add User</Button>
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddUserForm
            onAddUser={handleAddUser}
            onClose={() => setShowModal(false)}
            token={token} 
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserFilter;
