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

// Admin & Delivery order management routes
router.get('/admin/all', authenticate, authorizeRoles('ADMIN', 'DELIVERY'), getAllOrdersAdmin);
router.put('/admin/:id/status', authenticate, authorizeRoles('ADMIN', 'DELIVERY'), updateOrderStatusAdmin);

export default router;
