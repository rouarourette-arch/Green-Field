import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data.users || []);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load users.');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateRole = async (userId, role) => {
    await api.put(`/users/${userId}`, { role });
    await loadUsers();
  };

  const approveSeller = async (userId) => {
    await api.put(`/users/${userId}/approve`);
    await loadUsers();
  };

  const deleteUser = async (userId) => {
    await api.delete(`/users/${userId}`);
    await loadUsers();
  };

  return (
    <section>
      <h2>Users</h2>
      {error && <p role="alert">{error}</p>}
      <div>
        {users.map((user) => (
          <article key={user.id}>
            <strong>{user.name}</strong> ({user.email})
            <select value={user.role} onChange={(event) => updateRole(user.id, event.target.value)}>
              <option value="client">Client</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
            {user.role === 'seller' && !user.isApproved && <button onClick={() => approveSeller(user.id)}>Approve seller</button>}
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </article>
        ))}
      </div>
    </section>
  );
}
