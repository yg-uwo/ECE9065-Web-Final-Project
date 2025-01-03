import React, { Component } from "react";
import ApiService from "../services/ApiService";
import CartItem from "./CartItem";
import PaymentForm from "./PaymentForm";
import OrderSummary from "./OrderSummary";
import "../assets/css/cart.css";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: null,
            error: null,
            loading: true,
            paymentDetails: {
                cardNumber: "",
                expiryDate: "",
                cvv: "",
            },
            validationErrors: {},
            isCheckingOut: false,
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

    updateQuantity = async (productId, delta) => {
        const { userId } = this.props;
        const { cart } = this.state;

        const updatedItems = cart.items
            .map((item) => {
                if (item.productId === productId) {
                    const newQuantity = item.quantity + delta;
                    return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                }
                return item;
            })
            .filter((item) => item !== null);

        const updatedCart = { ...cart, items: updatedItems };

        try {
            console.log("Updated Cart", updatedCart);
            await ApiService.updateCart(userId, updatedCart); // Sync with backend
            this.setState({ cart: updatedCart });
        } catch (error) {
            console.error("Failed to update cart:", error.message);
        }
    };

    clearCart = async () => {
        const { userId } = this.props;

        try {
            await ApiService.clearCart(userId);
            this.setState({ cart: { items: [] } }); // Clear local state
        } catch (error) {
            console.error("Failed to clear cart:", error.message);
        }
    };

    validatePaymentDetails = () => {
        const { cardNumber, expiryDate, cvv } = this.state.paymentDetails;
        const validationErrors = {};

        // Validate card number (16 digits)
        if (!/^\d{16}$/.test(cardNumber)) {
            validationErrors.cardNumber = "Card number must be 16 digits.";
        }

        // Validate expiry date (MM/YY format)
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
            validationErrors.expiryDate = "Expiry date must be in MM/YY format.";
        } else {
            const [month, year] = expiryDate.split("/");
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100; // Last 2 digits
            const currentMonth = currentDate.getMonth() + 1; // 0-indexed
            if (
                parseInt(year, 10) < currentYear ||
                (parseInt(year, 10) === currentYear && parseInt(month, 10) < currentMonth)
            ) {
                validationErrors.expiryDate = "Expiry date cannot be in the past.";
            }
        }

        // Validate CVV (3 digits)
        if (!/^\d{3}$/.test(cvv)) {
            validationErrors.cvv = "CVV must be 3 digits.";
        }

        return validationErrors;
    };

    handlePaymentChange = (name, value) => {
        this.setState(
            (prevState) => ({
                paymentDetails: { ...prevState.paymentDetails, [name]: value },
            }),
            () => {
                const validationErrors = this.validatePaymentDetails();
                this.setState({ validationErrors });
            }
        );
    };

    handleCheckout = async () => {
        const validationErrors = this.validatePaymentDetails();
        if (Object.keys(validationErrors).length > 0) {
            this.setState({ validationErrors });
            alert("Please fix the validation errors before proceeding.");
            return;
        }

        const { cart } = this.state;
        cart.email = "testUser@gmail.com"; // Example email
        this.setState({ isCheckingOut: true });
        try {
            await ApiService.checkout(cart);
            await this.clearCart();
            alert("Order placed successfully!");
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ isCheckingOut: false });
        }
    };

    render() {
        const { cart, error, loading, paymentDetails, validationErrors, isCheckingOut } = this.state;

        if (loading) return <p>Loading...</p>;
        if (error) return <p>{error}</p>;
        if (!cart || !cart.items || cart.items.length === 0) return <p>Your cart is empty.</p>;

        return (
            <div className="cart-container">
                <h2>Your Cart</h2>
                <div className="cart-items">
                    {cart.items.map((item) => (
                        <CartItem
                            key={item.productId}
                            item={item}
                            onUpdateQuantity={this.updateQuantity}
                        />
                    ))}
                </div>
                <OrderSummary cart={cart} />
                <PaymentForm
                    paymentDetails={paymentDetails}
                    validationErrors={validationErrors}
                    onInputChange={this.handlePaymentChange}
                />
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
