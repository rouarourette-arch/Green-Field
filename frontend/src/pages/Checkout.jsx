import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import '../CSS/Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(true);

  useEffect(() => {
    api.get('/cart').then((response) => setCart(response.data)).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load your cart.')).finally(() => setCartLoading(false));
  }, []);

  const handleCheckout = async () => {
    try {
      setError('');
      setSubmitting(true);
      const response = await api.post('/orders/checkout');
      navigate(`/order-success/${response.data.orderId}`, { state: { totalAmount: response.data.totalAmount } });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Checkout failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="page-container checkout-page">
      <h1 className="page-title">Checkout</h1>
      <p className="page-subtitle">Review your cart and confirm your order.</p>
      {error && <p role="alert">{error}</p>}
      {cartLoading ? <p className="loading-state">Loading your order summary...</p> : !(cart?.CartItems || cart?.items || []).length ? <div className="empty-state"><p>Your cart is empty.</p><Link className="secondary-btn" to="/">Browse products</Link></div> : <div className="checkout-summary card">{(cart.CartItems || cart.items).map((item) => <div className="detail-line" key={item.id}><span>{item.Product?.name || 'Product'} × {item.quantity}</span><strong>{(Number(item.Product?.price || item.price) * item.quantity).toFixed(2)} TND</strong></div>)}<div className="detail-total"><span>Total</span><strong>{(cart.CartItems || cart.items).reduce((total, item) => total + Number(item.Product?.price || item.price) * item.quantity, 0).toFixed(2)} TND</strong></div></div>}
      <button className="primary-btn" onClick={handleCheckout} disabled={submitting || cartLoading || !(cart?.CartItems || cart?.items || []).length}>{submitting ? 'Confirming order...' : 'Confirm order'}</button>
      <p><Link to="/cart">Back to cart</Link></p>
    </section>
  );
}
