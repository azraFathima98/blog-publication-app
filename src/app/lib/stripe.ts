import Stripe from 'stripe';

// Check if the secret key is present
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY in environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil' as Stripe.LatestApiVersion,
});
export default stripe;
