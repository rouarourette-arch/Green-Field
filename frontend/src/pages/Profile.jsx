import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { authService } from '../services/authService.js';

export const Profile = () => {
  const { user, setUser } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await authService.updateProfile(user.id, formData);
      if (res.success) {
        setMessage('Profile updated successfully.');
        setUser(res.user);
        setFormData((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>My Profile ({user?.role.toUpperCase()})</h2>
      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
      
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          style={styles.input}
        />

        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          style={styles.input}
        />

        <label>Phone:</label>
        <input
          type="text"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          style={styles.input}
        />

        <label>Address:</label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          style={styles.input}
        />

        <hr style={{ margin: '1rem 0' }} />
        <h3>Change Password</h3>

        <label>Current Password:</label>
        <input
          type="password"
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          style={styles.input}
        />

        <label>New Password:</label>
        <input
          type="password"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Save Changes</button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: '500px', margin: '2rem auto', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  input: { padding: '0.5rem', fontSize: '1rem' },
  button: { padding: '0.5rem', background: '#0284c7', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '1rem' },
  error: { color: 'red' },
  success: { color: 'green' },
};