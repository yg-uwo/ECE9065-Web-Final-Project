import React from "react";

const CartItem = ({ item, onUpdateQuantity }) => {
    const defaultImage = "https://via.placeholder.com/150";

    return (
        <div className="cart-item">
            <img
                src={item.imageUrl || defaultImage}
                alt={item.productName}
                className="cart-item-image"
            />
            <div className="cart-item-info">
                <h3>{item.productName}</h3>
                <p>Price: ${item.price}</p>
                <div className="cart-item-controls">
                    <button onClick={() => onUpdateQuantity(item.productId, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.productId, 1)}>+</button>
                </div>
            </div>
        </div>
    );
};

export default CartItem;
