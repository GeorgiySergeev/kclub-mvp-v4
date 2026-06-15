import { baseEnvSchema } from '@kclub/config/env';
import { z } from 'zod';

export const productCoreDatabaseEnvSchema = baseEnvSchema.extend({
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid PostgreSQL connection URL'),
});

export type ProductCoreDatabaseEnv = z.infer<typeof productCoreDatabaseEnvSchema>;

export function readDatabaseEnv(env: NodeJS.ProcessEnv = process.env): ProductCoreDatabaseEnv {
  return productCoreDatabaseEnvSchema.parse(env);
}
