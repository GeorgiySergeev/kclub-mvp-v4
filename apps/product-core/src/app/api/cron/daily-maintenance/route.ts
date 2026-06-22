import { ERROR_CODES, type CronResultDto } from '@kclub/contracts';

import { getPrismaClient } from '@/server/db';
import { jsonSuccess, jsonError } from '@/server/api';
import { createLogger } from '@/server/logger';

function getCronSecret(): string | undefined {
  return process.env.CRON_SECRET;
}

export async function POST(request: Request): Promise<Response> {
  const log = createLogger();

  log.cron('Daily maintenance started');

  const cronSecret = getCronSecret();
  if (!cronSecret) {
    log.error('Cron route not configured');
    return jsonError(
      { code: ERROR_CODES.SERVER_ERROR, message: 'Cron route is not configured' },
      undefined,
      { status: 500 },
    );
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.slice(7) !== cronSecret) {
    log.cron('Cron unauthorized attempt');
    return jsonError({ code: ERROR_CODES.PERMISSION_DENIED, message: 'Unauthorized' }, undefined, {
      status: 401,
    });
  }

  const prisma = getPrismaClient();
  const now = new Date();

  const cardsExpired = await prisma.memberCard.updateMany({
    where: { status: 'ACTIVE', expires_at: { lt: now } },
    data: { status: 'EXPIRED' },
  });

  const subscriptionsExpired = await prisma.vipSubscription.updateMany({
    where: {
      status: { in: ['ACTIVE', 'PAST_DUE', 'CANCELED'] },
      current_period_end: { lt: now },
    },
    data: { status: 'EXPIRED' },
  });

  const expiredUserIds = await prisma.vipSubscription.findMany({
    where: { status: 'EXPIRED', user: { membership_tier: 'VIP' } },
    select: { user_id: true },
    distinct: ['user_id'],
  });

  const businessesHidden = await prisma.businessProfile.updateMany({
    where: {
      status: 'PUBLISHED',
      user_id: { in: expiredUserIds.map((r) => r.user_id) },
    },
    data: {
      status: 'HIDDEN',
      featured_top: false,
      featured_recommended: false,
    },
  });

  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  const webhookEventsDeleted = await prisma.stripeWebhookEvent.deleteMany({
    where: { created_at: { lt: ninetyDaysAgo } },
  });

  const result: CronResultDto = {
    cardsExpired: cardsExpired.count,
    subscriptionsExpired: subscriptionsExpired.count,
    businessesHidden: businessesHidden.count,
    webhookEventsCleaned: webhookEventsDeleted.count,
  };

  log.cron('Daily maintenance completed', { result });

  return jsonSuccess(result);
}
