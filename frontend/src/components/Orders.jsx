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

  if (loading) return <p>Chargement des commandes...</p>;
  if (orders.length === 0) return <p>Vous n'avez passé aucune commande.</p>;

  return (
    <div className="orders-container">
      <h2>Mes Commandes</h2>
      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div className="order-header">
            <span>Commande #{order.id}</span>
            <span>Date : {new Date(order.createdAt).toLocaleDateString()}</span>
            <span className={ `status ${order.status}`}>{order.status}</span>
          </div>

          <div className="order-items">
            {order.OrderItems.map((item) => (
              <div key={item.id} className="order-item-row">
                <span>{item.Product?.name || "Produit"}</span>
                <span>Quantité : {item.quantity}</span>
                <span>Prix unitaire : {item.price} €</span>
                <span>Total : {(item.quantity * item.price).toFixed(2)} €</span>
              </div>
            ))}
          </div>

          <div className="order-footer">
            <strong>Total Commande : {order.totalAmount.toFixed(2)} €</strong>
          </div>
        </div>
      ))}
    </div>
  );
}