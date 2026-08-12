import express from 'express';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

// Role testing routes
router.get('/customer-only', authenticate, authorizeRoles('CUSTOMER', 'ADMIN'), (req, res) => {
  res.status(200).json({
    message: 'Customer access granted',
    user: req.user
  });
});

router.get('/admin-only', authenticate, authorizeRoles('ADMIN'), (req, res) => {
  res.status(200).json({
    message: 'Admin access granted',
    user: req.user
  });
});

export default router;
