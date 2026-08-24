import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import '../CSS/SellerProducts.css';

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    try {
      const response = await api.get('/product/mine');
      setProducts(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load your products.');
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const deleteProduct = async (productId) => {
    await api.delete(`/product/${productId}`);
    await loadProducts();
  };

  return (
    <section className="page-container seller-page">
      <header className="page-header"><p className="eyebrow">Seller workspace</p><h1 className="page-title">My Products</h1><p className="page-subtitle">Manage your catalog and inventory.</p></header>
      <div className="seller-actions"><span className="results-count">{products.length} products</span><Link className="primary-btn" to="/seller/products/add">Add product</Link></div>
      {error && <p role="alert">{error}</p>}
      <div className="seller-product-list">{products.map((product) => (
        <article className="seller-product" key={product.id}>
          <div><strong>{product.name}</strong><small>{product.category?.name || 'Uncategorized'} · {product.stock} in stock · {product.salesCount || 0} sold · ★ {Number(product.averageRating || 0).toFixed(1)}</small></div><strong>{product.price} TND</strong>
          <Link to={`/seller/products/${product.id}/edit`}>Edit</Link>
          <button onClick={() => deleteProduct(product.id)}>Delete</button>
        </article>
      ))}</div>
    </section>
  );
}
