import express from 'express';
import { createProductReview, getProductReviews } from '../controllers/review.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/:productId/reviews', getProductReviews);
router.post('/:productId/reviews', authMiddleware, roleMiddleware('client'), createProductReview);

export default router;
