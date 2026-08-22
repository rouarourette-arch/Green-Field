import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../CSS/Cart.css";

export default function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Unable to load cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);


  const handleCheckout = async () => {
    navigate("/checkout");
  };

  // Update quantity
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      await api.put("/cart/update", {
        productId,
        quantity: newQuantity,
      });

      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // Remove an item
  const handleRemoveItem = async (productId) => {
    try {
      await api.delete(`/cart/item/${productId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="cart-loading">
        Loading your cart...
      </div>
    );
  }

  const items = cart?.CartItems || cart?.items || [];

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-icon">🛒</div>

        <h2>Your cart is empty</h2>

        <p>
          Add products to your cart to start shopping.
        </p>
      </div>
    );
  }

  // Calcul du total
  const totalPrice = items.reduce(
    (total, item) =>
      total + Number(item.Product.price) * item.quantity,
    0
  );

  return (
    <div className="cart-page">

      <div className="cart-container">

        <h2 className="cart-title">
          My Cart
        </h2>

        <div className="cart-content">

          {/* =========================
              CART ITEMS
          ========================= */}

          <div className="cart-items">

            {items.map((item) => {

              const product = item.Product;

              const subtotal =
                Number(product.price) * item.quantity;

              return (
                <div
                  key={item.id}
                  className="cart-item"
                >

                  {/* Product image */}
                  <div className="cart-item-image">

                    <img
                      src={
                        product.images?.[0] ||
                        "/placeholder.png"
                      }
                      alt={product.name}
                    />

                  </div>


                  {/* Product information */}
                  <div className="cart-item-info">

                    <h3 className="cart-item-name">
                      {product.name}
                    </h3>

                    <p className="cart-item-price">
                      Unit price: {" "}
                      {Number(product.price).toFixed(2)} TND
                    </p>

                    <p className="cart-item-total">
                      {subtotal.toFixed(2)} TND
                    </p>

                  </div>


                  {/* Quantity */}
                  <div className="quantity-control">

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId,
                          item.quantity - 1
                        )
                      }
                    >
                      −
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId,
                          item.quantity + 1
                        )
                      }
                    >
                      +
                    </button>

                  </div>


                  {/* Remove */}
                  <button
                    type="button"
                    className="remove-item"
                    onClick={() =>
                      handleRemoveItem(item.productId)
                    }
                    title="Remove item"
                  >
                    ×
                  </button>

                </div>
              );
            })}

          </div>


          {/* =========================
              CART SUMMARY
          ========================= */}

          <div className="cart-summary">

            <h2>
              Order summary
            </h2>

            <div className="summary-row">
              <span>
                Items
              </span>

              <span>
                {items.length}
              </span>
            </div>

            <div className="summary-row">
              <span>
                Subtotal
              </span>

              <span>
                {totalPrice.toFixed(2)} TND
              </span>
            </div>

            <div className="summary-row">
              <span>
                Delivery
              </span>

              <span>
                Free
              </span>
            </div>

            <div className="summary-total">
              <span>
                Total
              </span>

              <span>
                {totalPrice.toFixed(2)} TND
              </span>
            </div>

            <button
              type="button"
              className="checkout-btn"
              onClick={() => handleCheckout() }
            >
              Continue to checkout
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}