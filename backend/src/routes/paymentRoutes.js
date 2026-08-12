import express from 'express';
import { createCheckout, handleWebhook, simulatePaymentSuccess } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-checkout', authenticate, createCheckout);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
router.post('/simulate-success/:orderId', authenticate, simulatePaymentSuccess);

export default router;
