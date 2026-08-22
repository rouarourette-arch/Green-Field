import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import '../CSS/AdminCategories.css';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);

  const loadCategories = async () => {
    try {
      const response = await api.get('/category');
      setCategories(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load categories.');
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const addCategory = async (event) => {
    event.preventDefault();
    await api.post('/category', { name, description });
    setName('');
    setDescription('');
    await loadCategories();
  };

  const deleteCategory = async (categoryId) => {
    await api.delete(`/category/${categoryId}`);
    await loadCategories();
  };
  const editCategory = async () => { await api.put(`/category/${editingId}`, { name, description }); setEditingId(null); setName(''); setDescription(''); await loadCategories(); };

  return (
    <section className="page-container"><header className="page-header"><p className="eyebrow">Administration</p><h1 className="page-title">Categories</h1></header><div className="category-layout">
      {error && <p role="alert">{error}</p>}
      <form className="category-form card" onSubmit={(event) => { if (editingId) { event.preventDefault(); editCategory(); } else { addCategory(event); } }}><h2>{editingId ? 'Edit category' : 'Add category'}</h2>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Category name" required />
        <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" />
        <button type="submit" className="primary-btn">{editingId ? 'Save category' : 'Add category'}</button>
      </form>
      <div className="category-list card"><h2>Category list</h2><div className="category-items">{categories.map((category) => (
        <article className="category-item" key={category.id}>
          <span><strong>{category.name}</strong> <small>{category.products?.length || 0} products</small></span> <span><button onClick={() => { setEditingId(category.id); setName(category.name); setDescription(category.description || ''); }}>Edit</button><button onClick={() => deleteCategory(category.id)}>Delete</button></span>
        </article>
      ))}</div></div></div>
    </section>
  );
}
