import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrdersAdmin,
  updateOrderStatusAdmin
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Customer order routes
router.post('/', authenticate, createOrder);
router.get('/', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrderById);

// Admin order routes
router.get('/admin/all', authenticate, authorizeRoles('ADMIN'), getAllOrdersAdmin);
router.put('/admin/:id/status', authenticate, authorizeRoles('ADMIN'), updateOrderStatusAdmin);

export default router;
