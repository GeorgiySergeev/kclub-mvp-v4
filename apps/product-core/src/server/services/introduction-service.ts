import {
  ERROR_CODES,
  type BusinessIncomingIntroductionDto,
  type MemberIntroductionDto,
} from '@kclub/contracts';
import {
  canCreateIntroductionForDay,
  canCreateIntroductionForTarget,
  canCreatePendingIntroduction,
  hasActiveVipAccess,
} from '@kclub/domain';
import type { IntroductionRejectInput, IntroductionSubmitInput } from '@kclub/validation';

import { AppError } from '@/server/errors';
import { getPrismaClient } from '@/server/db';
import { createDbAuditService } from '@/server/audit';
import type { RequestContext } from '@/server/context';

const auditService = createDbAuditService();

async function assertCanRecommend(userId: string): Promise<void> {
  const prisma = getPrismaClient();

  const [vipSubs, ownBusiness] = await Promise.all([
    prisma.vipSubscription.findMany({ where: { user_id: userId } }),
    prisma.businessProfile.findFirst({
      where: { user_id: userId, status: { not: 'REJECTED' } },
    }),
  ]);

  const isVip = vipSubs.some((sub) => hasActiveVipAccess(sub.status));
  const hasBusiness = ownBusiness !== null;

  if (!isVip && !hasBusiness) {
    throw new AppError({
      code: ERROR_CODES.PERMISSION_DENIED,
      message: 'VIP membership or an approved business is required to send recommendations',
      status: 403,
    });
  }
}

export async function submitIntroduction(
  input: IntroductionSubmitInput,
  context: RequestContext,
): Promise<MemberIntroductionDto> {
  const prisma = getPrismaClient();
  const userId = context.actor?.kind === 'member' ? context.actor.userId : null;

  if (!userId) {
    throw new AppError({ code: ERROR_CODES.PERMISSION_DENIED, message: 'Authentication required', status: 401 });
  }

  await assertCanRecommend(userId);

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
      message: 'Cannot recommend to your own business',
      status: 400,
    });
  }

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);

  const introductionsToday = await prisma.businessIntroduction.count({
    where: { requester_user_id: userId, created_at: { gte: todayStart } },
  });

  if (!canCreateIntroductionForDay(introductionsToday)) {
    throw new AppError({ code: ERROR_CODES.RATE_LIMIT_INTRODUCTION_DAILY, message: 'Daily recommendation limit reached', status: 429 });
  }

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const targetIntroductionsIn30Days = await prisma.businessIntroduction.count({
    where: { requester_user_id: userId, target_business_id: input.targetBusinessId, created_at: { gte: thirtyDaysAgo } },
  });

  if (!canCreateIntroductionForTarget(targetIntroductionsIn30Days)) {
    throw new AppError({ code: ERROR_CODES.RATE_LIMIT_INTRODUCTION_TARGET, message: 'Too many recommendations to this target recently', status: 429 });
  }

  const pendingCount = await prisma.businessIntroduction.count({
    where: { requester_user_id: userId, target_business_id: input.targetBusinessId, status: { in: ['SUBMITTED', 'IN_REVIEW'] } },
  });

  if (!canCreatePendingIntroduction(pendingCount)) {
    throw new AppError({ code: ERROR_CODES.INTRODUCTION_PENDING_EXISTS, message: 'You already have a pending recommendation to this target', status: 409 });
  }

  const introduction = await prisma.businessIntroduction.create({
    data: {
      requester_user_id: userId,
      requester_business_id: undefined,
      target_business_id: input.targetBusinessId,
      status: 'SUBMITTED',
      client_name: input.clientName,
      client_contact: input.clientContact,
      message: input.message ?? null,
    },
    include: {
      target_business: { select: { name: true, slug: true } },
    },
  });

  await auditService.log(
    { action: 'INTRODUCTION_SUBMITTED', entityType: 'BusinessIntroduction', entityId: introduction.id, after: { status: introduction.status } },
    context,
  );

  return toMemberIntroductionDto(introduction);
}

export async function getOwnIntroductions(userId: string): Promise<MemberIntroductionDto[]> {
  const prisma = getPrismaClient();
  const introductions = await prisma.businessIntroduction.findMany({
    where: { requester_user_id: userId },
    include: { target_business: { select: { name: true, slug: true } } },
    orderBy: { created_at: 'desc' },
  });
  return introductions.map(toMemberIntroductionDto);
}

export async function cancelIntroduction(
  introductionId: string,
  context: RequestContext,
): Promise<MemberIntroductionDto> {
  const prisma = getPrismaClient();
  const userId = context.actor?.kind === 'member' ? context.actor.userId : null;

  if (!userId) {
    throw new AppError({ code: ERROR_CODES.PERMISSION_DENIED, message: 'Authentication required', status: 401 });
  }

  const introduction = await prisma.businessIntroduction.findUnique({ where: { id: introductionId } });

  if (!introduction) {
    throw new AppError({ code: ERROR_CODES.RESOURCE_NOT_FOUND, message: 'Recommendation not found', status: 404 });
  }

  if (introduction.requester_user_id !== userId) {
    throw new AppError({ code: ERROR_CODES.PERMISSION_DENIED, message: 'You do not have permission to cancel this recommendation', status: 403 });
  }

  if (['APPROVED', 'COMPLETED', 'REJECTED', 'CANCELED'].includes(introduction.status)) {
    throw new AppError({ code: ERROR_CODES.INTRODUCTION_INVALID_STATUS_TRANSITION, message: 'Cannot cancel from current status', status: 409 });
  }

  const updated = await prisma.businessIntroduction.update({
    where: { id: introductionId },
    data: { status: 'CANCELED' },
    include: { target_business: { select: { name: true, slug: true } } },
  });

  await auditService.log(
    { action: 'INTRODUCTION_CANCELED', entityType: 'BusinessIntroduction', entityId: introductionId, before: { status: introduction.status }, after: { status: updated.status } },
    context,
  );

  return toMemberIntroductionDto(updated);
}

export async function getIncomingIntroductions(businessId: string): Promise<BusinessIncomingIntroductionDto[]> {
  const prisma = getPrismaClient();
  const introductions = await prisma.businessIntroduction.findMany({
    where: { target_business_id: businessId },
    include: {
      requester_user: { select: { display_name: true } },
      target_business: { select: { name: true, slug: true } },
    },
    orderBy: { created_at: 'desc' },
  });
  return introductions.map(toBusinessIncomingIntroductionDto);
}

export async function reviewIntroduction(
  introductionId: string,
  context: RequestContext,
): Promise<BusinessIncomingIntroductionDto> {
  return updateIntroductionStatus(introductionId, 'IN_REVIEW', 'INTRODUCTION_APPROVED', context);
}

export async function approveIntroduction(
  introductionId: string,
  context: RequestContext,
): Promise<BusinessIncomingIntroductionDto> {
  return updateIntroductionStatus(introductionId, 'APPROVED', 'INTRODUCTION_APPROVED', context);
}

export async function rejectIntroduction(
  introductionId: string,
  input: IntroductionRejectInput,
  context: RequestContext,
): Promise<BusinessIncomingIntroductionDto> {
  const prisma = getPrismaClient();
  const businessId = await resolveActorBusinessId(context);

  const introduction = await prisma.businessIntroduction.findUnique({ where: { id: introductionId } });
  if (!introduction) throw new AppError({ code: ERROR_CODES.RESOURCE_NOT_FOUND, message: 'Recommendation not found', status: 404 });
  if (introduction.target_business_id !== businessId) throw new AppError({ code: ERROR_CODES.PERMISSION_DENIED, message: 'Not your business recommendation', status: 403 });
  if (!['SUBMITTED', 'IN_REVIEW'].includes(introduction.status)) throw new AppError({ code: ERROR_CODES.INTRODUCTION_INVALID_STATUS_TRANSITION, message: 'Cannot reject from current status', status: 409 });

  const updated = await prisma.businessIntroduction.update({
    where: { id: introductionId },
    data: { status: 'REJECTED', rejection_reason: input.reason ?? null },
    include: { requester_user: { select: { display_name: true } }, target_business: { select: { name: true, slug: true } } },
  });

  await auditService.log(
    { action: 'INTRODUCTION_REJECTED', entityType: 'BusinessIntroduction', entityId: introductionId, before: { status: introduction.status }, after: { status: updated.status } },
    context,
  );

  return toBusinessIncomingIntroductionDto(updated);
}

async function updateIntroductionStatus(
  introductionId: string,
  newStatus: 'IN_REVIEW' | 'APPROVED',
  auditAction: 'INTRODUCTION_APPROVED',
  context: RequestContext,
): Promise<BusinessIncomingIntroductionDto> {
  const prisma = getPrismaClient();
  const businessId = await resolveActorBusinessId(context);

  const introduction = await prisma.businessIntroduction.findUnique({ where: { id: introductionId } });
  if (!introduction) throw new AppError({ code: ERROR_CODES.RESOURCE_NOT_FOUND, message: 'Recommendation not found', status: 404 });
  if (introduction.target_business_id !== businessId) throw new AppError({ code: ERROR_CODES.PERMISSION_DENIED, message: 'Not your business recommendation', status: 403 });

  const validFrom: Record<string, string[]> = { IN_REVIEW: ['SUBMITTED'], APPROVED: ['IN_REVIEW'] };
  if (!validFrom[newStatus]?.includes(introduction.status)) {
    throw new AppError({ code: ERROR_CODES.INTRODUCTION_INVALID_STATUS_TRANSITION, message: 'Invalid status transition', status: 409 });
  }

  const updated = await prisma.businessIntroduction.update({
    where: { id: introductionId },
    data: { status: newStatus },
    include: { requester_user: { select: { display_name: true } }, target_business: { select: { name: true, slug: true } } },
  });

  await auditService.log(
    { action: auditAction, entityType: 'BusinessIntroduction', entityId: introductionId, before: { status: introduction.status }, after: { status: updated.status } },
    context,
  );

  return toBusinessIncomingIntroductionDto(updated);
}

async function resolveActorBusinessId(context: RequestContext): Promise<string> {
  const userId = context.actor?.kind === 'member' ? context.actor.userId : null;
  if (!userId) throw new AppError({ code: ERROR_CODES.PERMISSION_DENIED, message: 'Authentication required', status: 401 });

  const prisma = getPrismaClient();
  const business = await prisma.businessProfile.findFirst({
    where: { user_id: userId, status: { notIn: ['REJECTED', 'HIDDEN'] } },
  });

  if (!business) throw new AppError({ code: ERROR_CODES.PERMISSION_DENIED, message: 'No active business found', status: 403 });

  return business.id;
}

export function toMemberIntroductionDto(intro: any): MemberIntroductionDto {
  return {
    id: intro.id,
    requesterUserId: intro.requester_user_id,
    requesterBusinessId: intro.requester_business_id ?? null,
    targetBusinessId: intro.target_business_id,
    status: intro.status,
    clientName: intro.client_name ?? '',
    clientContact: intro.client_contact ?? '',
    message: intro.message,
    rejectionReason: intro.rejection_reason,
    createdAt: intro.created_at.toISOString(),
    updatedAt: intro.updated_at.toISOString(),
    targetBusinessName: intro.target_business?.name ?? '',
    targetBusinessSlug: intro.target_business?.slug ?? '',
  };
}

export function toBusinessIncomingIntroductionDto(intro: any): BusinessIncomingIntroductionDto {
  return {
    id: intro.id,
    requesterUserId: intro.requester_user_id,
    requesterBusinessId: intro.requester_business_id ?? null,
    requesterDisplayName: intro.requester_user?.display_name ?? null,
    targetBusinessId: intro.target_business_id,
    status: intro.status,
    clientName: intro.client_name ?? '',
    clientContact: intro.client_contact ?? '',
    message: intro.message,
    rejectionReason: intro.rejection_reason,
    createdAt: intro.created_at.toISOString(),
    updatedAt: intro.updated_at.toISOString(),
    targetBusinessName: intro.target_business?.name ?? '',
    targetBusinessSlug: intro.target_business?.slug ?? '',
  };
}
