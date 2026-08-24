import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios";
import "../CSS/ProductDetails.css";

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
      setErrorMsg("Please sign in to leave a review.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await api.post("/reviews", {
        productId: Number(id),
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });

      setSuccessMsg(res.data.message || "Review added successfully.");
      setReviewForm({ rating: 5, comment: "" });

      // Refresh reviews & average rating
      const revRes = await api.get(`/reviews/product/${id}`);
      setReviews(revRes.data.reviews || []);
      setAvgRating(revRes.data.averageRating || 0);

    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || "Unable to submit the review."
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

      alert("Product added to cart.");

    } catch (err) {
      console.error("Unable to add product to cart:", err);

      alert(
        err.response?.data?.message ||
        "Unable to add product to cart."
      );
    }
  };

  if (loading) {
    return <p className="loading-state">Loading product...</p>;
  }

  if (!product) {
    return <p className="error-state">Product not found.</p>;
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
        className="secondary-btn btn-back"
        onClick={() => navigate("/")}
      >
        &larr; Back to products
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

          {(product.category || product.Category) && (
            <span className="product-category-tag">
              {(product.category || product.Category).name}
            </span>
          )}

          <div className="product-rating-overview">
            <span className="stars">
              ★ {Number(avgRating).toFixed(1)} / 5
            </span>

            <span className="review-count">
              ({reviews.length} reviews)
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
              ? `In stock (${product.stock} available)`
              : "Out of stock"}
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
              ? "Add to cart"
              : "Out of stock"}
          </button>

        </div>
      </div>

      <section className="product-reviews-section">

        <h3>
          Customer reviews ({reviews.length})
        </h3>

        <div className="reviews-list">

          {reviews.length === 0 ? (
            <p className="no-reviews">
              No reviews yet. Be the first to review this product.
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
                    {"★".repeat(review.rating)}
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
              Write a review
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

              Rating:

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
              placeholder="Write your review here..."
              required
              rows={3}
            />

            <button
              type="submit"
              className="btn-submit-review"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit review"}
            </button>

          </form>

        ) : (

          <p className="login-prompt">

            <span
              onClick={() => navigate("/login")}
              className="review-login-link"
            >
              Sign in
            </span>

            {" "}to leave a review.

          </p>

        )}

      </section>

    </div>
  );
}