import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios.js';
import '../CSS/OrderDetails.css';

const stages = ['pending', 'paid', 'processing', 'shipped', 'delivered'];
export default function OrderDetails() {
  const { id } = useParams(); const [order, setOrder] = useState(null); const [error, setError] = useState('');
  useEffect(() => { api.get(`/orders/${id}`).then((response) => setOrder(response.data)).catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load order.')); }, [id]);
  if (error) return <div className="page-container empty-state"><p>{error}</p><Link className="secondary-btn" to="/orders">Back to orders</Link></div>;
  if (!order) return <p className="loading-state">Loading order...</p>;
  const currentStage = stages.indexOf(order.status);
  return <section className="page-container order-detail-page"><Link className="secondary-btn" to="/orders">Back to orders</Link><header className="page-header"><p className="eyebrow">Order #{order.id}</p><h1 className="page-title">Order details</h1><p className="page-subtitle">Placed {new Date(order.createdAt).toLocaleDateString()} · Customer: {order.User?.name || 'You'}</p></header><div className="order-progress card">{stages.map((stage, index) => <div className={`progress-stage ${index <= currentStage ? 'is-complete' : ''}`} key={stage}><span>{index + 1}</span><small>{stage}</small></div>)}</div><div className="order-detail-card card"><div className="order-detail-heading"><h2>Items</h2><span className={`status-badge status-${order.status}`}>{order.status}</span></div>{(order.OrderItems || []).map((item) => <div className="detail-line" key={item.id}><span>{item.Product?.name || 'Product'} × {item.quantity}<small> · Sold by {item.Product?.seller?.name || 'Seller'}</small></span><strong>{(Number(item.price) * item.quantity).toFixed(2)} TND</strong></div>)}<div className="detail-total"><span>Payment: {order.paymentStatus}</span><strong>{Number(order.totalAmount).toFixed(2)} TND</strong></div></div></section>;
}
