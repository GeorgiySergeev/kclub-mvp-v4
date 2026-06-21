import type { PrismaClient } from '@kclub/database/client';

let cachedPrisma: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!cachedPrisma) {
    // Hide the require from Turbopack to prevent it from bundling Prisma and breaking __dirname
    const { PrismaClient: NativePrismaClient } = eval('require')('@kclub/database/client');
    cachedPrisma = new NativePrismaClient();
  }

  return cachedPrisma!;
}

export function resetPrismaClientForTests(): void {
  if (cachedPrisma) {
    cachedPrisma.$disconnect();
    cachedPrisma = null;
  }
}
