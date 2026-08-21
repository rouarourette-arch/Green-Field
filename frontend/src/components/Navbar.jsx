import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/login');
    }
  };

  return (
    <nav style={styles.nav}>

      {/* ================= BRAND ================= */}

      <Link to="/" style={styles.brand}>
        ByteStore
      </Link>


      {/* ================= LINKS ================= */}

      <div style={styles.links}>

        {/* Products / Home */}
        <Link to="/" style={styles.link}>
          Products
        </Link>


        {!user ? (
          <>
            {/* ================= GUEST ================= */}

            <Link to="/login" style={styles.link}>
              Login
            </Link>

            <Link to="/register" style={styles.link}>
              Register
            </Link>
          </>
        ) : (
          <>
            {/* ================= AUTHENTICATED ================= */}

            {user.role === 'client' && <Link to="/cart" style={styles.link}>Cart</Link>}
            {user.role === 'seller' && <>
              <Link to="/seller/products" style={styles.link}>My Products</Link>
              <Link to="/seller/products/add" style={styles.link}>Add Product</Link>
            </>}
            {user.role === 'admin' && <>
              <Link to="/admin" style={styles.link}>Dashboard</Link>
              <Link to="/admin/users" style={styles.link}>Users</Link>
              <Link to="/admin/categories" style={styles.link}>Categories</Link>
              <Link to="/admin/products" style={styles.link}>Products</Link>
            </>}
            <Link to="/profile" style={styles.link}>Profile</Link>


            {/* Logout */}
            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
            >
              Logout
            </button>
          </>
        )}

      </div>
    </nav>
  );
};


const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: '#1e293b',
    color: '#fff',
    flexWrap: 'wrap',
    gap: '1rem',
  },

  brand: {
    color: '#38bdf8',
    textDecoration: 'none',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },

  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.2rem',
    flexWrap: 'wrap',
  },

  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '0.95rem',
  },

  user: {
    color: '#cbd5e1',
    fontWeight: '500',
  },

  logoutBtn: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '0.45rem 0.9rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};