import React, { Component } from "react";
import ApiService from "../services/ApiService";
import "./cart.css";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: null,
            error: null,
            loading: true,
            isCheckingOut: false,
            paymentDetails: {
                cardNumber: "",
                expiryDate: "",
                cvv: "",
            },
            validationErrors: {},
        };
    }

    componentDidMount() {
        this.fetchCart();
    }

    async fetchCart() {
        const { userId } = this.props;
        try {
            const cart = await ApiService.getCart(userId);
            this.setState({ cart, loading: false });
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    }

    updateQuantity = (productId, delta) => {
        this.setState((prevState) => {
            const updatedItems = prevState.cart.items.map((item) => {
                if (item.productId === productId) {
                    return {
                        ...item,
                        quantity: Math.max(1, item.quantity + delta),
                    };
                }
                return item;
            });

            return {
                cart: { ...prevState.cart, items: updatedItems },
            };
        });
    };

    calculateTotal = () => {
        const { cart } = this.state;
        return cart.items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    validatePaymentDetails = () => {
        const { cardNumber, expiryDate, cvv } = this.state.paymentDetails;
        const validationErrors = {};
        const currentDate = new Date();

        if (cardNumber.length < 13 || cardNumber.length > 19) {
            validationErrors.cardNumber = "Invalid credit card number.";
        }

        // Validate Expiry Date (format MM/YY and should be in the future)
        const [month, year] = expiryDate.split("/").map((val) => parseInt(val, 10));
        if (
            !expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/) ||
            !year ||
            new Date(`20${year}-${month}-01`) <= currentDate
        ) {
            validationErrors.expiryDate = "Invalid or expired expiry date.";
        }

        // Validate CVV (3-digit number)
        if (!cvv.match(/^\d{3}$/)) {
            validationErrors.cvv = "CVV must be a 3-digit number.";
        }

        this.setState({ validationErrors });
        return Object.keys(validationErrors).length === 0; // Return true if no errors
    };

    handleCheckout = async () => {
        if (!this.validatePaymentDetails()) {
            return;
        }

        const { onCheckout } = this.props;
        const { cart } = this.state;

        if (!onCheckout || !cart) {
            this.setState({ error: "Unable to proceed with checkout." });
            return;
        }

        this.setState({ isCheckingOut: true });

        try {
            await onCheckout(cart);
            this.setState({
                cart: null,
                paymentDetails: { cardNumber: "", expiryDate: "", cvv: "" },
                error: null,
            });
            alert("Order placed successfully!");
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ isCheckingOut: false });
        }
    };

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState((prevState) => ({
            paymentDetails: { ...prevState.paymentDetails, [name]: value },
        }));
    };

    render() {
        const { cart, error, loading, isCheckingOut, paymentDetails, validationErrors } = this.state;

        if (loading) return <p>Loading...</p>;
        if (error) return <p>{error}!!!</p>;
        if (!cart || !cart.items || cart.items.length === 0) return <p>Your cart is empty.</p>;

        const defaultImage = "https://via.placeholder.com/150";

        return (
            <div className="cart-container">
                <h2>Your Cart</h2>
                <div className="cart-items">
                    {cart.items.map((item) => (
                        <div key={item.productId} className="cart-item">
                            <img
                                src={item.imageUrl || defaultImage}
                                alt={item.productName}
                                className="cart-item-image"
                            />
                            <div className="cart-item-info">
                                <h3>{item.productName}</h3>
                                <p>Price: ${item.price}</p>
                                <div className="cart-item-controls">
                                    <button onClick={() => this.updateQuantity(item.productId, -1)}>
                                        -
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => this.updateQuantity(item.productId, 1)}>
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <h3>Total: ${this.calculateTotal()}</h3>

                <div className="payment-section">
                    <h3>Payment Details</h3>
                    <form className="payment-form">
                        <label>
                            Card Number
                            <input
                                type="text"
                                name="cardNumber"
                                value={paymentDetails.cardNumber}
                                onChange={this.handleInputChange}
                                placeholder="1234 5678 9012 3456"
                            />
                            {validationErrors.cardNumber && (
                                <span className="error">{validationErrors.cardNumber}</span>
                            )}
                        </label>
                        <label>
                            Expiry Date
                            <input
                                type="text"
                                name="expiryDate"
                                value={paymentDetails.expiryDate}
                                onChange={this.handleInputChange}
                                placeholder="MM/YY"
                            />
                            {validationErrors.expiryDate && (
                                <span className="error">{validationErrors.expiryDate}</span>
                            )}
                        </label>
                        <label>
                            CVV
                            <input
                                type="password"
                                name="cvv"
                                value={paymentDetails.cvv}
                                onChange={this.handleInputChange}
                                placeholder="123"
                            />
                            {validationErrors.cvv && (
                                <span className="error">{validationErrors.cvv}</span>
                            )}
                        </label>
                    </form>
                </div>

                <button
                    onClick={this.handleCheckout}
                    disabled={isCheckingOut}
                    className="checkout-button"
                >
                    {isCheckingOut ? "Processing..." : "Place Order"}
                </button>
            </div>
        );
    }
}

export default Cart;
