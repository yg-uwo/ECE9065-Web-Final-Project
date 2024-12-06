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

        const updatedItems = cart.items.map((item) => {
            if (item.productId === productId) {
                const newQuantity = item.quantity + delta;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
            }
            return item;
        }).filter((item) => item !== null);

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

    handlePaymentChange = (name, value) => {
        this.setState((prevState) => ({
            paymentDetails: { ...prevState.paymentDetails, [name]: value },
        }));
    };

    handleCheckout = async () => {
        const { cart } = this.state;
        cart.email="aekam59@gmail.com"
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
