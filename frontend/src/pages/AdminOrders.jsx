import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import '../CSS/AdminOrders.css';

const statuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const loadOrders = async () => { try { const response = await api.get('/orders/admin'); setOrders(response.data); } catch (requestError) { setError(requestError.response?.data?.message || 'Unable to load orders.'); } };
  useEffect(() => { loadOrders(); }, []);
  const updateStatus = async (id, status) => { await api.put(`/orders/${id}/status`, { status }); await loadOrders(); };
   return <section className="page-container admin-orders-page"><header className="page-header"><p className="eyebrow">Administration</p><h1 className="page-title">Orders</h1><p className="page-subtitle">Monitor payments and fulfillment.</p></header>{error && <p className="feedback-error">{error}</p>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><Link to={`/orders/${order.id}`}>#{order.id}</Link></td><td>{order.User?.name || 'Customer'}</td><td>{Number(order.totalAmount).toFixed(2)} TND</td><td><span className="status-badge">{order.paymentStatus || 'pending'}</span></td><td><select value={order.status} onChange={(event) => updateStatus(order.id, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></td><td>{new Date(order.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div></section>;
}
