import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";
import { validateUserForm } from "../utils/validation";


const UpdateUserModal = ({ userId, onClose, onUserUpdated, token }) => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phoneNumber: "",
        role: "general",
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                console.log(data.user);
                setFormData(data.user);
            } catch (error) {
                toast.error("Failed to fetch user details.");
            }
        };
        fetchUserData();
    }, [userId, token]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateUserForm(formData);
        if (validationError) {
            toast.error(validationError);
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/update_user/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to update user.");
            }

            const updatedUser = await response.json();
            toast.success("User updated successfully!");
            onUserUpdated(updatedUser);
            onClose();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <Modal show onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Update User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="first_name"
                            value={formData.first_name || ""}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="last_name"
                            value={formData.last_name || ""}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber || ""}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Role</Form.Label>
                        <Form.Control
                            as="select"
                            name="role"
                            value={formData.role || ""}
                            onChange={handleChange}
                        >
                            <option value="admin">Admin</option>
                            <option value="general">General</option>
                        </Form.Control>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Save Changes
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateUserModal;
