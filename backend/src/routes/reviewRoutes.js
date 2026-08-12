import express from 'express';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.get('/products/:productId/reviews', getProductReviews);
router.post('/products/:productId/reviews', authenticate, createReview);

router.put('/reviews/:id', authenticate, updateReview);
router.delete('/reviews/:id', authenticate, deleteReview);

export default router;
