import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, Table, Form, InputGroup, Button } from "react-bootstrap";


const OrdersPage = () => {
    const token = useSelector((state) => state.auth.token);
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        fetchOrders();
    }, [filter]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/orders/listing?first_name=${encodeURIComponent(filter)}`,
                {
                    method: "GET",
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
            setOrders(data || []);
        } catch (error) {
            console.error("Error fetching orders:", error.message);
            alert(error.message);
        }
    };

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        const formattedDate = date.toISOString().slice(0, 10); // Extract YYYY-MM-DD
        const formattedTime = date.toTimeString().slice(0, 8); // Extract HH:MM:SS
        return `${formattedDate} ${formattedTime}`;
      };

    return (
        <div className="container">
            <h1 className="my-4">Orders</h1>

            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="form-group">
                        <label htmlFor="firstNameFilter">Filter by First Name</label>
                        <div className="input-group">
                            <input
                                id="firstNameFilter"
                                type="text"
                                className="form-control"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                placeholder="Enter first name"
                            />
                            <div className="input-group-append ml-3">
                                <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    onClick={fetchOrders}
                                >
                                    Filter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Order Date</th>
                        <th>Status</th>
                        <th>Items</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={index}>
                            <td>{order.first_name}</td>
                            <td>{order.last_name}</td>
                            <td>{formatDate(order.updatedAt)}</td>
                            <td>{order.status}</td>
                            <td>
                                {order.items.map((item, idx) => (
                                    <div key={idx}>
                                        {item.productName} (Quantity: {item.quantity})
                                    </div>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersPage;
