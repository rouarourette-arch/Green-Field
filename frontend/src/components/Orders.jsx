import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import { Link } from 'react-router-dom';
import '../CSS/Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/my-orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading-state">Loading orders...</p>;
  if (orders.length === 0) return <div className="empty-state"><h2>My orders</h2><p>You have not placed any orders yet.</p></div>;

  return (
    <div className="page-container orders-container">
      <header className="page-header"><p className="eyebrow">Your activity</p><h1 className="page-title">My orders</h1><p className="page-subtitle">Track your recent purchases.</p></header>
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <Link to={`/orders/${order.id}`}>Order #{order.id}</Link>
            <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
            <span className={ `status ${order.status}`}>{order.status}</span>
          </div>

          <div className="order-items">
            {order.OrderItems.map((item) => (
              <div key={item.id} className="order-item-row">
                <span>{item.Product?.name || "Product"}</span>
                <span>Quantity: {item.quantity}</span>
                <span>Unit price: {item.price} TND</span>
                <span>Total: {(item.quantity * item.price).toFixed(2)} TND</span>
              </div>
            ))}
          </div>

          <div className="order-footer">
            <strong>Order total: {Number(order.totalAmount).toFixed(2)} TND</strong>
          </div>
        </div>
      ))}
    </div>
  );
}