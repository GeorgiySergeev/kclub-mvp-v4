import { getPrismaClient } from '@/server/db';
import { createDbAuditService } from '@/server/audit';
import { createRequestContext } from '@/server/context';

const auditService = createDbAuditService();
const systemContext = createRequestContext({ actor: { kind: 'system' } });

const WEBHOOK_RETENTION_DAYS = 90;

export type DailyMaintenanceResult = {
  expiredCards: number;
  expiredSubscriptions: number;
  hiddenBusinesses: number;
  cleanedEvents: number;
};

export async function runDailyMaintenance(): Promise<DailyMaintenanceResult> {
  const prisma = getPrismaClient();
  const now = new Date();

  const expiredCards = await expireCards(prisma, now);
  const expiredSubscriptions = await expireSubscriptions(prisma, now);
  const hiddenBusinesses = await hideExpiredBusinesses(prisma, now);
  const cleanedEvents = await cleanOldWebhookEvents(prisma, now);

  return { expiredCards, expiredSubscriptions, hiddenBusinesses, cleanedEvents };
}

async function expireCards(prisma: ReturnType<typeof getPrismaClient>, now: Date): Promise<number> {
  const result = await prisma.memberCard.updateMany({
    where: { status: 'ACTIVE', expires_at: { not: null, lte: now } },
    data: { status: 'EXPIRED' },
  });
  return result.count;
}

async function expireSubscriptions(
  prisma: ReturnType<typeof getPrismaClient>,
  now: Date,
): Promise<number> {
  const result = await prisma.vipSubscription.updateMany({
    where: {
      status: { not: 'EXPIRED' },
      current_period_end: { not: null, lte: now },
    },
    data: { status: 'EXPIRED', expires_at: now },
  });
  return result.count;
}

async function hideExpiredBusinesses(
  prisma: ReturnType<typeof getPrismaClient>,
  now: Date,
): Promise<number> {
  const expiredVipUserIds = await prisma.vipSubscription.findMany({
    where: {
      status: 'EXPIRED',
      user_id: { not: undefined },
    },
    select: { user_id: true },
    distinct: ['user_id'],
  });

  if (expiredVipUserIds.length === 0) return 0;

  const userIds = expiredVipUserIds.map((s) => s.user_id);

  const businessesToHide = await prisma.businessProfile.findMany({
    where: {
      user_id: { in: userIds },
      status: 'PUBLISHED',
    },
  });

  if (businessesToHide.length === 0) return 0;

  const businessIds = businessesToHide.map((b) => b.id);

  await prisma.$transaction(async (tx) => {
    await tx.businessProfile.updateMany({
      where: { id: { in: businessIds } },
      data: {
        status: 'HIDDEN',
        hidden_at: now,
        featured_top: false,
        featured_recommended: false,
      },
    });
  });

  for (const business of businessesToHide) {
    await auditService.log(
      {
        action: 'BUSINESS_HIDDEN',
        entityType: 'BusinessProfile',
        entityId: business.id,
        before: { status: 'PUBLISHED' },
        after: { status: 'HIDDEN', reason: 'VIP subscription expired' },
      },
      systemContext,
    );
  }

  return businessesToHide.length;
}

async function cleanOldWebhookEvents(
  prisma: ReturnType<typeof getPrismaClient>,
  now: Date,
): Promise<number> {
  const cutoff = new Date(now.getTime() - WEBHOOK_RETENTION_DAYS * 24 * 60 * 60 * 1000);
  const result = await prisma.stripeWebhookEvent.deleteMany({
    where: { created_at: { lte: cutoff } },
  });
  return result.count;
}
