import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public catalog routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin & Vendor management routes
router.post('/', authenticate, authorizeRoles('ADMIN', 'VENDOR'), createProduct);
router.put('/:id', authenticate, authorizeRoles('ADMIN', 'VENDOR'), updateProduct);
router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'VENDOR'), deleteProduct);

export default router;
