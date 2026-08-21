import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import api from "./api/axios";

// Importation des composants
import Header from "./components/Header";
import Home from "./components/Home";
import AddProduct from "./components/AddProduct";
import ProductDetails from "./components/ProductDetails";


export default function App() { 
 

const [products, setProducts] = useState([]);

 const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      setProducts(response.data);
    } catch (error) {
      console.log( error);
    }
  };

  useEffect(() => {fetchProducts();}, []);




  return (
    <Router>
      <Header  />
      <main className="main-content">
        <Routes>
          {/* Product routes */}
          <Route path="/" element={<Home fetchProducts={fetchProducts} />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/add" element={<AddProduct />} />
          <Route path="/cart" element={<Cart />} />         
          
        </Routes>
      </main>
    </Router>
  );
}