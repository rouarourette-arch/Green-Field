import { useState, useEffect } from "react";
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
    api.get("/category")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/product", formData);

      await fetchProducts();

      setFormData({
        name: "",
        price: "",
        stock: "",
        images: "",
        description: "",
        categoryId: ""
      });

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form
      className="add-product-form"
      onSubmit={handleSubmit}
    >

      {/* TITLE */}
      <div className="add-product-header">
        <h3>Add New Product</h3>
        <p>Add a new product to your store</p>
      </div>


      {/* NAME */}
      <div className="form-group">
        <label htmlFor="product-name">
          Product Name
        </label>

        <input
          id="product-name"
          className="form-input"
          name="name"
          type="text"
          placeholder="Enter product name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>


      {/* PRICE + STOCK */}
      <div className="form-row">

        <div className="form-group">
          <label htmlFor="product-price">
            Price
          </label>

          <input
            id="product-price"
            className="form-input"
            name="price"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>


        <div className="form-group">
          <label htmlFor="product-stock">
            Stock
          </label>

          <input
            id="product-stock"
            className="form-input"
            name="stock"
            type="number"
            min="0"
            placeholder="0"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>

      </div>


      {/* IMAGE */}
      <div className="form-group">
        <label htmlFor="product-image">
          Product Image
        </label>

        <input
          id="product-image"
          className="form-input"
          name="images"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={formData.images}
          onChange={handleChange}
        />

        <small className="form-hint">
          Enter a direct image URL
        </small>
      </div>


      {/* DESCRIPTION */}
      <div className="form-group">
        <label htmlFor="product-description">
          Description
        </label>

        <textarea
          id="product-description"
          className="form-textarea"
          name="description"
          placeholder="Enter product description..."
          value={formData.description}
          onChange={handleChange}
        />
      </div>


      {/* CATEGORY */}
      <div className="form-group">
        <label htmlFor="product-category">
          Category
        </label>

        <select
          id="product-category"
          className="form-select"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
        >
          <option value="">
            Select a category
          </option>

          {categories.map((cat) => (
            <option
              key={cat.id}
              value={cat.id}
            >
              {cat.name}
            </option>
          ))}
        </select>
      </div>


      {/* BUTTON */}
      <button
        className="add-product-btn"
        type="submit"
      >
        Add Product
      </button>

    </form>
  );
}