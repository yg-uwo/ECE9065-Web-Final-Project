import React, {Component} from "react";
import ApiService from "../services/ApiService";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: null,
            error: null,
            loading: true,
            isCheckingOut: false,
        };
    }

    componentDidMount() {
        this.fetchCart();
    }

    async fetchCart() {
        const { userId } = this.props;
        try {
            const cart = await ApiService.getCart(userId)
            this.setState({cart, loading: false});
        } catch (error) {
            this.setState({error: error.message, loading: false});
        }
    }

    handleCheckout = async () => {
        const { onCheckout } = this.props;
        const { cart } = this.state;

        if (!onCheckout || !cart) {
            this.setState({ error: "Unable to proceed with checkout." });
            return;
        }

        this.setState({ isCheckingOut: true }); // Indicate checkout in progress

        try {
            await onCheckout(cart); // Invoke the passed onCheckout function
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ isCheckingOut: false }); // Reset state after checkout
        }
    };

    render() {
        const { cart, error, loading, isCheckingOut} = this.state;

        if (loading) return <p>Loading....</p>
        if (error) return <p>Error: {error}</p>
        if (!cart || !cart.items || cart.items.length === 0) return <p>Your cart is empty.</p>;

        return (
            <div>
                <h2>Your Cart</h2>
                <ul>
                    {cart.items.map((item) => (
                        <li key={item.productId._id}>
                            {item.productId.name} - Quantity: {item.quantity}
                        </li>
                    ))}
                </ul>
                <button
                    onClick={this.handleCheckout}
                    disabled={isCheckingOut} // Disable button during checkout
                >
                    {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
                </button>
            </div>
        );
    }
}

export default Cart;