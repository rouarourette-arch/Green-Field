import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import '../CSS/AdminUsers.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

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
  const visibleUsers = useMemo(() => users.filter((user) => (!role || user.role === role) && `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())), [users, role, search]);

  return (
    <section className="page-container"><header className="page-header"><p className="eyebrow">Administration</p><h1 className="page-title">Users</h1></header>
      {error && <p role="alert">{error}</p>}
      <div className="product-filters"><input placeholder="Search users" value={search} onChange={(event) => setSearch(event.target.value)} /><select value={role} onChange={(event) => setRole(event.target.value)}><option value="">All roles</option><option value="client">Clients</option><option value="seller">Sellers</option><option value="admin">Admins</option></select></div>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Orders</th><th>Total spent</th><th>Actions</th></tr></thead><tbody>
        {visibleUsers.map((user) => (
          <tr key={user.id}><td><Link to={user.role === 'seller' ? `/admin/sellers/${user.id}` : `/admin/users/${user.id}`}><strong>{user.name}</strong></Link></td><td>{user.email}</td><td>
            <strong>{user.name}</strong> ({user.email})
            <select value={user.role} onChange={(event) => updateRole(user.id, event.target.value)}>
              <option value="client">Client</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select></td><td><span className="status-badge">{user.isApproved ? 'Active' : 'Pending'}</span></td><td>{user.orderCount || 0}</td><td>{Number(user.totalSpent || 0).toFixed(2)} TND</td><td>
            {user.role === 'seller' && !user.isApproved && <button onClick={() => approveSeller(user.id)}>Approve seller</button>}
            <button className="danger-btn" onClick={() => deleteUser(user.id)}>Delete</button></td></tr>
        ))}
      </tbody></table></div>
    </section>
  );
}
