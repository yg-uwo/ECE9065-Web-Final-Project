import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import NavbarComponent from './components/Navbar';
import Auth from './pages/Auth';
import { store } from './redux/store';
import PrivateRoute from './components/PrivateRoute';
import UserList from './pages/UserList';
import Cart from './components/Cart';
import OrderConfirmation from './components/OrderComfirmation';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductList from './pages/ProductListing';
import ProductDetails from './pages/ProductDetails';

import Logout from './components/Logout';
import OrdersPage from './pages/OrderListing';


const App = () => {
  return (
    <Provider store={store}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Router>
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductList />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <UserList/>
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <OrdersPage/>
              </PrivateRoute>
            }
          />

          <Route
            path="/product/details/:productId"
            element={
              <PrivateRoute>
                <ProductDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <CartWithUser/>
              </PrivateRoute>
            }
          />
          <Route
            path="/confirmation"
            element={
              <PrivateRoute>
                <OrderConfirmation/>
              </PrivateRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <PrivateRoute>
                <Logout/>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
};

const CartWithUser = () => {
  const userId = useSelector((state) => state.auth.userId);
  const email = useSelector((state) => state.auth.email);
  const navigate = useNavigate();

  const handleCheckout = async (cart) => {
    try {
      const response = await fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId, cart, email:email }), 
    });
      if (!response.ok) {
        throw new Error("Request can't be fulfilled due to inventory issue.. :(");
      }

      const result = await response.json();

      if (result.success) {
        navigate("/confirmation");
      } else {
        throw new Error(result.message || "Payment failed");
      }
    } catch (error) {
      toast.error(error.message || "Error processing payment");
    }
  };

  return <Cart userId={userId} onCheckout={handleCheckout} />;
};

export default App;