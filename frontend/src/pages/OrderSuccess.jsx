import { Link, useLocation, useParams } from 'react-router-dom';
import '../CSS/Checkout.css';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { state } = useLocation();
  return (
    <section className="page-container checkout-page">
      <div className="confirmation-card card">
        <span className="confirmation-icon">✓</span>
        <h2>Order confirmed!</h2>
        <p>Your simulated payment has been confirmed and your order is ready to process.</p>
        <div className="detail-line"><span>Order number</span><strong>#{orderId}</strong></div>
        {state?.totalAmount !== undefined && <div className="detail-line"><span>Total</span><strong>{Number(state.totalAmount).toFixed(2)} TND</strong></div>}
        <div className="detail-line"><span>Payment status</span><strong>Confirmed</strong></div>
        <div className="success-actions"><Link className="primary-btn" to="/orders">View my orders</Link><Link className="secondary-btn" to="/">Continue shopping</Link></div>
      </div>
    </section>
  );
}
