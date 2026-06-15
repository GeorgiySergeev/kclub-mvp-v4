import 'server-only';

import { readDatabaseEnv } from './env';

export type ProductCoreDatabaseClient = {
  connectionString: string;
};

let cachedClient: ProductCoreDatabaseClient | null = null;

export function getDatabaseClient(): ProductCoreDatabaseClient {
  if (!cachedClient) {
    const env = readDatabaseEnv();
    cachedClient = {
      connectionString: env.DATABASE_URL,
    };
  }

  return cachedClient;
}

export function resetDatabaseClientForTests(): void {
  cachedClient = null;
}
