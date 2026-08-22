import React, { useEffect, useState } from 'react';
import API from '../api/axios'; 

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
    <div style={{ marginTop: '30px', padding: '20px', borderTop: '1px solid #ccc' }}>
      <h3>Customer Reviews & Ratings</h3>

      {/* Average Rating Display */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <h4 style={{ margin: 0, fontSize: '24px' }}>⭐ {averageRating} / 5</h4>
        <span style={{ color: '#666' }}>({reviews.length} reviews)</span>
      </div>

      {/* Formulaire Add Review */}
      <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
        <h5>Write a Review</h5>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div style={{ marginBottom: '10px' }}>
          <label style={{ marginRight: '10px' }}>Rating:</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ padding: '5px' }}>
            <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
            <option value="4">⭐⭐⭐⭐ (4/5)</option>
            <option value="3">⭐⭐⭐ (3/5)</option>
            <option value="2">⭐⭐ (2/5)</option>
            <option value="1">⭐ (1/5)</option>
          </select>
        </div>

        <div style={{ marginBottom: '10px' }}>
          <textarea
            placeholder="Write your review here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Submit Review
        </button>
      </form>

      <div>
        {reviews.length === 0 ? (
          <p style={{ color: '#777' }}>No reviews yet for this product. Be the first to review!</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{rev.User?.name || 'Client'}</strong>
                <span style={{ color: '#f39c12' }}>{'⭐'.repeat(rev.rating)}</span>
              </div>
              <p style={{ margin: '5px 0', color: '#333' }}>{rev.comment}</p>
              <small style={{ color: '#999' }}>{new Date(rev.createdAt).toLocaleDateString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}