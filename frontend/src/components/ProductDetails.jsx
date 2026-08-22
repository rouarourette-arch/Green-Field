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
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // 1. Fetch Product Data & Reviews
  const fetchData = async () => {
    try {
      setLoading(true);

      // Product details
      const prodRes = await api.get(`/product/${id}`);
      setProduct(prodRes.data.product || prodRes.data);

      // Reviews & Average rating
      const revRes = await api.get(`/reviews/product/${id}`);
      setReviews(revRes.data.reviews || []);
      setAvgRating(revRes.data.averageRating || 0);

    } catch (err) {
      console.error("Error loading product details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!user) {
      setErrorMsg("Veuillez vous connecter pour laisser un avis.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await api.post("/reviews", {
        productId: Number(id),
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });

      setSuccessMsg(res.data.message || "Avis ajouté avec succès !");
      setReviewForm({ rating: 5, comment: "" });

      // Refresh reviews & average rating
      const revRes = await api.get(`/reviews/product/${id}`);
      setReviews(revRes.data.reviews || []);
      setAvgRating(revRes.data.averageRating || 0);

    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Échec de l'envoi de l'avis."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await api.post("/cart/add", {
        productId: product.id,
        quantity: 1
      });

      alert("Produit ajouté au panier ! 🛒");

    } catch (err) {
      console.error("Erreur ajout panier :", err);

      alert(
        err.response?.data?.message ||
        "Erreur lors de l'ajout au panier."
      );
    }
  };

  if (loading) {
    return <p className="loading-state">Chargement du produit...</p>;
  }

  if (!product) {
    return <p className="error-state">Produit introuvable.</p>;
  }

  let parsedImages = [];

  try {
    parsedImages =
      typeof product.images === "string"
        ? JSON.parse(product.images)
        : product.images;
  } catch (e) {
    parsedImages = [];
  }

  const imageUrl =
    parsedImages && parsedImages.length > 0
      ? parsedImages[0]
      : "https://via.placeholder.com/300";

  return (
    <div className="product-detail-container">

      <button
        className="btn-back"
        onClick={() => navigate("/")}
      >
        &larr; Retour aux produits
      </button>

      <div className="product-detail-card">

        <div className="product-detail-image-container">
          <img
            src={imageUrl}
            alt={product.name}
            className="product-detail-image"
          />
        </div>

        <div className="product-detail-info">

          <h2>{product.name}</h2>

          {product.Category && (
            <span className="product-category-tag">
              {product.Category.name}
            </span>
          )}

          <div className="product-rating-overview">
            <span className="stars">
              ⭐ {avgRating} / 5
            </span>

            <span className="review-count">
              ({reviews.length} avis)
            </span>
          </div>

          <p className="product-detail-price">
            {product.price} TND
          </p>

          <p
            className={`product-detail-stock ${
              product.stock > 0
                ? "in-stock"
                : "out-of-stock"
            }`}
          >
            {product.stock > 0
              ? `En stock (${product.stock} disponibles)`
              : "Rupture de stock"}
          </p>

          <p className="product-detail-description">
            {product.description}
          </p>

          <button
            className="btn-add-to-cart"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0
              ? "Ajouter au Panier 🛒"
              : "Épuisé"}
          </button>

        </div>
      </div>

      <section className="product-reviews-section">

        <h3>
          Avis Clients ({reviews.length})
        </h3>

        <div className="reviews-list">

          {reviews.length === 0 ? (
            <p className="no-reviews">
              Aucun avis pour ce produit. Soyez le premier !
            </p>
          ) : (
            reviews.map((review) => (
              <article
                key={review.id}
                className="review-card"
              >

                <div className="review-header">

                  <strong>
                    {review.User?.name || "Client"}
                  </strong>

                  <span className="review-stars">
                    {"⭐".repeat(review.rating)}
                  </span>

                </div>

                <p className="review-comment">
                  {review.comment}
                </p>

                <small className="review-date">
                  {new Date(
                    review.createdAt
                  ).toLocaleDateString()}
                </small>

              </article>
            ))
          )}

        </div>

        {user ? (

          <form
            className="review-form"
            onSubmit={handleReviewSubmit}
          >

            <h4>
              Donner votre avis
            </h4>

            {errorMsg && (
              <p className="msg-error">
                {errorMsg}
              </p>
            )}

            {successMsg && (
              <p className="msg-success">
                {successMsg}
              </p>
            )}

            <label className="form-label">

              Note :

              <select
                value={reviewForm.rating}
                onChange={(e) =>
                  setReviewForm({
                    ...reviewForm,
                    rating: Number(e.target.value)
                  })
                }
              >

                <option value={5}>
                  ⭐⭐⭐⭐⭐ (5/5)
                </option>

                <option value={4}>
                  ⭐⭐⭐⭐ (4/5)
                </option>

                <option value={3}>
                  ⭐⭐⭐ (3/5)
                </option>

                <option value={2}>
                  ⭐⭐ (2/5)
                </option>

                <option value={1}>
                  ⭐ (1/5)
                </option>

              </select>

            </label>

            <textarea
              value={reviewForm.comment}
              onChange={(e) =>
                setReviewForm({
                  ...reviewForm,
                  comment: e.target.value
                })
              }
              placeholder="Écrivez votre commentaire ici..."
              required
              rows={3}
            />

            <button
              type="submit"
              className="btn-submit-review"
              disabled={submitting}
            >
              {submitting
                ? "Envoi..."
                : "Envoyer l'avis"}
            </button>

          </form>

        ) : (

          <p className="login-prompt">

            <span
              onClick={() => navigate("/login")}
              style={{
                color: "#007bff",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              Connectez-vous
            </span>

            {" "}pour laisser un avis.

          </p>

        )}

      </section>

    </div>
  );
}