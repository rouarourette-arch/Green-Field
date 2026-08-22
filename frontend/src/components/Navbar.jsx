import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import "../CSS/Navbar.css";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    if (user?.role !== "client") return;
    api.get("/cart").then((response) => setCartCount((response.data.CartItems || response.data.items || []).reduce((total, item) => total + item.quantity, 0))).catch(() => setCartCount(0));
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link to="/" className="navbar-logo">
          <span className="logo-icon">B</span>
          <span>ByteStore</span>
        </Link>

        <nav className="navbar-links">

          <NavLink to="/" className="nav-link">
            Products
          </NavLink>

          {user?.role === "client" && (
            <>
            <NavLink to="/cart" className="nav-link">
              Cart {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </NavLink>
            <NavLink to="/orders" className="nav-link">My Orders</NavLink>
            </>
          )}

          {user?.role === "seller" && (
            <>
              <Link to="/seller" className="nav-link">Dashboard</Link>
              <Link to="/seller/products" className="nav-link">
                My Products
              </Link>
              <NavLink to="/seller/orders" className="nav-link">Orders</NavLink>

              <Link to="/seller/products/add" className="nav-link">
                Add Product
              </Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <NavLink to="/admin" className="nav-link">
                Dashboard
              </NavLink>

              <NavLink to="/admin/users" className="nav-link">
                Users
              </NavLink>

              <NavLink to="/admin/categories" className="nav-link">
                Categories
              </NavLink>

              <NavLink to="/admin/products" className="nav-link">
                Products
              </NavLink>
              <Link to="/admin/orders" className="nav-link">Orders</Link>
            </>
          )}

          {user && (
            <NavLink to="/profile" className="nav-link">
              Profile
            </NavLink>
          )}

          {user ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/login" className="login-btn">
              Login
            </Link>
          )}

        </nav>
      </div>
    </header>
  );
}