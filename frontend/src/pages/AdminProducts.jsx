import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import api from '../api/axios.js';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get('/product').then((response) => setProducts(response.data)).catch((error) => console.error(error));
  }, []);

  return (
    <section>
      <h2>Products</h2>
      <div className="products-grid">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
