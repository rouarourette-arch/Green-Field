import { useState, useEffect } from "react";
import axios from "axios";
import "../CSS/AddProduct.css";
import api from "../api/axios";

export default function AddProduct({ fetchProducts }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    images: "",
    description: "",
    categoryId: ""
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      await axios.post("http://localhost:5000/api/products", formData);
      fetchProducts()
      setFormData({ name: "", price: "", stock: "", images: "", description: "", categoryId: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <h3>Add New Product</h3>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
      <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
      <input name="image_url" placeholder="URL Image" value={formData.image_url} onChange={handleChange} />
      <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
      
      <select name="categoryId" value={formData.categoryId} onChange={handleChange} required>
        <option value="">Select a category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <button type="submit">Save</button>
    </form>
  );
}