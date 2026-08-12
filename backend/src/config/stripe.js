import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_51MockStripeSecretKeyForShoporaDev2026';
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mockSecretForShoporaWebhookDev';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16'
});

export default stripe;
