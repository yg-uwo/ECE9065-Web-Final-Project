import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Modal, Button, Form } from "react-bootstrap";
import { validateUserForm } from "../utils/validation";
import { useSelector,useDispatch } from 'react-redux';
import { login } from '../redux/auth_slice';
import '../assets/css/user_modal_form.css'

const UpdateUserModal = ({ userId, onClose, onUserUpdated, token }) => {
    const role = useSelector((state) => state.auth.role);
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
            toast.success(`${updatedUser.first_name},profile updated successfully`);
           
            onUserUpdated(updatedUser);
            onClose();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <Modal show onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label className="form_label">First Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="first_name"
                            value={formData.first_name || ""}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="form_label">Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="last_name"
                            value={formData.last_name || ""}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="form_label">Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email || ""}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className="form_label">Phone Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber || ""}
                            onChange={handleChange}
                            required
                            className="form-control"
                        />
                    </Form.Group>

                    {role === 'admin' && (
                        <Form.Group className="mb-3">
                            <Form.Label className="form_label">Role</Form.Label>
                            <Form.Control
                                as="select"
                                name="role"
                                value={formData.role || ""}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="admin">Admin</option>
                                <option value="general">General</option>
                            </Form.Control>
                        </Form.Group>
                    )}

                    <div className="d-flex justify-content-center mt-4">
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>

    );
};

export default UpdateUserModal;
