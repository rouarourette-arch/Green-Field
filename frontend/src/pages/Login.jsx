import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import '../CSS/Login.css';

export const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login(formData);
      if (res.success) {
        navigate(`/${res.user.role}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="auth-page"><div className="auth-card">
      <div className="auth-brand"><span className="logo-icon">B</span><span>ByteStore</span></div><h2>Welcome back</h2><p className="page-subtitle">Sign in to continue shopping.</p>
      {error && <p className="feedback feedback-error">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="form-input"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="form-input"
        />
        <button type="submit" className="primary-btn">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register here</Link></p>
    </div></div>
  );
};

