import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';

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
    <section>
      <h2>My Products</h2>
      <Link to="/seller/products/add">Add product</Link>
      {error && <p role="alert">{error}</p>}
      {products.map((product) => (
        <article key={product.id}>
          <strong>{product.name}</strong> - {product.price} ({product.stock} in stock)
          <Link to={`/seller/products/${product.id}/edit`}>Edit</Link>
          <button onClick={() => deleteProduct(product.id)}>Delete</button>
        </article>
      ))}
    </section>
  );
}
