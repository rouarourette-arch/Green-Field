import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <section>
      <h2>Admin Dashboard</h2>
      <nav>
        <Link to="/admin/users">Manage users</Link>{' | '}
        <Link to="/admin/categories">Manage categories</Link>{' | '}
        <Link to="/admin/products">View products</Link>
      </nav>
    </section>
  );
}
