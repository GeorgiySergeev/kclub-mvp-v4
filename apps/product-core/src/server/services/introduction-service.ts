import { ERROR_CODES, type IntroductionStatus, type IntroductionDto } from '@kclub/contracts';
import {
  canCreateIntroductionForDay,
  canCreateIntroductionForTarget,
  canCreatePendingIntroduction,
  hasActiveVipAccess,
} from '@kclub/domain';
import type { IntroductionSubmitInput } from '@kclub/validation';

import { AppError } from '@/server/errors';
import { getPrismaClient } from '@/server/db';
import { createDbAuditService } from '@/server/audit';
import type { RequestContext } from '@/server/context';

const auditService = createDbAuditService();

export async function submitIntroduction(
  input: IntroductionSubmitInput,
  context: RequestContext,
): Promise<IntroductionDto> {
  const prisma = getPrismaClient();
  const userId = context.actor?.kind === 'member' ? context.actor.userId : null;

  if (!userId) {
    throw new AppError({
      code: ERROR_CODES.PERMISSION_DENIED,
      message: 'Authentication required',
      status: 401,
    });
  }

  // 1. VIP and PUBLISHED business check
  const vipSubs = await prisma.vipSubscription.findMany({
    where: { user_id: userId },
  });
  const isVip = vipSubs.some((sub) => hasActiveVipAccess(sub.status));

  if (!isVip) {
    throw new AppError({
      code: ERROR_CODES.VIP_REQUIRED,
      message: 'VIP membership is required to submit introductions',
      status: 403,
    });
  }

  const requesterBusiness = await prisma.businessProfile.findUnique({
    where: { id: input.requesterBusinessId },
  });

  if (!requesterBusiness || requesterBusiness.user_id !== userId) {
    throw new AppError({
      code: ERROR_CODES.PERMISSION_DENIED,
      message: 'You must own the requester business',
      status: 403,
    });
  }

  if (requesterBusiness.status !== 'PUBLISHED') {
    throw new AppError({
      code: ERROR_CODES.INTRODUCTION_NOT_ALLOWED,
      message: 'Requester business must be PUBLISHED',
      status: 403,
    });
  }

  // 2. Target business check
  if (input.targetBusinessId === input.requesterBusinessId) {
    throw new AppError({
      code: ERROR_CODES.VALIDATION_INVALID_INPUT,
      message: 'Cannot introduce to yourself',
      status: 400,
    });
  }

  const targetBusiness = await prisma.businessProfile.findUnique({
    where: { id: input.targetBusinessId },
  });

  if (!targetBusiness || targetBusiness.status !== 'PUBLISHED') {
    throw new AppError({
      code: ERROR_CODES.INTRODUCTION_TARGET_UNAVAILABLE,
      message: 'Target business not found or not published',
      status: 404,
    });
  }

  if (targetBusiness.user_id === userId) {
    throw new AppError({
      code: ERROR_CODES.VALIDATION_INVALID_INPUT,
      message: 'Cannot introduce to your own business',
      status: 400,
    });
  }

  // 3. Limits check
  const now = new Date();

  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);

  const introductionsToday = await prisma.businessIntroduction.count({
    where: {
      requester_user_id: userId,
      created_at: { gte: todayStart },
    },
  });

  if (!canCreateIntroductionForDay(introductionsToday)) {
    throw new AppError({
      code: ERROR_CODES.RATE_LIMIT_INTRODUCTION_DAILY,
      message: 'Daily introduction limit reached',
      status: 429,
    });
  }

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const targetIntroductionsIn30Days = await prisma.businessIntroduction.count({
    where: {
      requester_user_id: userId,
      target_business_id: input.targetBusinessId,
      created_at: { gte: thirtyDaysAgo },
    },
  });

  if (!canCreateIntroductionForTarget(targetIntroductionsIn30Days)) {
    throw new AppError({
      code: ERROR_CODES.RATE_LIMIT_INTRODUCTION_TARGET,
      message: 'Too many introductions to this target recently',
      status: 429,
    });
  }

  const pendingCount = await prisma.businessIntroduction.count({
    where: {
      requester_user_id: userId,
      target_business_id: input.targetBusinessId,
      status: { in: ['SUBMITTED', 'IN_REVIEW'] },
    },
  });

  if (!canCreatePendingIntroduction(pendingCount)) {
    throw new AppError({
      code: ERROR_CODES.INTRODUCTION_PENDING_EXISTS,
      message: 'You already have a pending introduction to this target',
      status: 409,
    });
  }

  const introduction = await prisma.businessIntroduction.create({
    data: {
      requester_user_id: userId,
      requester_business_id: input.requesterBusinessId,
      target_business_id: input.targetBusinessId,
      status: 'SUBMITTED',
      message: input.message ?? null,
    },
  });

  await auditService.log(
    {
      action: 'INTRODUCTION_SUBMITTED',
      entityType: 'BusinessIntroduction',
      entityId: introduction.id,
      after: { status: introduction.status },
    },
    context,
  );

  return toIntroductionDto(introduction);
}

export async function getOwnIntroductions(userId: string): Promise<IntroductionDto[]> {
  const prisma = getPrismaClient();

  const introductions = await prisma.businessIntroduction.findMany({
    where: { requester_user_id: userId },
    orderBy: { created_at: 'desc' },
  });

  return introductions.map(toIntroductionDto);
}

export async function cancelIntroduction(
  introductionId: string,
  context: RequestContext,
): Promise<IntroductionDto> {
  const prisma = getPrismaClient();
  const userId = context.actor?.kind === 'member' ? context.actor.userId : null;

  if (!userId) {
    throw new AppError({
      code: ERROR_CODES.PERMISSION_DENIED,
      message: 'Authentication required',
      status: 401,
    });
  }

  const introduction = await prisma.businessIntroduction.findUnique({
    where: { id: introductionId },
  });

  if (!introduction) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Introduction not found',
      status: 404,
    });
  }

  if (introduction.requester_user_id !== userId) {
    throw new AppError({
      code: ERROR_CODES.PERMISSION_DENIED,
      message: 'You do not have permission to cancel this introduction',
      status: 403,
    });
  }

  // Member can only cancel from non-terminal states
  if (
    introduction.status === 'APPROVED' ||
    introduction.status === 'COMPLETED' ||
    introduction.status === 'REJECTED' ||
    introduction.status === 'CANCELED'
  ) {
    throw new AppError({
      code: ERROR_CODES.INTRODUCTION_INVALID_STATUS_TRANSITION,
      message: 'Cannot cancel from current status',
      status: 409,
    });
  }

  const updated = await prisma.businessIntroduction.update({
    where: { id: introductionId },
    data: { status: 'CANCELED' },
  });

  await auditService.log(
    {
      action: 'INTRODUCTION_CANCELED',
      entityType: 'BusinessIntroduction',
      entityId: introductionId,
      before: { status: introduction.status },
      after: { status: updated.status },
    },
    context,
  );

  return toIntroductionDto(updated);
}

export function toIntroductionDto(intro: any): IntroductionDto {
  return {
    id: intro.id,
    requesterUserId: intro.requester_user_id,
    requesterBusinessId: intro.requester_business_id,
    targetBusinessId: intro.target_business_id,
    status: intro.status as IntroductionStatus,
    message: intro.message,
    rejectionReason: intro.rejection_reason,
    createdAt: intro.created_at.toISOString(),
    updatedAt: intro.updated_at.toISOString(),
  };
}
