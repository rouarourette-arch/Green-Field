import React from "react";
import { Link } from "react-router-dom";
import "../CSS/ProductCard.css"

export default function ProductCard({ product }) {
 
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : "";

  return (
    <div className="product-card">
      {imageUrl && (
        <div className="product-card-image-container">
          <img src={imageUrl} alt={product.name} className="product-card-image" />
        </div>
      )}

      <div className="product-card-content">
        <div className="product-card-header">
          <h4>{product.name}</h4>
          <Link to={`/product/${product.id}`} className="btn-view">
            View
          </Link>
        </div>
         <p className="product-card-price">Price : {product.price} €</p>
        
      </div>
    </div>
  );
}