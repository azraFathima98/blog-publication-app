import Stripe from 'stripe';

// Safe check
const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}

const stripe = new Stripe(secretKey, {
  apiVersion: '2025-06-30.basil' as Stripe.LatestApiVersion,
});

export default stripe;
