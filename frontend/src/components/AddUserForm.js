import React, { useState } from "react";
import { toast } from "react-toastify";
import { validateUserForm } from "../utils/validation";
import '../assets/css/user_modal_form.css'

const AddUserForm = ({ onAddUser, onClose, token }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "general",
  });
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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/add_user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to add user.");
      }

      const newUser = await response.json();
      toast.success("User added successfully!");
      onAddUser(newUser);
      onClose();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    
    <form onSubmit={handleSubmit} className="p-4 rounded shadow-sm bg-light">
      <div className="form-group mb-3">
        <label className="form_label">First Name</label>
        <input
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="form-group mb-3">
        <label className="form_label">Last Name</label>
        <input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="form-group mb-3">
        <label className="form_label">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="form-group mb-3">
        <label className="form_label">Phone</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="form-group mb-3">
        <label className="form_label">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>

      <div className="form-group mb-4">
        <label className="form_label">Role</label>
        <div>
          <label className="me-3">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={formData.role === "admin"}
              onChange={handleChange}
            />{" "}
            Admin
          </label>
          <label>
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

      <button type="submit" className="btn btn-primary w-100 py-2">
        Add User
      </button>
    </form>

  );
};

export default AddUserForm;
