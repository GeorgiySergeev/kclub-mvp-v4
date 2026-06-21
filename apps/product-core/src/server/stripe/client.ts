import Stripe from 'stripe';

import { readStripeEnv } from './env';

let cachedStripe: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!cachedStripe) {
    const env = readStripeEnv();
    cachedStripe = new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  return cachedStripe;
}

export function resetStripeClientForTests(): void {
  cachedStripe = null;
}
