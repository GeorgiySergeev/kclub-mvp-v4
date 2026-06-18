import { z } from 'zod';

/**
 * Common environment schema structure for apps to use.
 * This does not contain actual secrets, just the shape of them.
 */
export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type BaseEnv = z.infer<typeof baseEnvSchema>;

/**
 * Public (client-safe) Stripe environment variables.
 * These are prefixed with NEXT_PUBLIC_ and available to the browser.
 */
export const stripePublicEnvSchema = z.object({
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1, 'Stripe publishable key is required'),
  NEXT_PUBLIC_APP_URL: z.string().url('APP_URL must be a valid URL'),
});

export type StripePublicEnv = z.infer<typeof stripePublicEnvSchema>;
