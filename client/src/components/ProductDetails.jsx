import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./ProductCard.css"; 

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(/products/`${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleAddToCart = async () => {
  try {
    await api.post("/cart/add", { productId: product.id, quantity: 1 });
    alert("Produit ajouté au panier !");
  } catch (err) {
    console.error("Erreur ajout panier :", err);
  }
};

  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : "";

  return (
    <div className="product-detail-container">
      <button className="btn-back" onClick={() => navigate("/")}>
        &larr; Retour aux produits
      </button>

      <div className="product-detail-card">
        {imageUrl && (
          <div className="product-detail-image-container">
            <img src={imageUrl} alt={product.name} className="product-detail-image" />
          </div>
        )}

        <div className="product-detail-info">
          <h2>{product.name}</h2>
          {product.category && <span className="product-category-tag">{product.category.name}</span>}
          <p className="product-detail-price">{product.price} €</p>
          <p className="product-detail-stock">
            {product.stock > 0 ?" En stock :`${product.stock}` " : "Rupture de stock"}
          </p>
          <p className="product-detail-description">{product.description}</p>

          {/* زر Add to Cart هنا في مكانو الصح */}
          <button 
            className="btn-add-to-cart" 
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? "Add to Cart" : "Épuisé"}
          </button>
        </div>
      </div>
    </div>
  );
}