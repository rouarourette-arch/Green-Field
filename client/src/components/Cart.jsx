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
      console.error("Error loading cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 2. Update quantity (+1 or -1)
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await api.put("/cart/update", { productId, quantity: newQuantity });
      fetchCart(); // Refresh cart
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Remove a product from cart
  const handleRemoveItem = async (productId) => {
    try {
      await api.delete(/cart/item/`${productId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // 4. Validate order (Checkout)
  const handleCheckout = async () => {
    try {
      await api.post("/cart/checkout");
      alert("Order confirmed successfully!");
      setCart(null); // Cart is emptied
    } catch (err) {
      console.error("Error during checkout:", err);
    }
  };

  if (loading) return <p>Loading cart...</p>;
  if (!cart || !cart.items || cart.items.length === 0) {
    return <div className="cart-empty">Your cart is empty.</div>;
  }

  // Calcul du montant total
  const totalPrice = cart.items.reduce(
    (total, item) => total + item.Product.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h2>My cart</h2>

      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            <img
              src={item.Product.image || "/placeholder.png"}
              alt={item.Product.name}
            />

            <div className="cart-item-info">
              <h4>{item.Product.name}</h4>
              <p>Unit price: {item.Product.price} €</p>
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
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Total: {totalPrice.toFixed(2)} €</h3>
        <button className="btn-checkout" onClick={handleCheckout}>
          Confirm Order
        </button>
      </div>
    </div>
  );
}