import { useState, useEffect } from "react";
import api from "../api/axios";
import ProductCard from "./ProductCard";
import "../CSS/Home.css";

export default function Home( {fetchProducts}) {
  
  return (
    <div className="main-container">
      <h3>ALL the products</h3>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}