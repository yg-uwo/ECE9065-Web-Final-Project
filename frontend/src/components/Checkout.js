import React, {Component} from "react";
import ApiService from "../services/ApiService";

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
        };
    }

    async handleCheckout() {
        const {cart, onComplete} = this.props;
        try {
            const response = await ApiService.checkout(cart);
            alert(`Payment Successful! OrderID: ${response.orderId}`);
            onComplete();
        } catch (error) {
            this.setState({error: error.message});
        }
    }

    render() {
        const { cart } = this.props;
        const { error } = this.state;

        return (
            <div>
                <h2>Checkout</h2>
                {error && <p>Error: {error}</p>}
                <ul>
                    {cart.items.map((item) => (
                        <li key={item.productId._id}>
                            {item.productId.name} - Quantity: {item.quantity}
                        </li>
                    ))}
                </ul>
                <button onClick={() => this.handleCheckout()}>Pay Now</button>

            </div>
        );
    }
}

export default Checkout;