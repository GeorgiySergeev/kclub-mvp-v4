import { z } from 'zod';

/**
 * Common environment schema structure for apps to use.
 * This does not contain actual secrets, just the shape of them.
 */
export const baseEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  // Add other shared environment variable shapes here
});

export type BaseEnv = z.infer<typeof baseEnvSchema>;
