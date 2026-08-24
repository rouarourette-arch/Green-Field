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
    <div className="page-container home-page">
      <section className="home-hero">
        <div className="hero-copy"><p className="eyebrow">The ByteStore edit</p><h1>Technology with a little more character.</h1><p>Explore a considered collection of gear, essentials, and everyday upgrades from independent sellers.</p><a className="primary-btn" href="#product-grid">Explore the collection</a></div>
        <div className="hero-orbit" aria-hidden="true"><span>BYTE</span><i></i><b></b></div>
      </section>
      <header className="page-header home-header">
        <div><p className="eyebrow">ByteStore marketplace</p><h1 className="page-title">Find your next favorite thing</h1><p className="page-subtitle">Curated products from trusted sellers.</p></div>
        <span className="results-count">{filteredProducts.length} products</span>
      </header>
      <div className="product-filters">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products" />
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        <input type="number" min="0" value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="Min price" />
        <input type="number" min="0" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Max price" />
      </div>
      <div className="section-heading"><div><p className="eyebrow">Fresh arrivals</p><h2>Browse the collection</h2></div><span>{categories.length} categories</span></div>
      <div className="products-grid" id="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}