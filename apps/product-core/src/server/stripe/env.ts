import { stripePublicEnvSchema } from '@kclub/config/env';
import { z } from 'zod';

export const productCoreStripeEnvSchema = stripePublicEnvSchema.extend({
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_WEBHOOK_SECRET: z.string().min(1, 'STRIPE_WEBHOOK_SECRET is required'),
});

export type ProductCoreStripeEnv = z.infer<typeof productCoreStripeEnvSchema>;

export function readStripeEnv(env: NodeJS.ProcessEnv = process.env): ProductCoreStripeEnv {
  return productCoreStripeEnvSchema.parse(env);
}
