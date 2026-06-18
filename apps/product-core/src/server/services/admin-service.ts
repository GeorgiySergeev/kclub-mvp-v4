import {
  ERROR_CODES,
  type AdminBusinessDetailDto,
  type AdminUserDetailDto,
  type AdminUserListItemDto,
  type AuditLogDto,
  type BusinessStatus,
  type ClubCardStatus,
  type DashboardMetricsDto,
  type IntroductionDto,
  type IntroductionStatus,
  type Locale,
  type MemberCardDto,
  type MemberTier,
  type SubscriptionDto,
  type SubscriptionStatus,
  type UserStatus,
} from '@kclub/contracts';
import {
  canFeatureBusiness,
  canSetFeaturedFlag,
  canTransitionBusinessStatus,
  FEATURED_RECOMMENDED_MAX,
  FEATURED_TOP_MAX,
} from '@kclub/domain';
import type {
  BusinessApproveInput,
  BusinessFeaturedInput,
  BusinessHideInput,
  BusinessRejectInput,
  CategoryCreateInput,
  CategoryUpdateInput,
  CityCreateInput,
  CityUpdateInput,
  CountryCreateInput,
  CountryUpdateInput,
  IntroductionApproveInput,
  IntroductionRejectInput,
  RevokeCardInput,
  ReissueCardInput,
  BlockUserInput,
  UnblockUserInput,
  AdminConfigUpdateInput,
  StaffRoleUpdateInput,
} from '@kclub/validation';

import { AppError } from '@/server/errors';
import { getPrismaClient } from '@/server/db';
import { createDbAuditService } from '@/server/audit';
import type { RequestContext } from '@/server/context';
import { revokeCard, reissueCard, toMemberCardDto } from './card-service';
import { toSubscriptionDto } from './subscription-service';

const auditService = createDbAuditService();

// ── Dashboard Metrics ──

export async function getDashboardMetrics(): Promise<DashboardMetricsDto> {
  const prisma = getPrismaClient();

  const [
    totalUsers,
    blockedUsers,
    activeSubs,
    pastDueSubs,
    expiredSubs,
    businessesReview,
    introductionsSubmitted,
    introductionsInReview,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { status: 'BLOCKED' } }),
    prisma.vipSubscription.count({ where: { status: 'ACTIVE' } }),
    prisma.vipSubscription.count({ where: { status: 'PAST_DUE' } }),
    prisma.vipSubscription.count({ where: { status: 'EXPIRED' } }),
    prisma.businessProfile.count({ where: { status: 'UNDER_REVIEW' } }),
    prisma.businessIntroduction.count({ where: { status: 'SUBMITTED' } }),
    prisma.businessIntroduction.count({ where: { status: 'IN_REVIEW' } }),
  ]);

  return {
    totalUsers,
    activeUsers: totalUsers - blockedUsers,
    blockedUsers,
    activeSubscriptions: activeSubs,
    pastDueSubscriptions: pastDueSubs,
    expiredSubscriptions: expiredSubs,
    businessesUnderReview: businessesReview,
    introductionsSubmitted,
    introductionsInReview,
  };
}

// ── Users ──

const userInclude = {
  _count: { select: { member_cards: true } },
};

type UserWithCounts = {
  id: string;
  phone: string;
  display_name: string | null;
  locale_preference: string | null;
  membership_tier: string;
  status: string;
  terms_accepted_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

export async function listUsers(): Promise<AdminUserListItemDto[]> {
  const prisma = getPrismaClient();
  const users = await prisma.user.findMany({
    orderBy: { created_at: 'desc' },
  });
  return users.map(toAdminUserListItem);
}

export async function getUserDetail(userId: string): Promise<AdminUserDetailDto> {
  const prisma = getPrismaClient();
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'User not found',
      status: 404,
    });
  }

  return toAdminUserDetail(user);
}

export async function blockUser(
  userId: string,
  input: BlockUserInput,
  context: RequestContext,
): Promise<AdminUserDetailDto> {
  const prisma = getPrismaClient();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'User not found',
      status: 404,
    });
  }

  if (user.status === 'BLOCKED') {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_CONFLICT,
      message: 'User is already blocked',
      status: 409,
    });
  }

  const [updated] = await prisma.$transaction(async (tx) => {
    await tx.memberCard.updateMany({
      where: { user_id: userId, status: 'ACTIVE' },
      data: {
        status: 'REVOKED',
        revoked_at: new Date(),
        revoked_reason: input.reason ?? 'User blocked',
      },
    });

    const u = await tx.user.update({
      where: { id: userId },
      data: { status: 'BLOCKED' },
    });

    return [u];
  });

  await auditService.log(
    {
      action: 'USER_BLOCKED',
      entityType: 'User',
      entityId: userId,
      before: { status: user.status },
      after: { status: updated.status },
    },
    context,
  );

  return toAdminUserDetail(updated);
}

export async function unblockUser(
  userId: string,
  input: UnblockUserInput,
  context: RequestContext,
): Promise<AdminUserDetailDto> {
  const prisma = getPrismaClient();

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'User not found',
      status: 404,
    });
  }

  if (user.status !== 'BLOCKED') {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_CONFLICT,
      message: 'User is not blocked',
      status: 409,
    });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { status: 'ACTIVE' },
  });

  await auditService.log(
    {
      action: 'USER_UNBLOCKED',
      entityType: 'User',
      entityId: userId,
      before: { status: user.status },
      after: { status: updated.status },
    },
    context,
  );

  return toAdminUserDetail(updated);
}

// ── Cards ──

export async function listCards(): Promise<MemberCardDto[]> {
  const prisma = getPrismaClient();
  const cards = await prisma.memberCard.findMany({
    orderBy: { issued_at: 'desc' },
  });
  return cards.map(toMemberCardDto);
}

export async function getCardDetail(cardId: string): Promise<MemberCardDto> {
  const prisma = getPrismaClient();
  const card = await prisma.memberCard.findUnique({ where: { id: cardId } });
  if (!card) {
    throw new AppError({
      code: ERROR_CODES.CARD_NOT_FOUND,
      message: 'Card not found',
      status: 404,
    });
  }
  return toMemberCardDto(card);
}

export async function adminRevokeCard(
  cardId: string,
  input: RevokeCardInput,
  context: RequestContext,
): Promise<MemberCardDto> {
  const prisma = getPrismaClient();
  const card = await prisma.memberCard.findUnique({ where: { id: cardId } });
  if (!card) {
    throw new AppError({
      code: ERROR_CODES.CARD_NOT_FOUND,
      message: 'Card not found',
      status: 404,
    });
  }

  const updated = await revokeCard(cardId, input.reason);

  await auditService.log(
    {
      action: 'CARD_REVOKED',
      entityType: 'MemberCard',
      entityId: cardId,
      before: { status: card.status, userId: card.user_id },
      after: { status: updated.status },
    },
    context,
  );

  return toMemberCardDto(updated);
}

export async function adminReissueCard(
  cardId: string,
  input: ReissueCardInput,
  context: RequestContext,
): Promise<MemberCardDto> {
  const prisma = getPrismaClient();
  const card = await prisma.memberCard.findUnique({ where: { id: cardId } });
  if (!card) {
    throw new AppError({
      code: ERROR_CODES.CARD_NOT_FOUND,
      message: 'Card not found',
      status: 404,
    });
  }

  const newCard = await reissueCard(card.user_id, card.membership_tier, cardId, input.reason);

  await auditService.log(
    {
      action: 'CARD_ISSUED',
      entityType: 'MemberCard',
      entityId: newCard.id,
      before: { revokedCardId: cardId },
      after: { cardNumber: newCard.card_number, status: newCard.status },
    },
    context,
  );

  return toMemberCardDto(newCard);
}

// ── Businesses ──

export async function listBusinesses(): Promise<AdminBusinessDetailDto[]> {
  const prisma = getPrismaClient();
  const businesses = await prisma.businessProfile.findMany({
    include: { category: true, country: true, city: true },
    orderBy: { created_at: 'desc' },
  });
  return businesses.map(toAdminBusinessDetail);
}

export async function getBusinessDetail(businessId: string): Promise<AdminBusinessDetailDto> {
  const prisma = getPrismaClient();
  const business = await prisma.businessProfile.findUnique({
    where: { id: businessId },
    include: { category: true, country: true, city: true },
  });
  if (!business) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Business not found',
      status: 404,
    });
  }
  return toAdminBusinessDetail(business);
}

export async function approveBusiness(
  businessId: string,
  input: BusinessApproveInput,
  context: RequestContext,
): Promise<AdminBusinessDetailDto> {
  const prisma = getPrismaClient();
  const business = await prisma.businessProfile.findUnique({
    where: { id: businessId },
    include: { category: true, country: true, city: true },
  });

  if (!business) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Business not found',
      status: 404,
    });
  }

  if (!canTransitionBusinessStatus(business.status as BusinessStatus, 'APPROVED')) {
    throw new AppError({
      code: ERROR_CODES.BUSINESS_INVALID_STATUS_TRANSITION,
      message: `Cannot approve business with status ${business.status}`,
      status: 409,
    });
  }

  const updated = await prisma.businessProfile.update({
    where: { id: businessId },
    data: {
      status: 'APPROVED',
      approved_at: new Date(),
      internal_notes: input.notes ?? business.internal_notes,
    },
    include: { category: true, country: true, city: true },
  });

  await auditService.log(
    {
      action: 'BUSINESS_APPROVED',
      entityType: 'BusinessProfile',
      entityId: businessId,
      before: { status: business.status },
      after: { status: updated.status },
    },
    context,
  );

  return toAdminBusinessDetail(updated);
}

export async function rejectBusiness(
  businessId: string,
  input: BusinessRejectInput,
  context: RequestContext,
): Promise<AdminBusinessDetailDto> {
  const prisma = getPrismaClient();
  const business = await prisma.businessProfile.findUnique({
    where: { id: businessId },
    include: { category: true, country: true, city: true },
  });

  if (!business) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Business not found',
      status: 404,
    });
  }

  if (!canTransitionBusinessStatus(business.status as BusinessStatus, 'REJECTED')) {
    throw new AppError({
      code: ERROR_CODES.BUSINESS_INVALID_STATUS_TRANSITION,
      message: `Cannot reject business with status ${business.status}`,
      status: 409,
    });
  }

  const updated = await prisma.businessProfile.update({
    where: { id: businessId },
    data: {
      status: 'REJECTED',
      rejection_reason: input.reason,
      rejected_at: new Date(),
    },
    include: { category: true, country: true, city: true },
  });

  await auditService.log(
    {
      action: 'BUSINESS_REJECTED',
      entityType: 'BusinessProfile',
      entityId: businessId,
      before: { status: business.status },
      after: { status: updated.status, reason: input.reason },
    },
    context,
  );

  return toAdminBusinessDetail(updated);
}

export async function hideBusiness(
  businessId: string,
  input: BusinessHideInput,
  context: RequestContext,
): Promise<AdminBusinessDetailDto> {
  const prisma = getPrismaClient();
  const business = await prisma.businessProfile.findUnique({
    where: { id: businessId },
    include: { category: true, country: true, city: true },
  });

  if (!business) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Business not found',
      status: 404,
    });
  }

  if (!canTransitionBusinessStatus(business.status as BusinessStatus, 'HIDDEN')) {
    throw new AppError({
      code: ERROR_CODES.BUSINESS_INVALID_STATUS_TRANSITION,
      message: `Cannot hide business with status ${business.status}`,
      status: 409,
    });
  }

  const updated = await prisma.businessProfile.update({
    where: { id: businessId },
    data: {
      status: 'HIDDEN',
      hidden_at: new Date(),
      featured_top: false,
      featured_recommended: false,
    },
    include: { category: true, country: true, city: true },
  });

  await auditService.log(
    {
      action: 'BUSINESS_HIDDEN',
      entityType: 'BusinessProfile',
      entityId: businessId,
      before: {
        status: business.status,
        featuredTop: business.featured_top,
        featuredRecommended: business.featured_recommended,
      },
      after: { status: updated.status, featuredTop: false, featuredRecommended: false },
    },
    context,
  );

  return toAdminBusinessDetail(updated);
}

export async function updateBusinessFeatured(
  businessId: string,
  input: BusinessFeaturedInput,
  context: RequestContext,
): Promise<AdminBusinessDetailDto> {
  const prisma = getPrismaClient();

  const business = await prisma.businessProfile.findUnique({
    where: { id: businessId },
    include: { category: true, country: true, city: true },
  });

  if (!business) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Business not found',
      status: 404,
    });
  }

  if (!canFeatureBusiness(business.status as BusinessStatus)) {
    throw new AppError({
      code: ERROR_CODES.FEATURED_BUSINESS_NOT_PUBLISHED,
      message: 'Only PUBLISHED businesses can be featured',
      status: 409,
    });
  }

  const setTop = input.featuredTop;
  const setRecommended = input.featuredRecommended;

  const [updated] = await prisma.$transaction(async (tx) => {
    if (setTop !== undefined && setTop !== business.featured_top) {
      if (setTop) {
        const currentTopCount = await tx.businessProfile.count({
          where: { featured_top: true, id: { not: businessId } },
        });
        if (
          !canSetFeaturedFlag(
            business.status as BusinessStatus,
            true,
            currentTopCount,
            FEATURED_TOP_MAX,
          )
        ) {
          throw new AppError({
            code: ERROR_CODES.FEATURED_LIMIT_REACHED,
            message: `Maximum ${FEATURED_TOP_MAX} featured_top businesses reached`,
            status: 409,
          });
        }
      }
    }

    if (setRecommended !== undefined && setRecommended !== business.featured_recommended) {
      if (setRecommended) {
        const currentRecommendedCount = await tx.businessProfile.count({
          where: { featured_recommended: true, id: { not: businessId } },
        });
        if (
          !canSetFeaturedFlag(
            business.status as BusinessStatus,
            true,
            currentRecommendedCount,
            FEATURED_RECOMMENDED_MAX,
          )
        ) {
          throw new AppError({
            code: ERROR_CODES.FEATURED_LIMIT_REACHED,
            message: `Maximum ${FEATURED_RECOMMENDED_MAX} featured_recommended businesses reached`,
            status: 409,
          });
        }
      }
    }

    const b = await tx.businessProfile.update({
      where: { id: businessId },
      data: {
        featured_top: setTop !== undefined ? setTop : business.featured_top,
        featured_recommended:
          setRecommended !== undefined ? setRecommended : business.featured_recommended,
      },
      include: { category: true, country: true, city: true },
    });

    return [b];
  });

  await auditService.log(
    {
      action: 'BUSINESS_FEATURED_UPDATED',
      entityType: 'BusinessProfile',
      entityId: businessId,
      before: {
        featuredTop: business.featured_top,
        featuredRecommended: business.featured_recommended,
      },
      after: {
        featuredTop: updated.featured_top,
        featuredRecommended: updated.featured_recommended,
      },
    },
    context,
  );

  return toAdminBusinessDetail(updated);
}

// ── Introductions ──

export async function listIntroductions(): Promise<IntroductionDto[]> {
  const prisma = getPrismaClient();
  const introductions = await prisma.businessIntroduction.findMany({
    orderBy: { created_at: 'desc' },
  });
  return introductions.map(toIntroductionDto);
}

export async function getIntroductionDetail(introductionId: string): Promise<IntroductionDto> {
  const prisma = getPrismaClient();
  const intro = await prisma.businessIntroduction.findUnique({
    where: { id: introductionId },
  });
  if (!intro) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Introduction not found',
      status: 404,
    });
  }
  return toIntroductionDto(intro);
}

export async function approveIntroduction(
  introductionId: string,
  input: IntroductionApproveInput,
  context: RequestContext,
): Promise<IntroductionDto> {
  const prisma = getPrismaClient();
  const intro = await prisma.businessIntroduction.findUnique({ where: { id: introductionId } });
  if (!intro) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Introduction not found',
      status: 404,
    });
  }

  const current = intro.status as IntroductionStatus;
  if (current !== 'SUBMITTED' && current !== 'IN_REVIEW') {
    throw new AppError({
      code: ERROR_CODES.INTRODUCTION_INVALID_STATUS_TRANSITION,
      message: `Cannot approve introduction with status ${current}`,
      status: 409,
    });
  }

  const updated = await prisma.businessIntroduction.update({
    where: { id: introductionId },
    data: { status: 'APPROVED' },
  });

  await auditService.log(
    {
      action: 'INTRODUCTION_APPROVED',
      entityType: 'BusinessIntroduction',
      entityId: introductionId,
      before: { status: current },
      after: { status: 'APPROVED' },
    },
    context,
  );

  return toIntroductionDto(updated);
}

export async function rejectIntroduction(
  introductionId: string,
  input: IntroductionRejectInput,
  context: RequestContext,
): Promise<IntroductionDto> {
  const prisma = getPrismaClient();
  const intro = await prisma.businessIntroduction.findUnique({ where: { id: introductionId } });
  if (!intro) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Introduction not found',
      status: 404,
    });
  }

  const current = intro.status as IntroductionStatus;
  if (current !== 'SUBMITTED' && current !== 'IN_REVIEW') {
    throw new AppError({
      code: ERROR_CODES.INTRODUCTION_INVALID_STATUS_TRANSITION,
      message: `Cannot reject introduction with status ${current}`,
      status: 409,
    });
  }

  const updated = await prisma.businessIntroduction.update({
    where: { id: introductionId },
    data: { status: 'REJECTED', rejection_reason: input.reason },
  });

  await auditService.log(
    {
      action: 'INTRODUCTION_REJECTED',
      entityType: 'BusinessIntroduction',
      entityId: introductionId,
      before: { status: current },
      after: { status: 'REJECTED', reason: input.reason },
    },
    context,
  );

  return toIntroductionDto(updated);
}

export async function completeIntroduction(
  introductionId: string,
  context: RequestContext,
): Promise<IntroductionDto> {
  const prisma = getPrismaClient();
  const intro = await prisma.businessIntroduction.findUnique({ where: { id: introductionId } });
  if (!intro) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Introduction not found',
      status: 404,
    });
  }

  if (intro.status !== 'APPROVED') {
    throw new AppError({
      code: ERROR_CODES.INTRODUCTION_INVALID_STATUS_TRANSITION,
      message: `Cannot complete introduction with status ${intro.status}`,
      status: 409,
    });
  }

  const updated = await prisma.businessIntroduction.update({
    where: { id: introductionId },
    data: { status: 'COMPLETED' },
  });

  await auditService.log(
    {
      action: 'INTRODUCTION_COMPLETED',
      entityType: 'BusinessIntroduction',
      entityId: introductionId,
      before: { status: 'APPROVED' },
      after: { status: 'COMPLETED' },
    },
    context,
  );

  return toIntroductionDto(updated);
}

// ── Taxonomy ──

export async function listCategories(): Promise<any[]> {
  const prisma = getPrismaClient();
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

export async function getCategory(categoryId: string): Promise<any> {
  const prisma = getPrismaClient();
  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Category not found',
      status: 404,
    });
  }
  return category;
}

export async function createCategory(input: CategoryCreateInput): Promise<any> {
  const prisma = getPrismaClient();
  return prisma.category.create({
    data: {
      name: input.name,
      slug: input.slug,
      is_high_risk: input.isHighRisk ?? false,
      is_active: input.isActive ?? true,
    },
  });
}

export async function updateCategory(categoryId: string, input: CategoryUpdateInput): Promise<any> {
  const prisma = getPrismaClient();
  const existing = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!existing) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Category not found',
      status: 404,
    });
  }

  return prisma.category.update({
    where: { id: categoryId },
    data: {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.isHighRisk !== undefined ? { is_high_risk: input.isHighRisk } : {}),
      ...(input.isActive !== undefined ? { is_active: input.isActive } : {}),
    },
  });
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const prisma = getPrismaClient();
  const existing = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!existing) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Category not found',
      status: 404,
    });
  }
  await prisma.category.delete({ where: { id: categoryId } });
}

export async function listCountries(): Promise<any[]> {
  const prisma = getPrismaClient();
  return prisma.country.findMany({ orderBy: { name: 'asc' } });
}

export async function getCountry(countryId: string): Promise<any> {
  const prisma = getPrismaClient();
  const country = await prisma.country.findUnique({ where: { id: countryId } });
  if (!country) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Country not found',
      status: 404,
    });
  }
  return country;
}

export async function createCountry(input: CountryCreateInput): Promise<any> {
  const prisma = getPrismaClient();
  return prisma.country.create({
    data: {
      code2: input.code2,
      code3: input.code3 ?? null,
      name: input.name,
      slug: input.slug,
      is_active: input.isActive ?? true,
    },
  });
}

export async function updateCountry(countryId: string, input: CountryUpdateInput): Promise<any> {
  const prisma = getPrismaClient();
  const existing = await prisma.country.findUnique({ where: { id: countryId } });
  if (!existing) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Country not found',
      status: 404,
    });
  }

  return prisma.country.update({
    where: { id: countryId },
    data: {
      ...(input.code2 !== undefined ? { code2: input.code2 } : {}),
      ...(input.code3 !== undefined ? { code3: input.code3 } : {}),
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.isActive !== undefined ? { is_active: input.isActive } : {}),
    },
  });
}

export async function deleteCountry(countryId: string): Promise<void> {
  const prisma = getPrismaClient();
  const existing = await prisma.country.findUnique({ where: { id: countryId } });
  if (!existing) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Country not found',
      status: 404,
    });
  }
  await prisma.country.delete({ where: { id: countryId } });
}

export async function listCities(): Promise<any[]> {
  const prisma = getPrismaClient();
  return prisma.city.findMany({
    include: { country: { select: { id: true, name: true } } },
    orderBy: { name: 'asc' },
  });
}

export async function getCity(cityId: string): Promise<any> {
  const prisma = getPrismaClient();
  const city = await prisma.city.findUnique({
    where: { id: cityId },
    include: { country: { select: { id: true, name: true } } },
  });
  if (!city) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'City not found',
      status: 404,
    });
  }
  return city;
}

export async function createCity(input: CityCreateInput): Promise<any> {
  const prisma = getPrismaClient();
  const country = await prisma.country.findUnique({ where: { id: input.countryId } });
  if (!country) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Country not found',
      status: 404,
    });
  }

  return prisma.city.create({
    data: {
      country_id: input.countryId,
      name: input.name,
      slug: input.slug,
      is_active: input.isActive ?? true,
    },
    include: { country: { select: { id: true, name: true } } },
  });
}

export async function updateCity(cityId: string, input: CityUpdateInput): Promise<any> {
  const prisma = getPrismaClient();
  const existing = await prisma.city.findUnique({ where: { id: cityId } });
  if (!existing) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'City not found',
      status: 404,
    });
  }

  if (input.countryId !== undefined) {
    const country = await prisma.country.findUnique({ where: { id: input.countryId } });
    if (!country) {
      throw new AppError({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: 'Country not found',
        status: 404,
      });
    }
  }

  return prisma.city.update({
    where: { id: cityId },
    data: {
      ...(input.countryId !== undefined ? { country_id: input.countryId } : {}),
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.slug !== undefined ? { slug: input.slug } : {}),
      ...(input.isActive !== undefined ? { is_active: input.isActive } : {}),
    },
    include: { country: { select: { id: true, name: true } } },
  });
}

export async function deleteCity(cityId: string): Promise<void> {
  const prisma = getPrismaClient();
  const existing = await prisma.city.findUnique({ where: { id: cityId } });
  if (!existing) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'City not found',
      status: 404,
    });
  }
  await prisma.city.delete({ where: { id: cityId } });
}

// ── Subscriptions (Admin Read) ──

export async function listSubscriptions(): Promise<SubscriptionDto[]> {
  const prisma = getPrismaClient();
  const subs = await prisma.vipSubscription.findMany({
    orderBy: { created_at: 'desc' },
  });
  return subs.map(toSubscriptionDto);
}

export async function getSubscriptionDetail(subscriptionId: string): Promise<SubscriptionDto> {
  const prisma = getPrismaClient();
  const sub = await prisma.vipSubscription.findUnique({ where: { id: subscriptionId } });
  if (!sub) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Subscription not found',
      status: 404,
    });
  }
  return toSubscriptionDto(sub);
}

export async function adminCancelSubscription(
  subscriptionId: string,
  context: RequestContext,
): Promise<SubscriptionDto> {
  const prisma = getPrismaClient();
  const sub = await prisma.vipSubscription.findUnique({ where: { id: subscriptionId } });
  if (!sub) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Subscription not found',
      status: 404,
    });
  }

  const updated = await prisma.vipSubscription.update({
    where: { id: subscriptionId },
    data: { cancel_at_period_end: true, canceled_at: new Date() },
  });

  await auditService.log(
    {
      action: 'SUBSCRIPTION_CANCELED',
      entityType: 'VipSubscription',
      entityId: subscriptionId,
      before: { cancelAtPeriodEnd: sub.cancel_at_period_end },
      after: { cancelAtPeriodEnd: true },
    },
    context,
  );

  return toSubscriptionDto(updated);
}

// ── Audit Log ──

export async function listAuditLogs(): Promise<AuditLogDto[]> {
  const prisma = getPrismaClient();
  const logs = await prisma.auditLog.findMany({
    orderBy: { created_at: 'desc' },
    take: 200,
  });
  return logs.map((log: any) => ({
    id: log.id,
    actorStaffId: log.actor_staff_id ?? null,
    actorRole: log.actor_role as any,
    action: log.action as any,
    entityType: log.entity_type,
    entityId: log.entity_id,
    before: log.before_data as Record<string, unknown> | null,
    after: log.after_data as Record<string, unknown> | null,
    ipAddress: log.ip_address ?? null,
    createdAt: log.created_at?.toISOString() ?? new Date().toISOString(),
  }));
}

// ── Stripe Price Config (OWNER) ──

export const STRIPE_PRICE_KEYS = [
  'stripe_price_vip_membership_monthly',
  'stripe_price_business_placement_monthly',
] as const;

export type StripePriceKey = (typeof STRIPE_PRICE_KEYS)[number];

export type StripePricesMap = Record<StripePriceKey, string | null>;

export async function getStripePrices(): Promise<StripePricesMap> {
  const prisma = getPrismaClient();
  const configs = await prisma.adminConfig.findMany({
    where: { key: { in: STRIPE_PRICE_KEYS as unknown as string[] } },
  });

  const result: StripePricesMap = {
    stripe_price_vip_membership_monthly: null,
    stripe_price_business_placement_monthly: null,
  };

  for (const config of configs) {
    result[config.key as StripePriceKey] = (config.value as { priceId?: string })?.priceId ?? null;
  }

  return result;
}

export async function updateStripePrices(
  input: Partial<StripePricesMap>,
  context: RequestContext,
): Promise<StripePricesMap> {
  const prisma = getPrismaClient();

  for (const [key, priceId] of Object.entries(input)) {
    if (!STRIPE_PRICE_KEYS.includes(key as StripePriceKey)) continue;

    await prisma.adminConfig.upsert({
      where: { key },
      create: {
        key,
        value: { priceId },
        description: `Stripe Price ID for ${key.replace('stripe_price_', '')}`,
      },
      update: {
        value: { priceId },
      },
    });
  }

  return getStripePrices();
}

export async function getAdminConfig(key: string): Promise<any> {
  const prisma = getPrismaClient();
  const config = await prisma.adminConfig.findUnique({ where: { key } });
  if (!config) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Config not found',
      status: 404,
    });
  }
  return config;
}

export async function updateAdminConfig(key: string, input: AdminConfigUpdateInput): Promise<any> {
  const prisma = getPrismaClient();
  const existing = await prisma.adminConfig.findUnique({ where: { key } });

  if (existing) {
    return prisma.adminConfig.update({
      where: { key },
      data: {
        value: input.value,
        description: input.description ?? existing.description,
      },
    });
  }

  return prisma.adminConfig.create({
    data: {
      key,
      value: input.value,
      description: input.description ?? null,
    },
  });
}

export async function listStaff(context: RequestContext): Promise<any[]> {
  const prisma = getPrismaClient();
  const staff = await prisma.adminUser.findMany({
    orderBy: { created_at: 'asc' },
  });
  return staff.map((s: any) => ({
    id: s.id,
    phone: s.phone,
    displayName: s.display_name,
    role: s.role,
    isActive: s.is_active,
    totpVerified: !!s.totp_verified_at,
    createdAt: s.created_at.toISOString(),
    updatedAt: s.updated_at.toISOString(),
  }));
}

export async function updateStaffRole(
  staffId: string,
  input: StaffRoleUpdateInput,
  context: RequestContext,
): Promise<any> {
  const prisma = getPrismaClient();
  const staff = await prisma.adminUser.findUnique({ where: { id: staffId } });
  if (!staff) {
    throw new AppError({
      code: ERROR_CODES.RESOURCE_NOT_FOUND,
      message: 'Staff not found',
      status: 404,
    });
  }

  const updated = await prisma.adminUser.update({
    where: { id: staffId },
    data: { role: input.role as any },
  });

  await auditService.log(
    {
      action: 'STAFF_ROLE_UPDATED',
      entityType: 'AdminUser',
      entityId: staffId,
      before: { role: staff.role },
      after: { role: updated.role },
    },
    context,
  );

  return {
    id: updated.id,
    phone: updated.phone,
    displayName: updated.display_name,
    role: updated.role,
    isActive: updated.is_active,
    createdAt: updated.created_at.toISOString(),
    updatedAt: updated.updated_at.toISOString(),
  };
}

// ── DTO Helpers ──

function toAdminUserListItem(user: any): AdminUserListItemDto {
  return {
    id: user.id,
    phone: user.phone,
    displayName: user.display_name,
    status: user.status as UserStatus,
    membershipTier: user.membership_tier as MemberTier,
    createdAt: user.created_at.toISOString(),
  };
}

function toAdminUserDetail(user: any): AdminUserDetailDto {
  return {
    id: user.id,
    phone: user.phone,
    displayName: user.display_name,
    status: user.status as UserStatus,
    membershipTier: user.membership_tier as MemberTier,
    createdAt: user.created_at.toISOString(),
    localePreference: user.locale_preference as Locale | null,
    onboardingComplete: !!(user.display_name && user.locale_preference && user.terms_accepted_at),
    termsAcceptedAt: user.terms_accepted_at?.toISOString() ?? null,
    updatedAt: user.updated_at.toISOString(),
  };
}

function toAdminBusinessDetail(business: any): AdminBusinessDetailDto {
  return {
    id: business.id,
    slug: business.slug,
    name: business.name,
    categoryName: business.category?.name ?? '',
    countryName: business.country?.name ?? '',
    cityName: business.city?.name ?? '',
    briefDescription: business.brief_description,
    websiteUrl: business.website_url,
    socialUrl: business.social_url,
    featuredTop: business.featured_top,
    featuredRecommended: business.featured_recommended,
    description: business.description,
    representativeName: business.representative_name,
    publishedAt: business.published_at?.toISOString() ?? null,
    ownerUserId: business.user_id,
    status: business.status as BusinessStatus,
    representativeEmail: business.representative_email,
    representativePhone: business.representative_phone,
    rejectionReason: business.rejection_reason,
    internalNotes: business.internal_notes,
    approvedAt: business.approved_at?.toISOString() ?? null,
    hiddenAt: business.hidden_at?.toISOString() ?? null,
    createdAt: business.created_at.toISOString(),
    updatedAt: business.updated_at.toISOString(),
  };
}

function toIntroductionDto(intro: any): IntroductionDto {
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


