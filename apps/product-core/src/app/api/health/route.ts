import { getPrismaClient } from '@/server/db';
import { jsonSuccess } from '@/server/api';

type HealthDependency = {
  database: 'ok' | 'down';
};

type HealthResult = {
  status: 'ok' | 'degraded';
  app: string;
  dependencies: HealthDependency;
};

async function checkDatabase(): Promise<'ok' | 'down'> {
  try {
    const prisma = getPrismaClient();
    await prisma.$queryRawUnsafe('SELECT 1');
    return 'ok';
  } catch {
    return 'down';
  }
}

export async function GET() {
  const database = await checkDatabase();
  const overall = database === 'ok' ? 'ok' : 'degraded';

  const result: HealthResult = {
    status: overall,
    app: 'product-core',
    dependencies: { database },
  };

  return jsonSuccess(result);
}
