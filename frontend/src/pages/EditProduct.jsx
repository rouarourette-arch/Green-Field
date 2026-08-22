import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import '../CSS/EditProduct.css';

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
    <section className="page-container edit-product-page"><div className="edit-product-card card">
      <h1 className="page-title">Edit Product</h1>
      {error && <p role="alert">{error}</p>}
      <form className="edit-product-form" onSubmit={handleSubmit}><label className="form-group"><span className="form-label">Price</span><input type="number" min="0" step="0.01" value={formData.price} onChange={(event) => setFormData({ ...formData, price: event.target.value })} required /></label><label className="form-group"><span className="form-label">Stock</span><input type="number" min="0" value={formData.stock} onChange={(event) => setFormData({ ...formData, stock: event.target.value })} required /></label><button className="primary-btn" type="submit">Save changes</button></form>
      </div>
    </section>
  );
}
