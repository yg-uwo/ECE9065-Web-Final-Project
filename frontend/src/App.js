import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavbarComponent from './components/Navbar';
import Auth from './pages/Auth';
import { store } from './redux/store';
import PrivateRoute from './components/PrivateRoute';
import UserList from './pages/UserList';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <div>Product Listing Page</div>
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
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;