import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    return `/${user.role}`;
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>ByteStore</Link>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to={getDashboardPath()} style={styles.link}>Dashboard</Link>
            <Link to="/profile" style={styles.link}>Profile ({user.name})</Link>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', background: '#1e293b', color: '#fff', alignItems: 'center' },
  brand: { color: '#38bdf8', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' },
  links: { display: 'flex', gap: '1rem', alignItems: 'center' },
  link: { color: '#fff', textDecoration: 'none' },
  logoutBtn: { background: '#ef4444', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer' },
};