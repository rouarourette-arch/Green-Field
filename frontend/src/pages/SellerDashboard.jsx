import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import '../CSS/SellerDashboard.css';

export default function SellerDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/seller/statistics')
      .then((response) => setStats(response.data))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Unable to load seller dashboard.'));
  }, []);

  const metrics = stats ? [['Products', stats.totalProducts], ['Sold items', stats.totalSoldItems], ['Orders', stats.totalOrders], ['Revenue', `${Number(stats.totalRevenue).toFixed(2)} TND`], ['Pending', stats.pendingOrders], ['Processing', stats.processingOrders], ['Delivered', stats.deliveredOrders]] : [];

  return <section className="page-container seller-dashboard"><header className="page-header"><p className="eyebrow">Seller workspace</p><h1 className="page-title">Dashboard</h1><p className="page-subtitle">A clear view of your catalog and sales.</p></header>{error && <p className="feedback-error">{error}</p>}{stats ? <div className="stats-grid">{metrics.map(([label, value]) => <article className="stat-card card" key={label}><span>{label}</span><strong>{value}</strong></article>)}</div> : <p className="loading-state">Loading dashboard...</p>}<div className="dashboard-link-row"><a className="primary-btn" href="/seller/products">Manage products</a></div></section>;
}
