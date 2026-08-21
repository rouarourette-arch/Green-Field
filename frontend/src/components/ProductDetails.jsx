import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios";
import "../CSS/ProductCard.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    api.get(`/product/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
    api.get(`/product/${id}/reviews`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post(`/product/${id}/reviews`, reviewForm);
      setReviewForm({ rating: 5, comment: "" });
      const response = await api.get(`/product/${id}/reviews`);
      setReviews(response.data);
    } catch (err) {
      console.error("Review submission failed:", err);
    }
  };

  const handleAddToCart = async () => {
  try {
    await api.post("/cart/add", { productId: product.id, quantity: 1 });
    alert("Produit ajouté au panier !");
  } catch (err) {
    console.error("Erreur ajout panier :", err);
  }
};

  if (!product) return <p>Loading product...</p>;

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
            {product.stock > 0 ? `En stock : ${product.stock}` : "Rupture de stock"}
          </p>
          <p className="product-detail-description">{product.description}</p>

          
          <button 
            className="btn-add-to-cart" 
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? "Add to Cart" : "Épuisé"}
          </button>
        </div>
      </div>

      <section>
        <h3>Reviews</h3>
        {reviews.map((review) => (
          <article key={review.id}>
            <strong>{review.User?.name || "Customer"}</strong> - {review.rating}/5
            <p>{review.comment}</p>
          </article>
        ))}
        {user?.role === "client" && (
          <form onSubmit={handleReviewSubmit}>
            <label>
              Rating
              <select value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: event.target.value })}>
                {[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating}</option>)}
              </select>
            </label>
            <textarea value={reviewForm.comment} onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })} placeholder="Write a review" />
            <button type="submit">Submit review</button>
          </form>
        )}
      </section>
    </div>
  );
}