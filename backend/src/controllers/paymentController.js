import * as paymentService from '../services/paymentService.js';

export const createCheckout = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ message: 'orderId is required' });
    }

    const result = await paymentService.createCheckoutSession({
      orderId,
      userId: req.user.userId
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['stripe-signature'];
    const result = await paymentService.handleStripeWebhookEvent(req.body, signature);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const simulatePaymentSuccess = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await paymentService.fulfillPaymentForOrder(orderId);
    return res.status(200).json({
      message: `Payment fulfilled successfully for Order #${orderId}`,
      order
    });
  } catch (error) {
    next(error);
  }
};
