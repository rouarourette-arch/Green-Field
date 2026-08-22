import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import '../CSS/Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [complete, setComplete] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setComplete(searchParams.get('payment') === 'success');
    setCancelled(searchParams.get('payment') === 'cancelled');
  }, [searchParams]);

  const handleCheckout = async () => {
    try {
      setError('');
      setCancelled(false);
      setSubmitting(true);
      const response = await api.post('/orders/checkout');
      window.location.assign(response.data.checkoutUrl);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Checkout failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (complete) {
    return (
      <section className="page-container checkout-page">
        <h2>Order confirmed</h2>
        <p>Your payment was submitted. The order will be marked paid after Stripe confirms it.</p>
        <button onClick={() => navigate('/')}>Continue shopping</button>
      </section>
    );
  }

  if (cancelled) {
    return <section className="page-container checkout-page"><div className="confirmation-card card"><h2>Payment cancelled</h2><p>Your order remains unpaid. You can return to your cart and try again.</p><Link className="secondary-btn" to="/cart">Return to cart</Link></div></section>;
  }

  return (
    <section>
      <h2>Checkout</h2>
      <p>Review your cart and confirm your secure checkout.</p>
      {error && <p role="alert">{error}</p>}
      <button className="primary-btn" onClick={handleCheckout} disabled={submitting}>{submitting ? 'Redirecting to payment...' : 'Continue to secure payment'}</button>
      <p><Link to="/cart">Back to cart</Link></p>
    </section>
  );
}
