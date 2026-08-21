import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ price: '', stock: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/product/${id}`)
      .then((response) => setFormData({ price: response.data.price, stock: response.data.stock }))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load product.'));
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.put(`/product/${id}`, formData);
      navigate('/seller/products');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update product.');
    }
  };

  return (
    <section>
      <h2>Edit Product</h2>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="number" min="0" step="0.01" value={formData.price} onChange={(event) => setFormData({ ...formData, price: event.target.value })} placeholder="Price" required />
        <input type="number" min="0" value={formData.stock} onChange={(event) => setFormData({ ...formData, stock: event.target.value })} placeholder="Stock" required />
        <button type="submit">Save changes</button>
      </form>
    </section>
  );
}
