import React, { useEffect, useState } from 'react';
import API from '../api/axios'; 
import '../CSS/ProductReview.css';

export default function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/product/${productId}`);
      setReviews(res.data.reviews || []);
      setAverageRating(res.data.averageRating || 0);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  useEffect(() => {
    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const res = await API.post('/reviews', {
        productId,
        rating: Number(rating),
        comment,
      });

      setMessage(res.data.message || 'Review submitted successfully!');
      setComment('');
      fetchReviews(); 
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting review. Make sure you are logged in.');
    }
  };

  return (
    <section className="product-reviews-section standalone-reviews">
      <h3>Customer Reviews & Ratings</h3>

      {/* Average Rating Display */}
      <div className="product-rating-overview">
        <h4 className="product-detail-price">★ {averageRating} / 5</h4>
        <span>({reviews.length} reviews)</span>
      </div>

      {/* Formulaire Add Review */}
      <form onSubmit={handleSubmit} className="review-form">
        <h5>Write a Review</h5>
        {message && <p className="msg-success">{message}</p>}
        {error && <p className="msg-error">{error}</p>}

        <div className="form-group">
          <label className="form-label">Rating:</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
            <option value="4">⭐⭐⭐⭐ (4/5)</option>
            <option value="3">⭐⭐⭐ (3/5)</option>
            <option value="2">⭐⭐ (2/5)</option>
            <option value="1">⭐ (1/5)</option>
          </select>
        </div>

        <div>
          <textarea
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            className="form-textarea"
            required
          />
        </div>

        <button type="submit" className="btn-submit-review">
          Submit Review
        </button>
      </form>

      <div>
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet for this product. Be the first to review!</p>
        ) : (
          reviews.map((rev) => (
            <article key={rev.id} className="review-card">
              <div className="review-header">
                <strong>{rev.User?.name || 'Client'}</strong>
                <span className="review-stars">{'★'.repeat(rev.rating)}</span>
              </div>
              <p className="review-comment">{rev.comment}</p>
              <small className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</small>
            </article>
          ))
        )}
      </div>
    </section>
  );
}