import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import api from '../api/axios.js';
import '../CSS/AdminProducts.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/admin/products').then((response) => setProducts(response.data)).catch((error) => console.error(error));
  }, []);

  return (
    <section className="page-container admin-products-page"><header className="page-header"><p className="eyebrow">Administration</p><h1 className="page-title">Products</h1></header>
      <div className="products-grid">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
