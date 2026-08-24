import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import "../CSS/ProductCard.css"

export default function ProductCard({ product }) {
  const { user } = useAuth();
  const [adding, setAdding] = useState(false);
 
  let images = product.images;
  if (typeof images === "string") {
    try {
      images = JSON.parse(images);
    } catch {
      images = [];
    }
  }
  const imageUrl = Array.isArray(images) && images.length > 0 ? images[0] : "";
  const handleAdd = async () => { setAdding(true); try { await api.post('/cart/add', { productId: product.id, quantity: 1 }); } catch (error) { console.error('Unable to add product to cart:', { status: error.response?.status, endpoint: '/cart/add', data: error.response?.data }); } finally { setAdding(false); } };

  return (
    <article className="product-card">
      <div className="product-card-image-container">
        {imageUrl ? <img src={imageUrl} alt={product.name} className="product-card-image" /> : <span className="image-placeholder">No image</span>}
      </div>

      <div className="product-card-content">
        <div className="product-card-header">
          <div><p className="product-card-category">{product.category?.name || product.Category?.name || 'Featured'}</p><h4>{product.name}</h4>{product.seller?.name && <small className="product-card-seller">Sold by {product.seller.name}</small>}</div>
          <Link to={`/product/${product.id}`} className="btn-view">
            View
          </Link>
        </div>
         <div className="product-card-meta"><div><p className="product-card-price">{product.price} TND</p><span className="product-card-rating">★ {Number(product.averageRating || product.rating || 0).toFixed(1)}</span></div>{product.stock !== undefined && <span className={`status-badge ${product.stock > 0 ? 'status-success' : 'status-danger'}`}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>}</div>
         {user?.role === 'client' && <button className="primary-btn product-add-btn" disabled={adding || product.stock <= 0} onClick={handleAdd}>{adding ? 'Adding...' : 'Add to cart'}</button>}
        
      </div>
    </article>
  );
}