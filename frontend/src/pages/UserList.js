import React, { useState, useEffect, useCallback } from "react";
import UserFilter from "../components/UserFilter";
import Pagination from "../components/Pagination";
import { useSelector } from "react-redux";

const UserList = () => {
  const token = useSelector((state) => state.auth.token);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Fetch users from the API
  const fetchUsers = useCallback(
    async (page = 1, limit = 10) => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/user/listing?page=${page}&limit=${limit}`,
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
    fetchUsers(); // Fetch users on component load
  }, [fetchUsers]);

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    const filtered = users.filter((user) =>
      type === "email"
        ? user.email.toLowerCase().includes(value.toLowerCase())
        : user.phone.includes(value)
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to the first page
  };

  // Handle adding a new user
  const handleAddUser = (newUser) => {
    setUsers([newUser, ...users]);
    setFilteredUsers([newUser, ...filteredUsers]);
  };

  // Handle deleting a user
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user.");
      }

      setUsers(users.filter((user) => user.id !== id));
      setFilteredUsers(filteredUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error.message);
      alert(error.message);
    }
  };

  // Handle updating a user (Placeholder)
  const handleUpdate = (id) => {
    alert(`Update user ${id}`);
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  return (
    <div className="container mt-4">
      <h1>User List</h1>

      {/* Filter Component */}
      <UserFilter onFilterChange={handleFilterChange} onAddUser={handleAddUser} />

      {/* User Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <button
                  onClick={() => handleUpdate(user.id)}
                  className="btn btn-warning btn-sm mx-1"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="btn btn-danger btn-sm mx-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

 
      <Pagination
        totalPages={Math.ceil(filteredUsers.length / usersPerPage)}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default UserList;
