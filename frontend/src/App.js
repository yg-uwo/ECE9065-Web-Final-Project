
import './App.css';
import React, {Component} from "react";
import Header from './components/Header';
import Cart from './components/Cart';
import Checkout from './components/Checkout';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "user123",
      cart: null,
    };
  }
  setCheckoutCart = (cart) => {
    this.setState({ cart });
  };

  resetCart = () => {
    this.setState({ cart: null});
  };

  render() {
    const { userId, cart } = this.state;

    return (
      <div>
        <Header />
        {!cart ? (
          <Cart userId={userId} onCheckout={this.setCheckoutCart} />
        ) : (
          <Checkout cart={cart} onComplete={this.resetCart} />
        )}
      </div>
    )
  }
}

export default App;
