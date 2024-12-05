import React from "react";

const OrderSummary = ({ cart }) => {
    const calculateSubtotal = () =>
        cart.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

    const calculateTax = (subtotal) => (subtotal * 0.1).toFixed(2); // Assuming 10% tax
    const calculateShipping = () => 5.0; // Fixed shipping fee

    const subtotal = parseFloat(calculateSubtotal());
    const tax = parseFloat(calculateTax(subtotal));
    const shipping = parseFloat(calculateShipping());
    const total = (subtotal + tax + shipping).toFixed(2);

    return (
        <div className="order-summary">
            <h3>Order Summary</h3>
            <p>Subtotal: ${subtotal}</p>
            <p>Tax: ${tax}</p>
            <p>Shipping: ${shipping}</p>
            <h3>Total: ${total}</h3>
        </div>
    );
};

export default OrderSummary;
