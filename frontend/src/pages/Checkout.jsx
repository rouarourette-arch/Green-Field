import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

export default function Checkout() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);

  const handleCheckout = async () => {
    try {
      setError('');
      await api.post('/cart/checkout');
      setComplete(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Checkout failed.');
    }
  };

  if (complete) {
    return (
      <section>
        <h2>Order confirmed</h2>
        <p>Your authenticated checkout was completed successfully.</p>
        <button onClick={() => navigate('/')}>Continue shopping</button>
      </section>
    );
  }

  return (
    <section>
      <h2>Checkout</h2>
      <p>Review your cart and confirm your secure checkout.</p>
      {error && <p role="alert">{error}</p>}
      <button onClick={handleCheckout}>Confirm checkout</button>
      <p><Link to="/cart">Back to cart</Link></p>
    </section>
  );
}
