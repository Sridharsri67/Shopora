import express from 'express';
import {
  validateCoupon,
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Customer/Auth coupon validation
router.post('/validate', authenticate, validateCoupon);

// Admin-only coupon management routes
router.get('/', authenticate, authorizeRoles('ADMIN'), getCoupons);
router.post('/', authenticate, authorizeRoles('ADMIN'), createCoupon);
router.put('/:id', authenticate, authorizeRoles('ADMIN'), updateCoupon);
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), deleteCoupon);

export default router;
