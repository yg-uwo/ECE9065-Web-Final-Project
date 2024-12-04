import React, { useState, useEffect, useCallback } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import UserFilter from "../components/UserFilter";
import Pagination from "../components/Pagination";
import UpdateUserModal from "../components/UpdateUserModal";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";


const UserList = () => {
  const token = useSelector((state) => state.auth.token);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const usersPerPage = 6;

  // Fetch users from the API
  const fetchUsers = useCallback(
    async (page = 1, limit = 10) => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/user/listing?page=${page}&limit=${limit}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users. Please try again.");
        }

        const data = await response.json();
        setUsers(data.data || []);
        setFilteredUsers(data.data || []);
      } catch (error) {
        console.error("Error fetching users:", error.message);
        alert(error.message);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    const filtered = users.filter((user) =>
      type === "email"
        ? user?.email?.toLowerCase().includes(value.toLowerCase())
        : user?.phone?.includes(value)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to the first page
  };

  // Handle adding a new user
  const handleAddUser = (newUser) => {
    setUsers([newUser.data, ...users]);
    setFilteredUsers([newUser.data, ...filteredUsers]);
  };

  // Handle deleting a user
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/user/delete_user/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user.");
      }
      toast.error("User Deleted successfully!");
      setUsers(users.filter((user) => user._id !== id));
      setFilteredUsers(filteredUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error.message);
      alert(error.message);
    }
  };

  // Open the UpdateUserModal
  const handleUpdate = (id) => {
    setSelectedUserId(id);
    setShowUpdateModal(true);
  };

  // Handle user update completion
  const handleUserUpdated = (updatedUser) => {
    const updatedUsers = users.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setShowUpdateModal(false);
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  return (
    <div className="container mt-4">
      <h1>User List</h1>

      {/* Filter Component */}
      <UserFilter onFilterChange={handleFilterChange} onAddUser={handleAddUser} />

      {/* Users List */}
      <div className="row">
        {currentUsers.map((user) => (
          <div key={user.id} className="col-12 col-md-6 mb-3">
            <div className="card shadow-sm border-warning">
              <div className="card-body">
                <h5 className="card-title text-primary">{user.first_name} {user.last_name}</h5>
                <p className="card-text">
                  <span className="text-muted"><i className="fas fa-envelope"></i> <strong>Email:</strong> {user.email}</span><br />
                  <span className="text-muted"><i className="fas fa-phone-alt"></i> <strong>Phone:</strong> {user.phoneNumber}</span><br />
                  <span className="badge bg-info text-white"><i className="fas fa-user-tag"></i> {user.role}</span>
                </p>
                <div className="d-flex justify-content-end">
                  <button
                    onClick={() => handleUpdate(user._id)}
                    className="btn btn-warning btn-sm mx-1"
                  >
                    <i className="fas fa-edit"></i> 
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="btn btn-danger btn-sm mx-1"
                  >
                    <i className="fas fa-trash"></i> 
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Component */}
      <Pagination
        totalPages={Math.ceil(filteredUsers.length / usersPerPage)}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Update User Modal */}
      {showUpdateModal && (
        <UpdateUserModal
          userId={selectedUserId}
          onClose={() => setShowUpdateModal(false)}
          onUserUpdated={handleUserUpdated}
          token={token}
        />
      )}
    </div>
  );
};

export default UserList;
