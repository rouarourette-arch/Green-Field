import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import '../CSS/AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/admin/dashboard').then((response) => setStats(response.data)).catch(() => {}); }, []);
  return (
    <section className="page-container admin-dashboard">
      <header className="page-header"><p className="eyebrow">Control center</p><h1 className="page-title">Admin Dashboard</h1><p className="page-subtitle">Keep the ByteStore marketplace organized.</p></header>
      {stats && <div className="stats-grid admin-stats">{[['Users', stats.totalUsers], ['Clients', stats.totalClients], ['Sellers', stats.totalSellers], ['Products', stats.totalProducts], ['Orders', stats.totalOrders], ['Revenue', `${stats.totalRevenue.toFixed(2)} TND`], ...['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => [status, Number(stats.byStatus?.find((item) => item.status === status)?.count || 0)])].map(([label, value]) => <article className="stat-card card" key={label}><span>{label}</span><strong>{value}</strong></article>)}</div>}
      <nav className="management-grid"><article className="management-card card"><h3>Users</h3><p>Review accounts, roles, and seller approvals.</p><Link to="/admin/users">Manage users</Link></article><article className="management-card card"><h3>Categories</h3><p>Organize the product taxonomy.</p><Link to="/admin/categories">Manage categories</Link></article><article className="management-card card"><h3>Products</h3><p>Browse the complete marketplace catalog.</p><Link to="/admin/products">View products</Link></article><article className="management-card card"><h3>Orders</h3><p>Monitor payments and fulfillment status.</p><Link to="/admin/orders">Manage orders</Link></article></nav>
    </section>
  );
}
