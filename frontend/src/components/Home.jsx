import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import "../CSS/Home.css";

export default function Home({ products }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const categories = useMemo(() => {
    return [...new Map(products.filter((product) => product.category).map((product) => [product.category.id, product.category])).values()];
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const price = Number(product.price);
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || String(product.categoryId) === category;
    const matchesMin = !minPrice || price >= Number(minPrice);
    const matchesMax = !maxPrice || price <= Number(maxPrice);
    return matchesSearch && matchesCategory && matchesMin && matchesMax;
  });

  return (
    <div className="main-container">
      <h3>ALL the products</h3>
      <div className="product-filters">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <input type="number" min="0" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="Min price" />
        <input type="number" min="0" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Max price" />
      </div>
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}