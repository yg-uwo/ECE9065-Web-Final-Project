import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductCatalog from './components/ProductCatalog/ProductCatalog';
import ProductDetails from './components/ProductCatalog/ProductDetails';
import { Toaster } from "./components/ui/toast"

function App() {
  return (
    <Router>
      <div className="App">
      <Toaster />
        <Routes>
          <Route path="/" element={<ProductCatalog />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;