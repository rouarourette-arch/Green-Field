import express from 'express';
import {addOrUpdateReview,getProductReviews,deleteReview,} from '../controllers/review.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/product/:productId', getProductReviews);

router.post('/', authMiddleware, addOrUpdateReview);
router.delete('/:id', authMiddleware, deleteReview);

export default router;