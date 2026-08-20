import { useState, useEffect } from "react";
import api from "../api/axios";
import "./Cart.css";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Erreur chargement panier :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 2. Modifier la quantité (+1 ou -1)
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await api.put("/cart/update", { productId, quantity: newQuantity });
      fetchCart(); // Rafraîchir le panier
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Supprimer un produit du panier
  const handleRemoveItem = async (productId) => {
    try {
      await api.delete(/cart/item/`${productId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Valider la commande (Checkout)
  const handleCheckout = async () => {
    try {
      await api.post("/cart/checkout");
      alert("Commande confirmée avec succès !");
      setCart(null); // Le panier est vidé
    } catch (err) {
      console.error("Erreur lors de la commande :", err);
    }
  };

  if (loading) return <p>Chargement du panier...</p>;
  if (!cart || !cart.items || cart.items.length === 0) {
    return <div className="cart-empty">Votre panier est vide.</div>;
  }

  // Calcul du montant total
  const totalPrice = cart.items.reduce(
    (total, item) => total + item.Product.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h2>Mon Panier</h2>

      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            <img
              src={item.Product.image || "/placeholder.png"}
              alt={item.Product.name}
            />

            <div className="cart-item-info">
              <h4>{item.Product.name}</h4>
              <p>Prix unitaire : {item.Product.price} €</p>
            </div>

            <div className="cart-item-quantity">
              <button
                onClick={() =>
                  handleUpdateQuantity(item.productId, item.quantity - 1)
                }
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() =>
                  handleUpdateQuantity(item.productId, item.quantity + 1)
                }
              >
                +
              </button>
            </div>

            <p className="cart-item-subtotal">
              {(item.Product.price * item.quantity).toFixed(2)} €
            </p>

            <button
              className="btn-delete"
              onClick={() => handleRemoveItem(item.productId)}
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total : {totalPrice.toFixed(2)} €</h3>
        <button className="btn-checkout" onClick={handleCheckout}>
          Confirmer la commande
        </button>
      </div>
    </div>
  );
}