import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { authService } from '../services/authService.js';
import '../CSS/Profile.css';

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
    <div className="page-container profile-page">
      <div className="profile-card card">
      <div className="profile-heading"><h1 className="page-title">My Profile</h1><span className="role-badge">{user?.role.toUpperCase()}</span></div>
      {message && <p className="feedback-success">{message}</p>}
      {error && <p className="feedback-error">{error}</p>}
      
      <form onSubmit={handleSubmit} className="profile-form">
        <label>Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="form-input"
        />

        <label>Email:</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="form-input"
        />

        <label>Phone:</label>
        <input
          type="text"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="form-input"
        />

        <label>Address:</label>
        <textarea
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="form-textarea"
        />

        <hr className="profile-divider" />
        <h3>Change Password</h3>

        <label>Current Password:</label>
        <input
          type="password"
          value={formData.currentPassword}
          onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
          className="form-input"
        />

        <label>New Password:</label>
        <input
          type="password"
          value={formData.newPassword}
          onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
          className="form-input"
        />

        <button type="submit" className="primary-btn">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

