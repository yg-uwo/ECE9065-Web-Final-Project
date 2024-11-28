import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
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
                const user = await response.json();
                console.log(user);
                setFormData(user);
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/user/${userId}`, {
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
        <div className="modal">
            <div className="modal-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="form-control"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={formData.role === "admin"}
                                    onChange={handleChange}
                                />{" "}
                                Admin
                            </label>
                            <label className="ml-3">
                                <input
                                    type="radio"
                                    name="role"
                                    value="general"
                                    checked={formData.role === "general"}
                                    onChange={handleChange}
                                />{" "}
                                General
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Update User
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateUserModal;
