import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

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

  return (
    <section>
      <h2>Categories</h2>
      {error && <p role="alert">{error}</p>}
      <form onSubmit={addCategory}>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Category name" required />
        <input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Description" />
        <button type="submit">Add category</button>
      </form>
      {categories.map((category) => (
        <article key={category.id}>
          <strong>{category.name}</strong> <button onClick={() => deleteCategory(category.id)}>Delete</button>
        </article>
      ))}
    </section>
  );
}
