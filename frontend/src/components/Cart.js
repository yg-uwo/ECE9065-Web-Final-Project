import React, {Component} from "react";
import ApiService from "../services/ApiService";

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart: null,
            error: null,
            loading: true,
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

    render() {
        const { cart, error, loading} = this.state;
        const { onCheckout } = this.props;

        if (loading) return <p>Loading....</p>
        if (error) return <p>Error: {error}</p>
        if (!cart) return <p>Cart is empty.</p>

        return (
            <div>
                <h2>Cart</h2>
                <ul>
                {cart.items.map((item) => (
                    <li key={item.productId._id}>
                        {item.productId.name} - Quantity: {item.quantity}
                    </li>
                ))}
                </ul>
                <button onClick={() => onCheckout(cart)}>Proceed to Checkout</button>
            </div>
        );
    }
}

export default Cart;